const { TaxAPI } = require('../apis/tax-api');

/**
 * Calculate tax (in cents)
 *
 * Rules implemented:
 * - Taxable base includes only "hot" items (unitPriceCents * qty)
 * - Add-ons for hot items are included in taxable base (supports object add-ons with a price field,
 *   or string add-on lookup if item.addOnPrices is present)
 * - Delivery fee is included in taxable base only if there is at least one hot item
 * - Tax rate: prefer TaxAPI if available (supports basis points or fractional), fallback to 8%
 */

function safeNumber(v, fallback = 0) {
  return (typeof v === 'number' && Number.isFinite(v)) ? v : fallback;
}

function getTaxRateFraction() {
  // default 8%
  let frac = 0.08;
  try {
    // attempt to use TaxAPI if present
    // TaxAPI may export a function or an object with getTaxRate
    // If it returns basis points (e.g., 800) convert to fraction by /10000
    // If it returns a fractional value (0.08) use it directly
    // Keep this synchronous to match existing code expectations
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const TaxAPI = require('../apis/tax-api');
    let rate;
    if (typeof TaxAPI === 'function') {
      rate = TaxAPI();
    } else if (typeof TaxAPI.getTaxRate === 'function') {
      rate = TaxAPI.getTaxRate();
    } else if (typeof TaxAPI.getRate === 'function') {
      rate = TaxAPI.getRate();
    } else if (typeof TaxAPI.rate === 'number') {
      rate = TaxAPI.rate;
    }
    if (typeof rate === 'number' && Number.isFinite(rate)) {
      // basis points (e.g. 800) -> fraction: 800 / 10000 = 0.08
      if (rate > 1) {
        frac = rate / 10000;
      } else {
        frac = rate;
      }
    }
  } catch (err) {
    // TaxAPI not available or failed — fall back to default
  }
  return frac;
}

function sumAddOnsForItem(item) {
  let sum = 0;
  if (!item || !Array.isArray(item.addOns)) return 0;

  for (const add of item.addOns) {
    // add-ons can be objects with priceCents or unitPriceCents
    if (add && typeof add === 'object') {
      const p = safeNumber(add.priceCents, safeNumber(add.unitPriceCents, 0));
      sum += p;
    } else if (typeof add === 'string') {
      // try to lookup price map on item (common pattern)
      if (item.addOnPrices && typeof item.addOnPrices === 'object') {
        const p = safeNumber(item.addOnPrices[add], 0);
        sum += p;
      }
      // otherwise we cannot determine price for string add-on; skip
    }
  }
  return sum;
}

function tax(order, context = {}) {
  const items = (order && Array.isArray(order.items)) ? order.items : [];
  let taxableBase = 0;
  let hasHot = false;

  for (const item of items) {
    if (!item) continue;
    if (item.kind !== 'hot') continue; // tax applies only to hot items
    hasHot = true;
    const qty = safeNumber(item.qty, 0);
    const unit = safeNumber(item.unitPriceCents, 0);
    taxableBase += unit * qty;

    // include add-ons for hot items
    const addOnSumSingle = sumAddOnsForItem(item);
    if (addOnSumSingle > 0) {
      taxableBase += addOnSumSingle * qty;
    }
  }

  // include delivery fee in taxable base only if there is any hot item
  if (hasHot && context && context.delivery) {
    try {
      // require delivery module and compute fee as other parts of app do
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const { deliveryFee } = require('./delivery');
      const deliveryCents = safeNumber(deliveryFee(order, context.delivery, context.profile), 0);
      taxableBase += deliveryCents;
    } catch (err) {
      // ignore if delivery module not present or fails
    }
  }

  const rate = getTaxRateFraction();
  const taxCents = Math.round(taxableBase * rate);

  return taxCents;
}

module.exports = { tax };
