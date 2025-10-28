const { expect } = require('chai');
const { discounts } = require('../../src/discounts');

describe('Coupon Tests', () => {
  it('should apply PIEROGI-BOGO correctly', () => {
    const order = {
      items: [
        { sku: 'P6-POTATO', qty: 2, unitPriceCents: 699 },
      ],
    };

    const totalDiscount = discounts(order, {}, 'PIEROGI-BOGO');
    expect(totalDiscount).to.equal(349); // 50% off one 6-pack
  });

  it('should apply FIRST10 correctly for orders >= $20', () => {
    const order = {
      items: [
        { sku: 'P24-POTATO', qty: 1, unitPriceCents: 2399 },
      ],
    };

    const totalDiscount = discounts(order, {}, 'FIRST10');
    expect(totalDiscount).to.equal(240); // 10% off
  });

  it('should not apply FIRST10 for orders < $20', () => {
    const order = {
      items: [
        { sku: 'P6-POTATO', qty: 1, unitPriceCents: 699 },
      ],
    };

    const totalDiscount = discounts(order, {}, 'FIRST10');
    expect(totalDiscount).to.equal(0); // No discount
  });

  it('should not apply invalid coupons', () => {
    const order = {
      items: [
        { sku: 'P6-POTATO', qty: 1, unitPriceCents: 699 },
      ],
    };

    const totalDiscount = discounts(order, {}, 'INVALID');
    expect(totalDiscount).to.equal(0); // No discount
  });
});