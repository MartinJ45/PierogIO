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
    it('should have all components defined', () => {
      const order = {
        items: [
          {
            sku: 'P6-Potato', // could be any valid SKU (see README.md for examples)
            title: '6-pack Potato',
            kind: 'hot', // could be 'hot' or 'frozen'
            filling: 'potato', // could be 'potato', 'cheese', 'meat', etc.
            qty: 999999, // quantity of this item
            unitPriceCents: 23412, // price per unit in cents
            addOns: [], // could include 'sour-cream', 'fried-onion', 'bacon-bits'
          }
        ]
      };
      
      const context = {
        profile: { tier: 'guest' }, // could be 'guest', 'regular', or 'vip'
        delivery: {
          zone: 'local', // could be 'local' or 'outer'
          rush: true, // boolean indicating rush delivery
        },
      };
      // coupon is optional and omitted here
      const orderTotal = total(order, context);
      expect(orderTotal).toBeGreaterThan(0);
      expect(Number.isInteger(orderTotal)).toBe(true);
    });
    it('should have all components defined', () => {
      const order = {
        items: [
          {
            sku: 'P6-Potato', // could be any valid SKU (see README.md for examples)
            title: '6-pack Potato',
            kind: 'hot', // could be 'hot' or 'frozen'
            filling: 'potato', // could be 'potato', 'cheese', 'meat', etc.
            qty: 0, // quantity of this item
            unitPriceCents: 23412, // price per unit in cents
            addOns: [], // could include 'sour-cream', 'fried-onion', 'bacon-bits'
          }
        ]
      };
      
      const context = {
        profile: { tier: 'guest' }, // could be 'guest', 'regular', or 'vip'
        delivery: {
          zone: 'local', // could be 'local' or 'outer'
          rush: true, // boolean indicating rush delivery
        },
      };
      // coupon is optional and omitted here
      const orderTotal = total(order, context);
      expect(orderTotal).toBeGreaterThan(0);
      expect(Number.isInteger(orderTotal)).toBe(true);
    });
    it('tax applies to hot items and not to frozen items', () => {
      const hotOrder = { items: [ 
        { 
          sku: 'P1', 
          title: 'Hot', 
          kind: 'hot', 
          qty: 1, 
          unitPriceCents: 10000 
        } ] 
      };
      const frozenOrder = { items: [ 
        { 
          sku: 'P2', 
          title: 'Frozen', 
          kind: 'frozen', 
          qty: 1, 
          unitPriceCents: 10000 
        } ] 
      };
      const hotTax = tax(hotOrder, {});
      const frozenTax = tax(frozenOrder, {});

      // Hot items should incur tax (e.g. 8%), frozen items should not
      expect(hotTax).toBeGreaterThan(frozenTax);
    });
  });
});