const { discounts } = require('../../src/discounts');

describe('Discount Calculations', () => {
  
  describe('PIEROGI-BOGO coupon', () => {
    it('should apply 50% off when two 6-packs have the same filling', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO', // could be any valid SKU
            title: '6-pack Potato',
            filling: 'potato', // same filling
            qty: 6,
            unitPriceCents: 1200
          },
          {
            sku: 'P6-POTATO',
            title: '6-pack Potato',
            filling: 'potato', // same filling
            qty: 6,
            unitPriceCents: 1200
          }
        ]
      };

      const profile = { tier: 'guest' };

      const discountTotal = discounts(order, profile, 'PIEROGI-BOGO');
      expect(discountTotal).toBeGreaterThan(0);
      expect(discountTotal).toBe(3600); // 6 * 1200 * 0.5 = 3600 cents
      expect(Number.isInteger(discountTotal)).toBe(true);
    });

    it('should NOT apply discount when fillings differ', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO',
            title: '6-pack Potato',
            filling: 'potato',
            qty: 6,
            unitPriceCents: 1200
          },
          {
            sku: 'P6-SAUER',
            title: '6-pack Sauerkraut',
            filling: 'sauerkraut', // different filling
            qty: 6,
            unitPriceCents: 1200
          }
        ]
      };

      const profile = { tier: 'guest' };

      const discountTotal = discounts(order, profile, 'PIEROGI-BOGO');
      expect(discountTotal).toBe(0);
      expect(Number.isInteger(discountTotal)).toBe(true);
    });
  });

});
