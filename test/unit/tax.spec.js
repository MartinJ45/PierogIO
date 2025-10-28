const { tax } = require('../../src/tax');

describe('Tax Calculations', () => {
  
  it('should apply 8% tax to hot items', () => {
    const order = {
      items: [
        {
          sku: 'P6-POTATO',
          title: '6-pack Potato',
          kind: 'hot',
          filling: 'potato',
          qty: 6,
          unitPriceCents: 699,
          addOns: [],
        }
      ]
    };
    
    const delivery = {
      zone: 'local',
      rush: false,
    };
    
    const taxAmount = tax(order, delivery);
    
    // Expected: 699 * 6 = 4194 cents
    // Tax at 8% (0.08): 4194 * 0.08 = 335.52, floored to 335 
    const expectedTax = Math.floor(699 * 6 * 0.08);
    
    expect(taxAmount).toBe(expectedTax);
    expect(taxAmount).toBe(335);
  });
  
});
