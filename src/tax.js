const { TaxAPI } = require('../apis/tax-api');

/**
 * Calculate tax for an order (items and optionally delivery)
 * 
 * @param {Object} order - The order object with items array
 * @param {Object} delivery - Delivery information
 * @param {number} deliveryFeeCents - Delivery fee in cents (optional)
 * @returns {number} - Tax amount in cents
 */
function tax(order, delivery, deliveryFeeCents = 0) {
  let hasHotItems = false;
  let totalTax = 0;

  for (const item of order.items) {
    const itemTotal = item.unitPriceCents * item.qty;

    if (item.kind === 'hot') {
      // hot items taxed at 8%
      totalTax += Math.floor(itemTotal * 0.08);
      hasHotItems = true;
    } else if (item.kind === 'frozen') {
      const taxRate = TaxAPI.lookup(item.kind) || 0;
      totalTax += Math.floor(itemTotal * taxRate);
    }
  }

  // Delivery fee is taxable only if there are hot items in the order
  if (hasHotItems && deliveryFeeCents > 0) {
    totalTax += Math.floor(deliveryFeeCents * 0.08);
  }

  return totalTax;
}

module.exports = { tax };
