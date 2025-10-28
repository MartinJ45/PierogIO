const { subtotal } = require('../../src/subtotal');
const { discounts } = require('../../src/discounts');
const { deliveryFee } = require('../../src/delivery');
const { tax } = require('../../src/tax');

describe('Discount Calculations', () => {
  describe('Discount', () => {
    it('FIRST10 should not apply for order less than 20', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO', // could be any valid SKU (see README.md for examples)
            title: '6-pack Potato',
            kind: 'hot', // could be 'hot' or 'frozen'
            filling: 'potato', // could be 'potato', 'cheese', 'meat', etc.
            qty: 1, // quantity of this item
            unitPriceCents: 699, // price per unit in cents
            addOns: [], // could include 'sour-cream', 'fried-onion', 'bacon-bits'
          }
        ]
      };

      const profile = { tier: 'guest' };
      
      const discount = discounts(order, profile, "FIRST10");
      expect(Number.isInteger(discount)).toBe(true);
      expect(discount).equal(0);
    });
  });
});
