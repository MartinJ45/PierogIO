const { subtotal } = require('../../src/subtotal');

describe('Subtotal Calculation', () => {
  test('calculates subtotal for items without add-ons', () => {
    const order = {
      items: [
        { unitPriceCents: 699, qty: 2 },
        { unitPriceCents: 749, qty: 1 },
      ],
    };
    expect(subtotal(order)).toBe(2147); // 699*2 + 749*1
  });

  test('calculates subtotal for items with add-ons', () => {
    const order = {
      items: [
        { unitPriceCents: 699, qty: 2, addOns: ['sour-cream', 'bacon-bits'] },
      ],
    };
    expect(subtotal(order)).toBe(699 * 2 + (99 + 199) * 2); // Base + add-ons
  });

  test('handles empty order', () => {
    const order = { items: [] };
    expect(subtotal(order)).toBe(0);
  });
});