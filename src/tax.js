const { TaxAPI } = require('../apis/tax-api');
const { deliveryFee } = require('./delivery');

/**
 * Calculate tax for an order
  * 
 * @param {Object} order - The order object with items array
 * @param {Object} delivery - Delivery information
 * @returns {number} - Tax amount in cents
 */
function tax(order, delivery, profile) {
  let hasHotItems = false;
  let totalTax = 0;

  for (const item of order.items) {
    const itemTotal = item.unitPriceCents * item.qty;

    const taxRate = TaxAPI.lookup(item.kind)/10000;
    const itemTax = Math.floor(itemTotal * taxRate);
    totalTax += itemTax;
    hasHotItems = false;
    if (item.kind === 'hot') {
      hasHotItems = true;
    }
  }

  if (hasHotItems) {
    totalTax += Math.floor(deliveryFee(order, delivery, profile) * 0.08);
  }

  return totalTax;
}

module.exports = { tax };
