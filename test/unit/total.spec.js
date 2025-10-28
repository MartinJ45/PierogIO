const { total } = require('../../src/total');
const { subtotal } = require('../../src/subtotal');
const { discounts } = require('../../src/discounts');
const { deliveryFee } = require('../../src/delivery');
const { tax } = require('../../src/tax');
const { TaxAPI } = require('../../apis/tax-api');

describe('Order Calculations & Bug Regression Tests', () => {
  // ===== From "Bug regression tests (added)" =====
  describe('Bug regression tests (added)', () => {
    test('FIRST10 coupon returns a positive discount (10% of subtotal)', () => {
      const order = { items: [{ unitPriceCents: 2500, qty: 1 }] }; // $25.00
      const profile = { tier: 'guest' };

      const d = discounts(order, profile, 'FIRST10');

      // Expect 10% of 2500 = 250 cents
      expect(d).toBeGreaterThan(0);
      expect(d).toBe(250);
    });

    test('delivery fee is charged once per order (not per item)', () => {
      const order = {
        items: [
          { unitPriceCents: 1000, qty: 1 },
          { unitPriceCents: 1000, qty: 1 },
          { unitPriceCents: 1000, qty: 1 },
        ],
      };
      const profile = { tier: 'guest' };
      const delivery = { zone: 'local', rush: false };

      const fee = deliveryFee(order, delivery, profile);

      // Expect single local delivery fee = $3.99 -> 399 cents
      expect(fee).toBe(399);
    });

    test('tax is charged on hot items only and computed using TaxAPI', () => {
      const order = { items: [{ unitPriceCents: 1000, qty: 1, kind: 'hot' }] };
      const delivery = { zone: 'local', rush: false };

      const rate = TaxAPI.lookup('hot') / 10000; // TaxAPI returns basis points
      const expectedTax = Math.floor(1000 * 1 * rate);

      const t = tax(order, delivery);
      expect(t).toBe(expectedTax);
    });

    test('total does not double-charge rush fee', () => {
      const order = { items: [{ unitPriceCents: 1000, qty: 1, kind: 'hot' }] };
      const context = {
        profile: { tier: 'guest' },
        delivery: { zone: 'local', rush: true },
      };

      const expectedSubtotal = subtotal(order);
      const expectedDiscounts = discounts(order, context.profile, context.coupon);
      const expectedDelivery = deliveryFee(order, context.delivery, context.profile);
      const expectedTax = tax(order, context.delivery);

      const expectedTotal =
        expectedSubtotal - expectedDiscounts + expectedDelivery + expectedTax;

      const got = total(order, context);
      expect(got).toBe(expectedTotal);
    });
  });

  // ===== From "Order Calculations" =====
  describe('Order Calculations', () => {
    describe('total', () => {
      it('should calculate complete order total', () => {
        const order = {
          items: [
            {
              sku: 'P6-POTATO', // could be any valid SKU
              title: '6-pack Potato',
              kind: 'hot', // 'hot' or 'frozen'
              filling: 'potato',
              qty: 6,
              unitPriceCents: 699,
              addOns: [], // e.g., 'sour-cream', 'fried-onion', 'bacon-bits'
            },
          ],
        };

        const context = {
          profile: { tier: 'guest' }, // 'guest' | 'regular' | 'vip'
          delivery: {
            zone: 'local', // 'local' | 'outer'
            rush: false,
          },
          // coupon optional
        };

        const orderTotal = total(order, context);
        expect(orderTotal).toBeGreaterThan(0);
        expect(Number.isInteger(orderTotal)).toBe(true);
      });
    });
  });
});