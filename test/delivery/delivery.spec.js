const { deliveryFee } = require('../../src/delivery');

test('should charge a single delivery fee per order, not per item', () => {
  const order = {
    items: [
      { unitPriceCents: 1000, qty: 1 },
      { unitPriceCents: 2000, qty: 1 }
    ]
  };

  const delivery = { zone: 'local', rush: false };
  const profile = { tier: 'guest' };

  const fee = deliveryFee(order, delivery, profile);
  expect(fee).toBe(399); // expected one flat fee
});