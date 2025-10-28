const { tax } = require('../../src/tax');

describe('Tax Calculation', () => {
  test('applies tax to hot items only', () => {
    const order = {
      items: [
        { unitPriceCents: 699, qty: 2, kind: 'hot' },
        { unitPriceCents: 749, qty: 1, kind: 'frozen' },
      ],
    };
    const delivery = {};
    expect(tax(order, delivery)).toBeGreaterThan(0); // Tax on hot items
  });

  test('taxes delivery fee if hot items are present', () => {
    const order = {
      items: [
        { unitPriceCents: 699, qty: 2, kind: 'hot' },
      ],
    };
    const delivery = { zone: 'local' };
    expect(tax(order, delivery)).toBeGreaterThan(0); // Tax on delivery
  });

  test('no tax for frozen-only orders', () => {
    const order = {
      items: [
        { unitPriceCents: 749, qty: 1, kind: 'frozen' },
      ],
    };
    const delivery = {};
    expect(tax(order, delivery)).toBe(0);
  });
});