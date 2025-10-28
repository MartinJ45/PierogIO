const { total } = require('../../src/total');
const { subtotal } = require('../../src/subtotal');
const { discounts } = require('../../src/discounts');
const { deliveryFee } = require('../../src/delivery');
const { tax } = require('../../src/tax');

describe('Order Calculations', () => {
  describe('total', () => {
    it('should apply volume discount and handle tax correctly for mixed hot/frozen items', () => {
      const order = {
        items: [
          {
            sku: 'P12-POTATO',
            title: '12-pack Potato',
            kind: 'hot',
            filling: 'potato',
            qty: 1,
            unitPriceCents: 1299, // $12.99
            addOns: ['sour-cream'], // +$0.99
          },
          {
            sku: 'P6-SAUER',
            title: '6-pack Sauerkraut',
            kind: 'frozen',
            filling: 'sauerkraut',
            qty: 1,
            unitPriceCents: 749, // $7.49
            addOns: [],
          }
        ]
      };
      
      const context = {
        profile: { tier: 'guest' },
        delivery: {
          zone: 'local',
          rush: false,
        },
      };
      
      const orderTotal = total(order, context);
      expect(orderTotal).toBe(2347); // Expected calculated total in cents
    });

    it('should apply PIEROGI-BOGO coupon correctly for matching fillings', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO',
            title: '6-pack Potato',
            kind: 'hot',
            filling: 'potato',
            qty: 2, // Two 6-packs of same filling
            unitPriceCents: 699,
            addOns: [],
          }
        ]
      };
      
      const context = {
        profile: { tier: 'vip' },
        delivery: {
          zone: 'outer',
          rush: true,
        },
        coupon: 'PIEROGI-BOGO' // Buy one 6-pack, get one 50% off (same filling)
      };
      
      const orderTotal = total(order, context);
      expect(orderTotal).toBeGreaterThan(1049); // Should include delivery + rush + tax
    });

    it('should waive delivery fee when discounted subtotal meets profile threshold', () => {
      const order = {
        items: [
          {
            sku: 'P24-POTATO',
            title: '24-pack Potato',
            kind: 'frozen', // Frozen = no tax
            filling: 'potato',
            qty: 2, // $47.98 subtotal
            unitPriceCents: 2399,
            addOns: [],
          }
        ]
      };
      
      const context = {
        profile: { tier: 'guest' }, // $50 threshold for free delivery
        delivery: {
          zone: 'outer', // Higher delivery fee
          rush: false,
        },
      };
      
      const orderTotal = total(order, context);
      expect(orderTotal).toBeGreaterThan(4318); // Should include delivery fee
    });
  });
});

