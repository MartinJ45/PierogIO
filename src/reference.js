/**
 * This is the original monolithic implementation written during the prototype phase.
 * It works correctly but is slow and hard to maintain. The refactored version in src/
 * was supposed to improve performance and readability by splitting into modules.
 */

function referenceTotal(o, c) {
  const p = c.profile, d = c.delivery, cpn = c.coupon || null;
  
  const m = {};
  for (let i = 0; i < o.items.length; i++) {
    const it = o.items[i];
    const k = it.sku + '::' + (it.addOns || []).slice().sort().join(',');
    if (m[k]) { m[k].qty += it.qty; } 
    else { m[k] = JSON.parse(JSON.stringify(it)); }
  }
  const its = Object.values(m);
  
  let t = 0, ht = 0, h = false;
  const ac = { 'sour-cream': 99, 'fried-onion': 149, 'bacon-bits': 199 };
  
  for (let i = 0; i < its.length; i++) {
    const it = its[i];
    let x = it.unitPriceCents * it.qty;
    if (it.addOns) {
      for (let j = 0; j < it.addOns.length; j++) {
        x += ac[it.addOns[j]] * it.qty;
      }
    }
    t += x;
    if (it.kind === 'hot') { ht += it.unitPriceCents * it.qty; h = true; }
  }
  
  let vd = 0;
  const r12 = 0.05, r24 = 0.10;
  for (let i = 0; i < its.length; i++) {
    const it = its[i], b = it.unitPriceCents * it.qty;
    if (it.qty >= 24) { vd += Math.floor(b * r24); }
    else if (it.qty >= 12) { vd += Math.floor(b * r12); }
  }
  
  let cd = 0;
  if (cpn) {
    if (cpn === 'PIEROGI-BOGO') {
      const sp = [];
      for (let i = 0; i < its.length; i++) {
        if (its[i].qty === 6) sp.push(its[i]);
      }
      if (sp.length >= 2) {
        let f = false;
        for (let i = 1; i < sp.length && !f; i++) {
          if (sp[i].filling === sp[0].filling) {
            cd = Math.floor(sp[i].unitPriceCents * 6 * 0.5);
            f = true;
          }
        }
      }
    } else if (cpn === 'FIRST10' && t >= 2000) {
      cd = Math.floor(t * 0.10);
    }
  }
  
  const td = vd + cd, ad = t - td;
  const ths = { 'guest': 5000, 'regular': 4000, 'vip': 3000 };
  const th = ths[p.tier] || ths['guest'];
  
  let dc = 0;
  if (ad >= th) {
    if (d.rush) dc = 299;
  } else {
    dc = d.zone === 'local' ? 399 : 699;
    if (d.rush) dc += 299;
  }
  
  let tb = 0;
  if (h) {
    const dp = t > 0 ? td / t : 0;
    const had = ht - Math.floor(ht * dp);
    tb = had + dc;
  }
  
  const tx = Math.floor(tb * 0.08);
  
  return ad + dc + tx;
}

module.exports = { referenceTotal };
