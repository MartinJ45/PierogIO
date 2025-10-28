const { TaxAPI } = require('../apis/tax-api');

/**
 * Calculate tax for an order
  * 
 * @param {Object} order - The order object with items array
 * @param {Object} delivery - Delivery information
 * @returns {number} - Tax amount in cents
 */
function tax(order, delivery) {
  let hasHotItems = false;
  let totalTax = 0;

  for (const item of order.items) {
    const itemTotal = item.unitPriceCents * item.qty;

    // Tax applies based on item kind. TaxAPI.lookup returns basis points
    // (e.g. 800 = 8%). Convert to decimal by dividing by 10000.
    const taxRateBp = TaxAPI.lookup(item.kind);
    const taxRate = taxRateBp / 10000;
    if (taxRate > 0) {
      const itemTax = Math.floor(itemTotal * taxRate);
      totalTax += itemTax;
    }

    // Track presence of any hot items (used to determine if delivery is taxable)
    if (item.kind === 'hot') {
      hasHotItems = true;
    }
  }

  // If the order contains any hot items, delivery fee is taxable.
  if (hasHotItems) {
    // Compute delivery fee similarly to deliveryFee logic (simple version):
    // base fee per item by zone, plus rush if applicable.
    let fee = 0;
    for (const item of order.items) {
      if (delivery.zone === 'local') {
        fee += 399;
      } else if (delivery.zone === 'outer') {
        fee += 699;
      }
    }
    if (delivery.rush) {
      fee += 299;
    }

    const deliveryTaxRate = TaxAPI.lookup('hot') / 10000;
    const deliveryTax = Math.floor(fee * deliveryTaxRate);
    totalTax += deliveryTax;
  }

  return totalTax;
}

module.exports = { tax };
