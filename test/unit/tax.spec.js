const { tax } = require('../../src/tax');

describe('Tax calculation', () => {
  it('applies 8% tax to hot items and taxes delivery when hot items present', () => {
    const order = {
      items: [
        {
          sku: 'P6-CHEESE',
          title: '6-pack Cheese',
          kind: 'hot',
          filling: 'cheese',
          qty: 2,
          unitPriceCents: 699,
        }
      ]
    };

    const delivery = {
      zone: 'local',
      rush: false,
    };

    // Item total = 2 * 699 = 1398 cents
    // Hot tax = floor(1398 * 0.08) = 111
    // Delivery fee for one item in 'local' zone = 399 -> delivery tax = floor(399 * 0.08) = 31
    // Total tax expected = 111 + 31 = 142 cents
    const expectedTax = 142;

    const actualTax = tax(order, delivery);
    expect(actualTax).toBe(expectedTax);
  });
});
