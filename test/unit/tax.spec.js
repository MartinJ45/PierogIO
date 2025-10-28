const { tax } = require('../../src/tax');

describe('Order Calculations', () => {
  
  describe('total', () => {
    it('should calculate complete order tax', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO', // could be any valid SKU (see README.md for examples)
            title: '6-pack Potato',
            kind: 'hot', // could be 'hot' or 'frozen'
            filling: 'potato', // could be 'potato', 'cheese', 'meat', etc.
            qty: 6, // quantity of this item
            unitPriceCents: 699, // price per unit in cents
            addOns: [], // could include 'sour-cream', 'fried-onion', 'bacon-bits'
          }
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
      
      const orderTax = tax(order, context);
      expect(orderTax).toBeGreaterThan(0);
      expect(Number.isInteger(orderTax)).toBe(true);
      let totalTax = 0;
      for (const item of order.items) {
        if (item.kind === 'hot') {
          totalTax += Math.floor(item.unitPriceCents * item.qty * 0.08);
        }
      }
      expect(orderTax).toBe(totalTax);
    });
  });

});
