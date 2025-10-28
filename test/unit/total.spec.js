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

  describe('total()', () => {
    it('does not double-count rush delivery fee', () => {
      const order = {
        items: [
          { id: 'pierogi-1', unitPriceCents: 1000, qty: 1, hot: false }
        ]
      };
      const profile = { tier: 'guest' };
      const delivery = { zone: 'local', rush: true };
      const coupon = null;

      const expected =
        subtotal(order) -
        discounts(order, profile, coupon) +
        deliveryFee(order, delivery, profile) +
        tax(order, delivery);

      const actual = total(order, { profile, delivery, coupon });

      assert.strictEqual(
        actual,
        expected,
        `total() should equal subtotal - discounts + delivery + tax (no duplicate rush). expected=${expected} actual=${actual}`
      );
    });
  });

});
