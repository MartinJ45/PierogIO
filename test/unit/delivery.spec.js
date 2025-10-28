// test/unit/delivery.spec.js
const { deliveryFee } = require('../../src/delivery');

describe('deliveryFee', () => {
  it('charges the base delivery fee only once per order', () => {
    const order = {
      items: [
        { unitPriceCents: 100, qty: 6 },
        { unitPriceCents: 100, qty: 6 }
      ]
    };
    const delivery = { zone: 'local', rush: false };
    const profile = { tier: 'guest' };

    const fee = deliveryFee(order, delivery, profile);

    expect(fee).toBe(399);
  });
});
