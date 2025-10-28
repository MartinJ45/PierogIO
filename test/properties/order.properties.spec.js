const fc = require('fast-check');
const { total } = require('../../src/total');
const { referenceTotal } = require('../../src/reference');

// Arbitrary generators
  const addOnArb = fc.constantFrom('sour-cream', 'fried-onion', 'bacon-bits');
  const fillingArb = fc.constantFrom('potato', 'sauerkraut', 'sweet-cheese', 'mushroom');
  const kindArb = fc.constantFrom('hot', 'frozen');
  const tierArb = fc.constantFrom('guest', 'regular', 'vip');
  const zoneArb = fc.constantFrom('local', 'outer');

  // Constrained item generator: keep sku, qty and filling consistent so tests don't produce impossible combos.
  const orderItemArb = fc.oneof(
    fc.record({
      sku: fc.constant('P6-POTATO'),
      title: fc.string(),
      kind: kindArb,
      filling: fc.constant('potato'),
      qty: fc.constant(6),
      unitPriceCents: fc.integer({ min: 500, max: 3000 }),
      addOns: fc.array(addOnArb, { maxLength: 3 })
    }),
    fc.record({
      sku: fc.constant('P12-POTATO'),
      title: fc.string(),
      kind: kindArb,
      filling: fc.constant('potato'),
      qty: fc.constant(12),
      unitPriceCents: fc.integer({ min: 500, max: 3000 }),
      addOns: fc.array(addOnArb, { maxLength: 3 })
    }),
    fc.record({
      sku: fc.constant('P24-POTATO'),
      title: fc.string(),
      kind: kindArb,
      filling: fc.constant('potato'),
      qty: fc.constant(24),
      unitPriceCents: fc.integer({ min: 500, max: 3000 }),
      addOns: fc.array(addOnArb, { maxLength: 3 })
    }),
    fc.record({
      sku: fc.constant('P6-SAUER'),
      title: fc.string(),
      kind: kindArb,
      filling: fc.constant('sauerkraut'),
      qty: fc.constant(6),
      unitPriceCents: fc.integer({ min: 500, max: 3000 }),
      addOns: fc.array(addOnArb, { maxLength: 3 })
    }),
    fc.record({
      sku: fc.constant('P12-SAUER'),
      title: fc.string(),
      kind: kindArb,
      filling: fc.constant('sauerkraut'),
      qty: fc.constant(12),
      unitPriceCents: fc.integer({ min: 500, max: 3000 }),
      addOns: fc.array(addOnArb, { maxLength: 3 })
    })
  );
  
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

// describe('Property-Based Tests for Orders', () => {
  
//   // Arbitrary generators
//   const addOnArb = fc.constantFrom('sour-cream', 'fried-onion', 'bacon-bits');
//   const fillingArb = fc.constantFrom('potato', 'sauerkraut', 'sweet-cheese', 'mushroom');
//   const kindArb = fc.constantFrom('hot', 'frozen');
//   const tierArb = fc.constantFrom('guest', 'regular', 'vip');
//   const zoneArb = fc.constantFrom('local', 'outer');

//   const orderItemArb = fc.oneof(
//   fc.record({
//     sku: fc.constant('P6-POTATO'),
//     title: fc.string(),
//     kind: kindArb,
//     filling: fc.constant('potato'),
//     qty: fc.constant(6),
//     unitPriceCents: fc.integer({ min: 500, max: 3000 }),
//     addOns: fc.array(addOnArb, { maxLength: 3 })
//   }),
//   fc.record({
//     sku: fc.constant('P12-POTATO'),
//     title: fc.string(),
//     kind: kindArb,
//     filling: fc.constant('potato'),
//     qty: fc.constant(12),
//     unitPriceCents: fc.integer({ min: 500, max: 3000 }),
//     addOns: fc.array(addOnArb, { maxLength: 3 })
//   }),
//   fc.record({
//     sku: fc.constant('P24-POTATO'),
//     title: fc.string(),
//     kind: kindArb,
//     filling: fc.constant('potato'),
//     qty: fc.constant(24),
//     unitPriceCents: fc.integer({ min: 500, max: 3000 }),
//     addOns: fc.array(addOnArb, { maxLength: 3 })
//   }),
//   fc.record({
//     sku: fc.constant('P6-SAUER'),
//     title: fc.string(),
//     kind: kindArb,
//     filling: fc.constant('sauerkraut'),
//     qty: fc.constant(6),
//     unitPriceCents: fc.integer({ min: 500, max: 3000 }),
//     addOns: fc.array(addOnArb, { maxLength: 3 })
//   }),
//   fc.record({
//     sku: fc.constant('P12-SAUER'),
//     title: fc.string(),
//     kind: kindArb,
//     filling: fc.constant('sauerkraut'),
//     qty: fc.constant(12),
//     unitPriceCents: fc.integer({ min: 500, max: 3000 }),
//     addOns: fc.array(addOnArb, { maxLength: 3 })
//   })
// );
  
//   const orderArb = fc.record({
//     items: fc.array(orderItemArb, { minLength: 1, maxLength: 5 })
//   });
  
//   const profileArb = fc.record({
//     tier: tierArb
//   });
  
//   const deliveryArb = fc.record({
//     zone: zoneArb,
//     rush: fc.boolean()
//   });
  
//   const contextArb = fc.record({
//     profile: profileArb,
//     delivery: deliveryArb,
//     coupon: fc.option(fc.constantFrom('PIEROGI-BOGO', 'FIRST10'), { nil: null })
//   });
  
  describe('Invariants', () => {
    
    // Here's an example preservation property!
    it('total should always be non-negative integer', () => {
      const prop = fc.property(orderArb, contextArb, (order, context) => {
        const result = total(order, context);
        return result >= 0 && Number.isInteger(result);
      });

      const out = fc.check(prop, { numRuns: 200 });
      if (out.failed) {
        console.error('fast-check counterexample:', out.counterexample);
        if (out.error) console.error('error thrown during run:', out.error);
        throw new Error('Property failed — see console for counterexample (fast-check)');
      }
      // pass if not failed
    });

  });
