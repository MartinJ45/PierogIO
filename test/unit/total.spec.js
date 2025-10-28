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

  describe('Total Calculation', () => {
    test('calculates total for a simple order', () => {
      const order = {
        items: [
          { unitPriceCents: 699, qty: 2, kind: 'hot' },
        ],
      };
      const delivery = { zone: 'local', rush: false };
      const profile = { tier: 'guest' };
      const couponCode = null;

      const context = { profile, delivery, coupon: couponCode };
      expect(total(order, context)).toBeGreaterThan(0);
    });

    test('includes all components in total', () => {
      const order = {
        items: [
          { unitPriceCents: 699, qty: 2, kind: 'hot', addOns: ['sour-cream'] },
          { unitPriceCents: 749, qty: 1, kind: 'frozen' },
        ],
      };
      const delivery = { zone: 'outer', rush: true };
      const profile = { tier: 'regular' };
      const couponCode = 'FIRST10';

      const context = { profile, delivery, coupon: couponCode };
      const result = total(order, context);
      expect(result).toBeGreaterThan(0);
    });

    test('handles empty order', () => {
      const order = { items: [] };
      const delivery = { zone: 'local', rush: false };
      const profile = { tier: 'guest' };
      const couponCode = null;

      const context = { profile, delivery, coupon: couponCode };
      expect(total(order, context)).toBe(0);
    });
  });

});
