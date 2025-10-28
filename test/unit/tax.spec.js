const { total } = require('../../src/total');
const { subtotal } = require('../../src/subtotal');
const { discounts } = require('../../src/discounts');
const { deliveryFee } = require('../../src/delivery');
const { tax } = require('../../src/tax');

describe('Hot Item Tax', () => {
  
  describe('total', () => {
    it('hasHotItem should be true if one hot item exists', () => {
      const order = {
        items: [
            { sku: 'P6-POTATO', kind: 'hot', qty: 1, unitPriceCents: 1000 },
            { sku: 'P6-CHEESE', kind: 'frozen', qty: 1, unitPriceCents: 500 }
        ]
      };
      
      const context = {
        profile: { tier: 'guest' }, // could be 'guest', 'regular', or 'vip'
        delivery: {
          zone: 'local', // could be 'local' or 'outer'
          rush: false, // boolean indicating rush delivery
        },
        // coupon is optional and omitted here
      };
      
        const orderTotal = total(order, context);
        const { totalTax, hasHotItems } = tax(order, context.delivery);
        expect(hasHotItems).toBe(true);
        expect(orderTotal).toBeGreaterThan(0);
    });
  });

});