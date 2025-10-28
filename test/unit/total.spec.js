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

  describe('deliveryFee', () => {
    // Free Delivery Thresholds per tier
    describe('Free Delivery Thresholds', () => {
      it('should waive delivery for guest when subtotal >= $50', () => {
        const order = {
          items: [
            { sku: 'ITEM-GUEST', qty: 5, unitPriceCents: 1000 }, // subtotal = 5000
          ],
        };
        const delivery = { zone: 'local', rush: false };
        const profile = { tier: 'guest' };

        const fee = deliveryFee(order, delivery, profile);
        expect(fee).toBe(0);
      });

      it('should waive delivery for regular when subtotal >= $40', () => {
        const order = {
          items: [
            { sku: 'ITEM-REGULAR', qty: 4, unitPriceCents: 1000 }, // subtotal = 4000
          ],
        };
        const delivery = { zone: 'local', rush: false };
        const profile = { tier: 'regular' };

        const fee = deliveryFee(order, delivery, profile);
        expect(fee).toBe(0);
      });

      it('should waive delivery for vip when subtotal >= $30', () => {
        const order = {
          items: [
            { sku: 'ITEM-VIP', qty: 3, unitPriceCents: 1000 }, // subtotal = 3000
          ],
        };
        const delivery = { zone: 'local', rush: false };
        const profile = { tier: 'vip' };

        const fee = deliveryFee(order, delivery, profile);
        expect(fee).toBe(0);
      });

      it('should NOT waive delivery if subtotal is just below threshold', () => {
        const order = {
          items: [
            { sku: 'ITEM-GUEST', qty: 4, unitPriceCents: 999 }, // subtotal = 3996 < 4000
          ],
        };
        const delivery = { zone: 'local', rush: false };
        const profile = { tier: 'regular' };

        const fee = deliveryFee(order, delivery, profile);
        expect(fee).toBeGreaterThan(0);
      });
    });

    // Fee should not multiply by number of items
    describe('Delivery fee should only charge once per order', () => {
      it('should charge a single delivery fee regardless of item count', () => {
        const orderOneItem = {
          items: [
            { sku: 'ONE', qty: 1, unitPriceCents: 1000 },
          ],
        };
        const orderThreeItems = {
          items: [
            { sku: 'A', qty: 1, unitPriceCents: 1000 },
            { sku: 'B', qty: 1, unitPriceCents: 1000 },
            { sku: 'C', qty: 1, unitPriceCents: 1000 },
          ],
        };
        const delivery = { zone: 'local', rush: false };
        const profile = { tier: 'guest' };

        const oneFee = deliveryFee(orderOneItem, delivery, profile);
        const threeFee = deliveryFee(orderThreeItems, delivery, profile);
        expect(threeFee).toBe(oneFee);
      });
    });
  });
});
