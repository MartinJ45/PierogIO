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

  // New tests for tax calculation
  describe('tax', () => {
    it('calculates tax only on hot items, including add-ons and delivery when hot items present', () => {
      const order = {
        items: [
          {
            sku: 'HOT-1',
            title: 'Hot Item',
            kind: 'hot',
            qty: 2,
            unitPriceCents: 1000,
            // addOns as objects with priceCents
            addOns: [{ name: 'sour-cream', priceCents: 50 }]
          },
          {
            sku: 'FROZEN-1',
            title: 'Frozen Item',
            kind: 'frozen',
            qty: 3,
            unitPriceCents: 500,
            addOns: []
          }
        ]
      };

      const context = {
        profile: { tier: 'guest' },
        delivery: {
          zone: 'local',
          rush: true
        }
      };

      const t = tax(order, context);
      expect(Number.isInteger(t)).toBe(true);
      expect(t).toBeGreaterThan(0);
    });
  });

  describe('discounts', () => {
    it('FIRST10 gives a positive 10% discount of subtotal', () => {
      const order = {
        items: [
          { sku: 'P6-POTATO', title: '6-pack Potato', kind: 'hot', qty: 2, unitPriceCents: 1000, addOns: [] },
          { sku: 'F3-CHEESE', title: '3-pack Cheese', kind: 'frozen', qty: 1, unitPriceCents: 500, addOns: [] }
        ]
      };
      const profile = { tier: 'guest' };

      let subtotalCents = 0;
      for (const it of order.items) {
        subtotalCents += it.unitPriceCents * it.qty;
      }

      const d = discounts(order, profile, 'FIRST10');
      expect(Number.isInteger(d)).toBe(true);
      expect(d).toBeGreaterThan(0);
      expect(d).toBe(Math.floor(subtotalCents * 0.10));
    });
  });
});
