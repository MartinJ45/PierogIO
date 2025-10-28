const { tax } = require('../../src/tax');

describe('tax', () => {
  it('should tax hot items at the hot tax rate (8%)', () => {
    const order = {
      items: [
        {
          sku: 'P6-HOT',
          title: '6-pack Hot',
          kind: 'hot',
          filling: 'potato',
          qty: 1,
          unitPriceCents: 1000,
          addOns: []
        }
      ]
    };

    const delivery = { zone: 'local', rush: false };

    const result = tax(order, delivery);

    // Tax should be floor(1000 * 0.08) = 80 cents
    expect(result).toBe(80);
  });

  it('should not tax frozen items', () => {
    const order = {
      items: [
        {
          sku: 'P6-FRZ',
          title: '6-pack Frozen',
          kind: 'frozen',
          filling: 'cheese',
          qty: 2,
          unitPriceCents: 500,
          addOns: []
        }
      ]
    };

    const delivery = { zone: 'local', rush: false };

    const result = tax(order, delivery);

    expect(result).toBe(0);
  });
});
