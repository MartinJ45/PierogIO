const { total } = require('../../src/total');
const { subtotal } = require('../../src/subtotal');
const { discounts } = require('../../src/discounts');
const { deliveryFee } = require('../../src/delivery');
const { tax } = require('../../src/tax');

describe('Order Calculations', () => {

  describe('total', () => {
    it('composes total from subtotal, discounts, delivery and tax (no rush)', () => {
      const order = {
        items: [
          { sku: 'P6-POTATO', title: '6-pack Potato', kind: 'hot', filling: 'potato', qty: 2, unitPriceCents: 699, addOns: [] }
        ]
      };
      const context = { profile: { tier: 'guest' }, delivery: { zone: 'local', rush: false } };

      const subs = subtotal(order);
      const dis = discounts(order, context.profile);
      const del = deliveryFee(order, context.delivery, context.profile);
      const tx = tax(order, context.delivery);

      const tot = total(order, context);
      expect(tot).toBe(subs - dis + del + tx);
    });

    it('does not tax frozen-only orders', () => {
      const order = {
        items: [
          { sku: 'P6-SAUER', title: '6-pack Sauerkraut', kind: 'frozen', filling: 'sauerkraut', qty: 1, unitPriceCents: 749, addOns: [] }
        ]
      };
      const delivery = { zone: 'local', rush: false };
      const profile = { tier: 'guest' };
      const ctx = { profile, delivery };

      const tx = tax(order, delivery);
      expect(tx).toBe(0);

      const tot = total(order, ctx);
      expect(tot).toBe(subtotal(order) - discounts(order, profile) + deliveryFee(order, delivery, profile));
    });

    it('applies PIEROGI-BOGO when two identical 6-packs of same filling are present', () => {
      const order = {
        items: [
          { sku: 'P6-POTATO', title: '6-pack Potato', kind: 'hot', filling: 'potato', qty: 1, unitPriceCents: 699, addOns: [] },
          { sku: 'P6-POTATO', title: '6-pack Potato', kind: 'hot', filling: 'potato', qty: 1, unitPriceCents: 699, addOns: [] }
        ]
      };
      const profile = { tier: 'guest' };
      const coupon = 'PIEROGI-BOGO';

      const dis = discounts(order, profile, coupon);
      // Expect some discount (approximately half of one 6-pack). Be tolerant of rounding.
      expect(dis).toBeGreaterThan(0);
      expect(dis).toBeLessThanOrEqual(699);

      const tot = total(order, { profile, delivery: { zone: 'local', rush: false }, coupon });
      expect(tot).toBe(subtotal(order) - dis + deliveryFee(order, { zone: 'local', rush: false }, profile) + tax(order, { zone: 'local', rush: false }));
    });

    it('waives base delivery fee when discounted subtotal meets free-delivery thresholds per profile', () => {
      // Use 3x 24-pack to exceed guest threshold ($50 -> 5000 cents)
      const orderGuest = {
        items: [
          { sku: 'P24-POTATO', title: '24-pack Potato', kind: 'hot', filling: 'potato', qty: 3, unitPriceCents: 2399, addOns: [] }
        ]
      };
      const guest = { tier: 'guest' };
      const delGuest = deliveryFee(orderGuest, { zone: 'local', rush: false }, guest);
      expect(delGuest).toBe(0);

      // Use 2x 24-pack to exceed regular threshold ($40 -> 4000 cents)
      const orderRegular = {
        items: [
          { sku: 'P24-POTATO', title: '24-pack Potato', kind: 'hot', filling: 'potato', qty: 2, unitPriceCents: 2399, addOns: [] }
        ]
      };
      const regular = { tier: 'regular' };
      const delRegular = deliveryFee(orderRegular, { zone: 'local', rush: false }, regular);
      expect(delRegular).toBe(0);

      // Use 2x 24-pack to exceed vip threshold ($30 -> 3000 cents)
      const vip = { tier: 'vip' };
      const delVip = deliveryFee(orderRegular, { zone: 'local', rush: false }, vip);
      expect(delVip).toBe(0);
    });

    it('adds rush surcharge of 299 cents when delivery.rush is true', () => {
      const order = {
        items: [
          { sku: 'P6-POTATO', title: '6-pack Potato', kind: 'hot', filling: 'potato', qty: 1, unitPriceCents: 699, addOns: [] }
        ]
      };
      const profile = { tier: 'guest' };
      const baseContext = { profile, delivery: { zone: 'local', rush: false } };
      const rushContext = { profile, delivery: { zone: 'local', rush: true } };

      const totalBase = total(order, baseContext);
      const totalRush = total(order, rushContext);

      expect(totalRush - totalBase).toBe(299);
    });

  });

});
