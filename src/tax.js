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
    console.log(item);
    const itemTotal = item.unitPriceCents * item.qty;

    const taxRate = TaxAPI.lookup(item.kind);
    const itemTax = Math.floor(itemTotal * taxRate / 10000);
    totalTax += itemTax;
    hasHotItems = false;
    
    if (item.kind === 'hot') {
      hasHotItems = true;
    }
    console.log("total tax" + totalTax);
  }
  if (hasHotItems) {
    const deliveryTaxRate = TaxAPI.lookup('hot');
    const orderDelivery = deliveryFee(order, delivery, profile);
    const deliveryTax = Math.floor(orderDelivery * deliveryTaxRate / 10000);
    totalTax += deliveryTax;
  }
  console.log("tax after delivery" + totalTax);
  return totalTax;
}

module.exports = { tax };
