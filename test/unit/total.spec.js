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
            unitPriceCents: 1000, // price per unit in cents
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
        coupon: {
          code: 'FREE-Pierogi',
          type: 'order',
          discount: 10000 // 10.00 off
        }
        // coupon is optional and omitted here
      };
      
      const orderTotal = total(order, context);
      expect(orderTotal).toBeGreaterThan(0);
      expect(Number.isInteger(orderTotal)).toBe(true);
    });
  });


  describe('Free Promo', () => {
    it('should make order free from FREE promo code', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO', // could be any valid SKU (see README.md for examples)
            title: '6-pack Potato',
            kind: 'hot', // could be 'hot' or 'frozen'
            filling: 'potato', // could be 'potato', 'cheese', 'meat', etc.
            qty: 1, // quantity of this item
            unitPriceCents: 1000, // price per unit in cents
            addOns: [], // could include 'sour-cream', 'fried-onion', 'bacon-bits'
          }
        ]
      };

      const context = {
        profile: { tier: 'regular' },
        delivery: { zone: 'local', rush: false },
        coupon: { code: 'FREE100', type: 'order', discountCents: 1000 } // intends to fully discount item
      };

      const orderTotal = total(order, context);
      console.log('Order Total with 100% coupon:', orderTotal);
      expect(orderTotal).toBe(0);
    });
  });

});
