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

    it('composes subtotal, discounts, deliveryFee, and tax correctly', () => {
      const order = {
        items: [
          {
            sku: 'P6-CHEESE', kind: 'hot', filling: 'cheese', qty: 12, unitPriceCents: 800, addOns: ['sour-cream'],
            sku: 'P12-MUSHROOM', kind: 'frozen', filling: 'mushroom', qty: 6, unitPriceCents: 1200, addOns: []
          }
        ]
      };
      
      const context = {
        profile: { tier: 'regular' },
        delivery: { zone: 'local', rush: false },
        coupon: 'FIRST10'
      };
      
      const s = subtotal(order);
      const d = discounts(order, context.profile, context.coupon);
      const del = deliveryFee(order, context.delivery, context.profile);
      const t = tax(order, context.delivery);

      let expected = s - d + del + t;
      if (context.delivery.rush) {
        expected += 299;
      }
      if (expected > 10000) {
        const formatted = (expected / 100).toFixed(2);
        expected = parseInt(formatted + "00");
      }

      const actual = total(order, context);
      expect(actual).toBe(expected);
    });

  });
});
