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

  describe('total', () => {
    it('Playing around with values', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO', // could be any valid SKU (see README.md for examples)
            title: '6-pack Potato',
            kind: 'frozen', // could be 'hot' or 'frozen'
            filling: 'meat', // could be 'potato', 'cheese', 'meat', etc.
            qty: 1000000000000, // quantity of this item
            unitPriceCents: 699000000, // price per unit in cents
            addOns: [], // could include 'sour-cream', 'fried-onion', 'bacon-bits'
          }
        ]
      };
      
      const context = {
        profile: { tier: 'vip' }, // could be 'guest', 'regular', or 'vip'
        delivery: {
          zone: 'outer', // could be 'local' or 'outer'
          rush: false, // boolean indicating rush delivery
        },
        // coupon is optional and omitted here
      };
      
      const orderTotal = total(order, context);
      expect(orderTotal).toBeGreaterThan(0);
      expect(Number.isInteger(orderTotal)).toBe(true);
    });
  });

  describe('total', () => {
    it('it should add delivery rush fee (299) only once', () => {
      const order = {
        items: [
          {
            sku: 'P3-CHEESE',
            title: '3-pack Cheese',
            kind: 'hot',
            filling: 'cheese',
            qty: 2,
            unitPriceCents: 450,
            addOns: []
          },
          {
            sku: 'P1-POTATO',
            title: '1-pack Potato',
            kind: 'hot',
            filling: 'potato',
            qty: 1,
            unitPriceCents: 199,
            addOns: []
          }
        ]
      };

      const ctxRush = {
        profile: { tier: 'guest' },
        delivery: { 
          zone: 'local', 
          rush: true 
        }
      };

      const ctxNoRush = {
        profile: { tier: 'guest' },
        delivery: { 
          zone: 'local', 
          rush: false 
        }
      };

      const feeWithRush = total(order, ctxRush);
      const feeWithoutRush = total(order, ctxNoRush);

      // difference between delivery fees when enabling rush should be exactly the single rush surcharge (299 cents)
      expect(feeWithRush - feeWithoutRush).toBe(299);
    });
  });

});
