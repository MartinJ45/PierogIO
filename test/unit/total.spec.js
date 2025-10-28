const { total } = require('../../src/total');
const { subtotal } = require('../../src/subtotal');
const { discounts } = require('../../src/discounts');
const { deliveryFee } = require('../../src/delivery');
const { tax } = require('../../src/tax');

describe('Order Calculations', () => {
  
  describe('total', () => {
    it('should calculate complete order total', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO', // could be any valid SKU (see README.md for examples)
            title: '6-pack Potato',
            kind: 'hot', // could be 'hot' or 'frozen'
            filling: 'potato', // could be 'potato', 'cheese', 'meat', etc.
            qty: 6, // quantity of this item
            unitPriceCents: 699, // price per unit in cents
            addOns: [], // could include 'sour-cream', 'fried-onion', 'bacon-bits'
          }
        ]
      };
      
      const context = {
        profile: { tier: 'guest' }, // could be 'guest', 'regular', or 'vip'
        delivery: {
          zone: 'local', // could be 'local' or 'outer'
          rush: false, // boolean indicating rush delivery
        },
        // coupon is optional and omitted here
      };
      
      const orderTotal = total(order, context);
      expect(orderTotal).toBeGreaterThan(0);
      expect(Number.isInteger(orderTotal)).toBe(true);
    });

    it('applies FIRST10 coupon as 10% off orders $20 or more', () => {
      // Create an order with subtotal >= $20.00 (2000 cents)
      const order = {
        items: [
          {
            sku: 'P12-CHEESE',
            title: '12-pack Cheese',
            kind: 'hot',
            filling: 'cheese',
            qty: 2,
            unitPriceCents: 1200,
            addOns: [],
          }
        ]
      };

      const profile = { tier: 'guest' };
      const coupon = 'FIRST10';

      // discounts() should return a positive cents amount equal to 10% of subtotal
      const discountAmount = discounts(order, profile, coupon);
      const expectedDiscount = Math.floor(subtotal(order) * 0.10);

      expect(discountAmount).toBe(expectedDiscount);
    });
  });



});
