const { deliveryFee } = require('../../src/delivery');

describe('deliveryFee', () => {
  it('should charge base delivery once per order, not per item', () => {
    const order = {
      items: [
        { unitPriceCents: 500, qty: 1 },
        { unitPriceCents: 500, qty: 1 }
      ]
    };

    const delivery = { zone: 'local', rush: false };
    const profile = { tier: 'guest' };

    // Expect base local delivery to be $3.99 (399 cents) once per order
    const fee = deliveryFee(order, delivery, profile);
    expect(fee).toBe(399);
  });
});
