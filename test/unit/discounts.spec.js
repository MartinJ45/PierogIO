const { discounts } = require('../../src/discounts');

describe('Discounts Calculation', () => {
  test('applies volume discounts for 12-pack and 24-pack', () => {
    const order = {
      items: [
        { unitPriceCents: 1299, qty: 12 },
        { unitPriceCents: 2399, qty: 24 },
      ],
    };
    const profile = { tier: 'guest' };
    expect(discounts(order, profile)).toBe(
      Math.floor(1299 * 12 * 0.05) + Math.floor(2399 * 24 * 0.1)
    );
  });

  test('applies coupon discounts', () => {
    const order = {
      items: [
        { unitPriceCents: 699, qty: 2 },
      ],
    };
    const profile = { tier: 'guest' };
    const couponCode = 'FIRST10';
    expect(discounts(order, profile, couponCode)).toBeGreaterThan(0);
  });

  test('handles no discounts', () => {
    const order = {
      items: [
        { unitPriceCents: 699, qty: 1 },
      ],
    };
    const profile = { tier: 'guest' };
    expect(discounts(order, profile)).toBe(0);
  });
});