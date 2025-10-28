const { deliveryFee } = require('../../src/delivery');

describe('Delivery Fee Calculation', () => {
  test('calculates delivery fee for local zone', () => {
    const order = { items: [] };
    const delivery = { zone: 'local', rush: false };
    const profile = { tier: 'guest' };
    expect(deliveryFee(order, delivery, profile)).toBe(399); // Local zone base fee
  });

  test('applies rush delivery surcharge', () => {
    const order = { items: [] };
    const delivery = { zone: 'local', rush: true };
    const profile = { tier: 'guest' };
    expect(deliveryFee(order, delivery, profile)).toBe(399 + 299); // Base + rush surcharge
  });

  test('waives delivery fee for VIPs meeting threshold', () => {
    const order = { items: [{ unitPriceCents: 1299, qty: 24 }] };
    const delivery = { zone: 'outer', rush: false };
    const profile = { tier: 'vip' };
    expect(deliveryFee(order, delivery, profile)).toBe(0); // Free delivery
  });
});