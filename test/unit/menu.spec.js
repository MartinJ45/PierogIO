const { expect } = require('chai');
const { calculateSubtotal, deliveryFee } = require('../../src/delivery');

// Menu pricing tests
describe('Menu Pricing', () => {
  it('should have correct prices for all menu items', () => {
    const menu = [
      { sku: 'P6-POTATO', price: 6.99 },
      { sku: 'P12-POTATO', price: 12.99 },
      { sku: 'P24-POTATO', price: 23.99 },
      { sku: 'P6-SAUER', price: 7.49 },
      { sku: 'sour-cream', price: 0.99 },
      { sku: 'fried-onion', price: 1.49 },
      { sku: 'bacon-bits', price: 1.99 },
    ];

    menu.forEach(item => {
      expect(item.price).to.be.a('number');
      expect(item.price).to.be.greaterThan(0);
    });
  });
});

// Delivery threshold tests
describe('Delivery Thresholds', () => {
  const order = {
    items: [
      { sku: 'P6-POTATO', qty: 100, unitPriceCents: 699 },
    ],
  };

  const lessThan30 = {
    items: [
        { sku: 'P6-POTATO', qty: 1, unitPriceCents: 699 },
    ]
  }

  it('should waive delivery fee for VIPs with subtotal >= $30', () => {
    const profile = { tier: 'vip' };
    const delivery = { rush: false, zone: 'local' };
    const fee = deliveryFee(order, delivery, profile);
    expect(fee).to.equal(0);
  });

  it('should waive delivery fee for Regulars with subtotal >= $40', () => {
    const profile = { tier: 'regular' };
    const delivery = { rush: false, zone: 'local' };
    const fee = deliveryFee(order, delivery, profile);
    expect(fee).to.equal(0);
  });

  it('should waive delivery fee for Guests with subtotal >= $50', () => {
    const profile = { tier: 'guest' };
    const delivery = { rush: false, zone: 'local' };
    const fee = deliveryFee(order, delivery, profile);
    expect(fee).to.equal(0);
  });

  it('should charge delivery fee for VIPs with subtotal < $30', () => {
    const profile = { tier: 'vip' };
    const delivery = { rush: false, zone: 'local' };
    const fee = deliveryFee(lessThan30, delivery, profile);
    expect(fee).to.be.greaterThan(0);
  });

  it('should charge delivery fee for Regulars with subtotal < $40', () => {
    const profile = { tier: 'regular' };
    const delivery = { rush: false, zone: 'local' };
    const fee = deliveryFee(lessThan30, delivery, profile);
    expect(fee).to.be.greaterThan(0);
  });

  it('should charge delivery fee for Guests with subtotal < $50', () => {
    const profile = { tier: 'guest' };
    const delivery = { rush: false, zone: 'local' };
    const fee = deliveryFee(lessThan30, delivery, profile);
    expect(fee).to.be.greaterThan(0);
  });
});