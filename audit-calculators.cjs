const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const html = fs.readFileSync(path.join(__dirname, 'calculator.html'), 'utf8');
const match = html.match(/<script>\s*([\s\S]*?)<\/script>/i);
assert.ok(match, 'calculator script exists');

const injectedChecks = `
  const expect = (condition, message) => { if (!condition) throw new Error(message); };
  const audit = { total: 0, failures: [] };
  for (const category of CATEGORIES) for (const tool of category.items) {
    audit.total++;
    try {
      const values = Object.fromEntries(tool.fields.map(field => [field.key, typeof field.default === 'function' ? field.default({}) : (field.default ?? '')]));
      const rows = tool.compute(values);
      if (!Array.isArray(rows) || rows.length === 0) throw new Error('No result rows');
    } catch (error) { audit.failures.push(tool.id + ': ' + error.message); }
  }
  const tax = CATEGORIES.flatMap(category => category.items).find(tool => tool.id === 'incometax');
  const total = (income, regime='New', residency='Resident') => tax.compute({income, regime, residency}).find(row => row.label === 'Estimated total').value;
  expect(total(1200000) === '₹0', 'new regime rebate at ₹12 lakh');
  expect(total(1200001) === '₹1.04', 'new regime threshold relief immediately above ₹12 lakh');
  expect(total(500000, 'Old') === '₹0', 'old regime rebate at ₹5 lakh');
  expect(total(550000, 'Old') !== '₹0', 'old regime tax above ₹5 lakh');
  expect(total(1200000, 'New', 'Non-resident') !== '₹0', 'section 87A rebate is resident-only');
  const annual = xirrCalc([{amount:-10000,date:new Date('2024-01-01')},{amount:12100,date:new Date('2025-12-31')}]);
  expect(Math.abs(annual - 10) < 0.01, 'two-year XIRR should be 10%');
  expect(!Number.isFinite(xirrCalc([{amount:0,date:new Date('2024-01-01')},{amount:100,date:new Date('2025-01-01')}])) , 'invalid XIRR input is rejected');
  const xirrTool = CATEGORIES.flatMap(category => category.items).find(tool => tool.id === 'xirr');
  expect(xirrTool.compute({amt1:100,amt2:121,date1:'2025-01-01',date2:'2024-01-01'})[0].value.includes('final date after investment'), 'XIRR rejects reversed dates');
  const converter = CATEGORIES.flatMap(category => category.items).find(tool => tool.id === 'unitconverter');
  let conversionPairs = 0;
  for (const [category, table] of Object.entries(UNITS)) for (const from of Object.keys(table)) for (const to of Object.keys(table)) {
    const result = converter.compute({cat:category,from,to,value:1})[0].value;
    expect(!/NaN|undefined/.test(result), category + ' conversion ' + from + ' → ' + to);
    conversionPairs++;
  }
  for (const from of ['°C','°F','K','°R']) for (const to of ['°C','°F','K','°R']) {
    const result = converter.compute({cat:'Temperature',from,to,value:0})[0].value;
    expect(!/NaN|undefined/.test(result), 'temperature conversion ' + from + ' → ' + to);
  }
  if (audit.failures.length) throw new Error(audit.failures.join('\\n'));
  console.log(JSON.stringify({catalogTools: audit.total, defaultRunsPassed: audit.total, conversionPairs, temperaturePairs: 16, targetedChecks: 9, failures: audit.failures.length}));
`;

const marker = "window.addEventListener('message',event=>";
assert.ok(match[1].includes(marker), 'calculator entry point marker exists');
const source = match[1].replace(marker, injectedChecks + '\n  ' + marker);
const context = {
  HTMLElement: class {},
  customElements: { get: () => undefined, define: () => {} },
  document: { addEventListener: () => {} },
  window: { addEventListener: () => {}, parent: {} },
  location: { origin: 'http://localhost' },
  console,
};
vm.runInNewContext(source, context, { timeout: 15000 });
