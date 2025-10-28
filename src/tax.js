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
    const taxRateBasisPoints = TaxAPI.lookup(item.kind);
    // Convert basis points to decimal (divide by 10000)
    const itemTax = Math.floor(itemTotal * taxRateBasisPoints / 10000);
    totalTax += itemTax;
    
    if (item.kind === 'hot') {
      hasHotItems = true;
    }
  }

  return totalTax;
}

module.exports = { tax };
