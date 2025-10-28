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
            qty: 1, // quantity of this item
            unitPriceCents: 699, // price per unit in cents
            addOns: [], // could include 'sour-cream', 'fried-onion', 'bacon-bits'
          }
        ]
      };

      const order2 = {
        items: [
          {
            sku: 'P6-POTATO', // could be any valid SKU (see README.md for examples)
            title: '6-pack Potato',
            kind: 'hot', // could be 'hot' or 'frozen'
            filling: 'potato', // could be 'potato', 'cheese', 'meat', etc.
            qty: 0, // quantity of this item
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

      const context2 = {
        profile: { tier: 'guest' }, // could be 'guest', 'regular', or 'vip'
        delivery: {
          zone: 'local', // could be 'local' or 'outer'
          rush: true, // boolean indicating rush delivery
        },
        // coupon is optional and omitted here
      };
      
      const orderTotal = total(order, context);
      const orderTotal2 = total(order2, context);
      const orderTotal3 = total(order2, context2);

      //console.log('orderTotal2 should be 0: ' + orderTotal2);

      expect(orderTotal).toBeGreaterThan(0);
      if(order2.qty <= 0){
        expect(orderTotal2).toBe(0);
        expect(orderTotal3).toBe(0);
      }
      expect(Number.isInteger(orderTotal)).toBe(true);
    });
  });

});
