const { total } = require('../../src/total');
const { deliveryFee } = require('../../src/delivery');
const { tax } = require('../../src/tax');
const { discounts } = require('../../src/discounts');

describe('Bug Finder Tests', () => {
  
  it('BUG: FIRST10 coupon should return positive discount value', () => {
    const order = { items: [{ sku: 'P12-POTATO', kind: 'hot', filling: 'potato', qty: 12, unitPriceCents: 1299, addOns: [] }] };
    const profile = { tier: 'guest' };
    const discount = discounts(order, profile, 'FIRST10');
    expect(discount).toBeGreaterThan(0); 
    expect(discount).toBe(2337); 
  });
});

