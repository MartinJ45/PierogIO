const { deliveryFee } = require('../../src/delivery');

describe('deliveryFee edge cases', () => {
  it('gives free delivery when discounted subtotal equals threshold (inclusive)', () => {
    const order = {
      items: [
        { sku: 'X', qty: 1, unitPriceCents: 5000 }
      ]
    };
    const delivery = { zone: 'local', rush: false };
    const profile = { tier: 'guest' }; // threshold 5000
    expect(deliveryFee(order, delivery, profile)).toBe(0);
  });
});