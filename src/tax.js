const { TaxAPI } = require('../apis/tax-api');

/**
 * Calculate tax for an order
  * 
 * @param {Object} order - The order object with items array
 * @param {Object} delivery - Delivery information
 * @returns {number} - Tax amount in cents
 */
function tax(order, delivery) {
  // TaxAPI.lookup returns rates in basis-points per 10000 (e.g. 800 -> 8%)
  let hasHotItems = false;
  let totalTax = 0;

  for (const item of order.items) {
    const itemTotal = item.unitPriceCents * item.qty;

    if (item.kind === 'hot') {
      const taxRateBp = TaxAPI.lookup(item.kind);
      const itemTax = Math.floor(itemTotal * taxRateBp / 10000);
      totalTax += itemTax;
      hasHotItems = true;
    }
  }

  // Note: delivery fee tax (if any) could be added here if the order contains hot items.
  return totalTax;
}

module.exports = { tax };
