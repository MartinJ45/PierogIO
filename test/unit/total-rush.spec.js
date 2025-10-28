const { total } = require('../../src/total');

describe('total (rush)', () => {
  it('should only charge rush fee once', () => {
    const order = {
      items: [
        { unitPriceCents: 1000, qty: 1, kind: 'frozen' }
      ]
    };

    const context = {
      profile: { tier: 'guest' },
      delivery: { zone: 'local', rush: true }
    };

    // subtotal 1000 + delivery 399 + rush 299 = 1698
    const result = total(order, context);
    expect(result).toBe(1698);
  });
});
