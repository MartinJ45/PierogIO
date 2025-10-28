const { tax } = require('../../src/tax');

describe('tax', () => {
  it('should apply 8% tax on hot items', () => {
    const order = {
      items: [
        { unitPriceCents: 1000, qty: 1, kind: 'hot' }
      ]
    };

    const delivery = { zone: 'local', rush: false };

    // 8% of 1000 = 80 cents
    const computed = tax(order, delivery);
    expect(computed).toBe(80);
  });
});
