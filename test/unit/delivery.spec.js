const { deliveryFee } = require('../../src/delivery');

describe('deliveryFee', () => {
  it('gives free delivery when discounted subtotal equals the threshold (>=)', () => {
    const order = {
      items: [
        { unitPriceCents: 5000, qty: 1 }
      ]
    };
    const delivery = { zone: 'local', rush: false };
    const profile = { tier: 'guest' }; // guest threshold = 5000

    const fee = deliveryFee(order, delivery, profile);
    expect(fee).toBe(0);
  });

  it('charges a flat fee per order (not per line item)', () => {
    const orderOneLine = {
      items: [
        { unitPriceCents: 1000, qty: 1 }
      ]
    };
    const orderTwoLines = {
      items: [
        { unitPriceCents: 1000, qty: 1 },
        { unitPriceCents: 1000, qty: 1 }
      ]
    };
    const delivery = { zone: 'local', rush: false };
    const profile = { tier: 'guest' };

    const feeOne = deliveryFee(orderOneLine, delivery, profile);
    const feeTwo = deliveryFee(orderTwoLines, delivery, profile);

    expect(feeOne).toBe(399);
    expect(feeTwo).toBe(399);
  });
});