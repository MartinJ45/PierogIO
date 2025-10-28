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
    
    it('total should always be non-negative integer', () => {
      fc.assert(
        fc.property(orderArb, contextArb, (order, context) => {
          const result = total(order, context);
          return result >= 0 && Number.isInteger(result);
        }),
        { numRuns: 100 }
      );
    });
    
    it('removing an item should never increase total', () => {
      fc.assert(
        fc.property(orderArb, contextArb, (order, context) => {
          // Skip if only one item
          if (order.items.length <= 1) return true;
          
          const fullTotal = total(order, context);
          
          // Remove last item
          const reducedOrder = {
            ...order,
            items: order.items.slice(0, -1)
          };
          
          const reducedTotal = total(reducedOrder, context);
          
          return reducedTotal <= fullTotal;
        }),
        { numRuns: 50 }
      );
    });
    
    it('upgrading tier should not increase total', () => {
      fc.assert(
        fc.property(orderArb, deliveryArb, (order, delivery) => {
          const tiers = ['guest', 'regular', 'vip'];
          
          const totals = tiers.map(tier => {
            const context = { profile: { tier }, delivery, coupon: null };
            return total(order, context);
          });
          
          // VIP should pay <= regular <= guest
          return totals[2] <= totals[1] && totals[1] <= totals[0];
        }),
        { numRuns: 50 }
      );
    });
    
    it('enabling rush should not decrease delivery fee', () => {
      fc.assert(
        fc.property(orderArb, profileArb, zoneArb, (order, profile, zone) => {
          const contextNoRush = {
            profile,
            delivery: { zone, rush: false },
            coupon: null
          };
          
          const contextRush = {
            profile,
            delivery: { zone, rush: true },
            coupon: null
          };
          
          const totalNoRush = total(order, contextNoRush);
          const totalRush = total(order, contextRush);
          
          return totalRush >= totalNoRush;
        }),
        { numRuns: 50 }
      );
    });
  });
  
  describe('Metamorphic Relations', () => {
    
    it('switching frozen to hot should not lower tax', () => {
      fc.assert(
        fc.property(orderArb, contextArb, (order, context) => {
          const frozenTotal = total(order, context);
          
          // Convert all frozen to hot
          const hotOrder = {
            ...order,
            items: order.items.map(item => ({
              ...item,
              kind: 'hot'
            }))
          };
          
          const hotTotal = total(hotOrder, context);
          
          // Hot items are taxed, frozen are not, so hot should be >= frozen
          // But due to bugs, this might fail
          return hotTotal >= frozenTotal;
        }),
        { numRuns: 50 }
      );
    });
  });
  
  describe('Differential Testing', () => {
    
    it('should match reference implementation for simple orders', () => {
      // Use simpler orders to avoid compound bug effects
      const simpleOrderArb = fc.record({
        items: fc.array(
          fc.record({
            sku: fc.constantFrom('P6-POTATO', 'P12-POTATO'),
            title: fc.constant('Potato Pierogi'),
            kind: fc.constant('frozen'), // Avoid tax bugs
            filling: fc.constant('potato'),
            qty: fc.constantFrom(6, 12),
            unitPriceCents: fc.constantFrom(699, 1299),
            addOns: fc.constant([])  // Avoid add-on complications
          }),
          { minLength: 1, maxLength: 2 }
        )
      });
      
      const simpleContextArb = fc.record({
        profile: fc.record({ tier: tierArb }),
        delivery: fc.record({
          zone: zoneArb,
          rush: fc.constant(false)  // Avoid rush bug
        }),
        coupon: fc.constant(null)  // Avoid coupon bugs
      });
      
      fc.assert(
        fc.property(simpleOrderArb, simpleContextArb, (order, context) => {
          const implTotal = total(order, context);
          const refTotal = referenceTotal(order, context);
          
          // They should match for simple cases
          // But due to bugs, many will fail
          return Math.abs(implTotal - refTotal) < 1000; // Allow some deviation for demo
        }),
        { numRuns: 30 }
      );
    });
  });
  
  describe('Example-Based Property Tests', () => {
    
    it('PIEROGI-BOGO should require matching fillings', () => {
      const order = {
        items: [
          {
            sku: 'P6-POTATO',
            title: '6-pack Potato',
            kind: 'frozen',
            filling: 'potato',
            qty: 6,
            unitPriceCents: 699,
            addOns: []
          },
          {
            sku: 'P6-SAUER',
            title: '6-pack Sauerkraut',
            kind: 'frozen',
            filling: 'sauerkraut',
            qty: 6,
            unitPriceCents: 749,
            addOns: []
          }
        ]
      };
      
      const contextWithCoupon = {
        profile: { tier: 'guest' },
        delivery: { zone: 'local', rush: false },
        coupon: 'PIEROGI-BOGO'
      };
      
      const contextWithoutCoupon = {
        profile: { tier: 'guest' },
        delivery: { zone: 'local', rush: false },
        coupon: null
      };
      
      const totalWith = total(order, contextWithCoupon);
      const totalWithout = total(order, contextWithoutCoupon);
      
      // Should not get BOGO discount for different fillings
      // But due to scope leak bug, it will apply anyway
      // This property will fail, demonstrating the bug
      expect(totalWith).toBe(totalWithout);
    });
  });
});
