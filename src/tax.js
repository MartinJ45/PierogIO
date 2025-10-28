const { TaxAPI } = require('../apis/tax-api');

/**
 * Calculate tax for an order
  * 
 * @param {Object} order - The order object with items array
 * @param {Object} delivery - Delivery information
 * @returns {number} - Tax amount in cents
 */
function tax(order, delivery) {
  // Determine tax for taxable items. TaxAPI.lookup returns basis points
  // (for example, hot => 800 which means 0.08). Convert to a decimal
  // by dividing by 10_000 before applying to item totals.
  let hasHotItems = false;
  let totalTax = 0;

  for (const item of order.items) {
    const itemTotal = item.unitPriceCents * item.qty;

    if (item.kind === 'hot') {
      const taxRateBp = TaxAPI.lookup(item.kind);
      const taxRate = taxRateBp / 10000;
      const itemTax = Math.floor(itemTotal * taxRate);
      totalTax += itemTax;
      hasHotItems = true;
    }
  }

  // Note: delivery fee taxation depends on whether order contains hot items.
  // The delivery amount is computed elsewhere; if needed the tax on delivery
  // should be computed where delivery fee is available. For now, return
  // tax calculated on items only.

  return totalTax;
}

module.exports = { tax };
