const { total } = require('../../src/total');
const { subtotal } = require('../../src/subtotal');
const { applyCoupon, discounts } = require('../../src/discounts');
const { deliveryFee } = require('../../src/delivery');
const { tax } = require('../../src/tax');
import { expectTypeOf } from 'vitest';
// const { expectTypeOf } = require('vitest');

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
      expectTypeOf(orderTotal).toBeNumber();
      discounts(order, context.profile, context.coupon);
      subtotal(order);
      deliveryFee(order, context.delivery, context.profile);
      tax(order, context.delivery);
    });
  });
  it('total should be non-negative', () => {
    const order = {
      items: []
    };
    const context = {
      profile: { tier: 'guest' }, // could be 'guest', 'regular', or 'vip'
      delivery: {
        zone: 'local', // could be 'local' or 'outer'
        rush: false, // boolean indicating rush delivery
      },
      coupon: 'FIRST10',      
      
      // coupon is optional and omitted here
    };
    applyCoupon(context.coupon, order);
    const orderTotal = total(order, context);
    expect(orderTotal).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(orderTotal)).toBe(true);
    expectTypeOf(orderTotal).toBeNumber();
  } );
});
