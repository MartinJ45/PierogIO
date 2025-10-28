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
  });

  describe('total - large order behavior', () => {
    it('should return a total greater than 10000 cents for a $200 item (fails with current bug)', () => {
      const order = {
        items: [
          {
            sku: 'P24-SPECIAL',
            title: '24-pack Special',
            kind: 'hot',
            filling: 'meat',
            qty: 1,
            unitPriceCents: 20000,
            addOns: []
          }
        ]
      };

      const context = {
        profile: { tier: 'guest' },
        delivery: {
          zone: 'local',
          rush: false
        }
      };

      const orderTotal = total(order, context);

      // Intentionally assert that total stays above the cents threshold.
      // The current implementation contains a bug that corrupts totals > 10000,
      // so this assertion is expected to fail first.
      expect(orderTotal).toBeGreaterThan(10000);

      // Additional sanity checks
      expect(Number.isInteger(orderTotal)).toBe(true);
      expect(orderTotal).toBeGreaterThan(0);
    });
  });

});
