const fc = require('fast-check');
const { total } = require('../../src/total');
const { referenceTotal } = require('../../src/reference');

describe('Property-Based Tests for Orders', () => {
  
  // Arbitrary generators
  const addOnArb = fc.constantFrom('sour-cream', 'fried-onion', 'bacon-bits');
  const fillingArb = fc.constantFrom('potato', 'sauerkraut', 'sweet-cheese', 'mushroom');
  const kindArb = fc.constantFrom('hot', 'frozen');
  const tierArb = fc.constantFrom('guest', 'regular', 'vip');
  const zoneArb = fc.constantFrom('local', 'outer');
  
  const orderItemArb = fc.record({
    sku: fc.constantFrom('P6-POTATO', 'P12-POTATO', 'P24-POTATO', 'P6-SAUER', 'P12-SAUER'),
    title: fc.string(),
    kind: kindArb,
    filling: fillingArb,
    qty: fc.constantFrom(6, 12, 24),
    unitPriceCents: fc.integer({ min: 500, max: 3000 }),
    addOns: fc.array(addOnArb, { maxLength: 3 })
  });
  
  const orderArb = fc.record({
    items: fc.array(orderItemArb, { minLength: 1, maxLength: 5 })
  });
  
  const profileArb = fc.record({
    tier: tierArb
  });
  
  const deliveryArb = fc.record({
    zone: zoneArb,
    rush: fc.boolean()
  });
  
  const contextArb = fc.record({
    profile: profileArb,
    delivery: deliveryArb,
    coupon: fc.option(fc.constantFrom('PIEROGI-BOGO', 'FIRST10'), { nil: null })
  });
  
  describe('Invariants', () => {
    
    // Here's an example preservation property!
    it('total should always be non-negative integer', () => {
      fc.assert(
        fc.property(orderArb, contextArb, (order, context) => {
          const result = total(order, context);
          return result >= 0 && Number.isInteger(result);
        }),
        { numRuns: 50 }
      );
    });

    it('VIP customers should pay delivery fee when under threshold', () => {
      const order = {
        items: [{
          sku: 'P12-POTATO',
          title: 'Potato 12-pack',
          kind: 'frozen',
          filling: 'potato',
          qty: 1,
          unitPriceCents: 1299,
          addOns: []
        }]
      };

      const context = {
        profile: {
          tier: 'vip'
        },
        delivery: {
          zone: 'local',
          rush: false
        },
        coupon: null
      };

      const result = total(order, context);
      
      const expectedBase = 1299;
      const expectedDeliveryFee = 499;
      const expected = expectedBase + expectedDeliveryFee;
      
      console.log({
        result,
        expectedBase,
        expectedDeliveryFee,
        expected,
        difference: expected - result
      });
      
      assert.equal(result, expected);  
      });
      });
});
