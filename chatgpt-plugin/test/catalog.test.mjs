import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculate, catalogSize, getCalculator, listCalculators } from '../src/catalog.mjs';

function numeric(rows, label) {
  const value = rows.find(row => row.label === label)?.value;
  assert.ok(value, `Missing ${label}`);
  return Number(value.replace(/[₹,%\s]/g, ''));
}

test('all original calculators are discoverable', () => {
  assert.equal(catalogSize, 136);
  assert.equal(listCalculators({ query: 'EMI' }).calculators[0].id, 'emi');
  assert.ok(listCalculators({ query: 'dairy' }).calculators.some(item => item.id === 'milkledger'));
});

test('EMI and zero-rate repayments match original site', () => {
  const result = calculate('emi', { principal: 1200, rate: 0, years: 1 });
  assert.equal(numeric(result.results, 'Monthly EMI'), 100);
  assert.equal(numeric(result.results, 'Total interest'), 0);
  const regular = calculate('emi', { principal: 1_000_000, rate: 9, years: 5 });
  assert.ok(Math.abs(numeric(regular.results, 'Monthly EMI') - 20758.36) < 0.02);
  assert.ok(regular.results.some(row => row.type === 'table'));
});

test('GST inclusive and exclusive preserve correct totals', () => {
  const inclusive = calculate('gst', { amount: 118, rate: 18, type: 'Inclusive' });
  assert.equal(numeric(inclusive.results, 'Total GST'), 18);
  assert.equal(numeric(inclusive.results, 'Total amount'), 118);
  const exclusive = calculate('gst', { amount: 100, rate: 18, type: 'Exclusive' });
  assert.equal(numeric(exclusive.results, 'Total amount'), 118);
});

test('SIP projection matches invested amount at zero return', () => {
  const result = calculate('sip', { monthly: 5000, years: 10, returnRate: 0 });
  assert.equal(numeric(result.results, 'Invested amount'), 600000);
  assert.equal(numeric(result.results, 'Final value'), 600000);
});

test('unit converter dynamically exposes the correct units', () => {
  const description = getCalculator('unitconverter', { cat: 'Length' });
  assert.ok(description.fields.find(f => f.key === 'from').options.some(o => o.value === 'm'));
  const result = calculate('unitconverter', { cat: 'Length', from: 'm', to: 'cm', value: 1 });
  assert.equal(result.results[0].value, '100 cm');
});

test('invalid inputs are rejected before entering formulas', () => {
  assert.throws(() => calculate('not-found', {}), /Unknown calculator/);
  assert.throws(() => calculate('emi', { principal: 1000, rate: Infinity, years: 3 }), /finite number/);
  assert.throws(() => calculate('emi', { principal: 1000, rate: 8, years: 200 }), /100 years/);
  assert.throws(() => calculate('gst', { amount: 100, rate: 99, type: 'Exclusive' }), /choose one of/);
  assert.throws(() => calculate('emi', { principal: 1000, rate: 8, years: 3, injected: 1 }), /Unrecognized fields/);
  const safe = calculate('customcalc', { formula: 'globalThis.alert(1)' });
  assert.equal(safe.results[0].label, 'Formula help');
});

test('original calculator catalog accepts representative input across all modes', () => {
  const all = [];
  for (let offset = 0; offset < catalogSize; offset += 30) {
    all.push(...listCalculators({ offset, limit: 30 }).calculators);
  }
  assert.equal(all.length, catalogSize);
  const failures = [];
  for (const { id } of all) {
    if (id === 'currency') continue; // handled online through calculateCurrency
    try {
      const descriptor = getCalculator(id);
      const inputs = {};
      for (const field of descriptor.fields) {
        if (field.type === 'number') {
          inputs[field.key] = /rate|interest|apr|tax|discount|percent|pct|growth/i.test(field.key) ? 8 :
            /year|tenure/i.test(field.key) ? 5 : /months|days|duration/i.test(field.key) ? 12 : 100;
        } else if (field.type === 'date') {
          inputs[field.key] = /(?:end|to|date2|second)/i.test(field.key) ? '2025-02-01' : '2025-01-01';
        } else if (field.type === 'time') {
          inputs[field.key] = '12:30';
        } else if (field.options?.length) {
          inputs[field.key] = field.default === '' ? field.options[0].value : field.default;
        } else {
          inputs[field.key] = field.default;
        }
      }
      if (id === 'unitconverter') { inputs.cat = 'Length'; inputs.from = 'm'; inputs.to = 'cm'; }
      const result = calculate(id, inputs);
      assert.ok(result.results.length, `${id} has no results`);
    } catch (error) { failures.push(`${id}: ${error.message}`); }
  }
  assert.deepEqual(failures, []);
});
