const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const html = fs.readFileSync(path.join(__dirname, 'calculator.html'), 'utf8');
const marker = "window.addEventListener('message',event=>";
const core = fs.readFileSync(process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, 'calculator-core.js'), 'utf8');
assert.ok(html.includes('src="calculator-core.js"') && core.includes(marker) && core.includes('const CATEGORIES = ['), 'calculator logic script exists');

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
  const populatedFailures = [];
  const sampleValue = field => {
    if (field.type === 'select' || field.type === 'pills' || field.type === 'currency') return field.default ?? field.options?.[0] ?? '';
    if (field.type === 'date') return /(?:end|to|date2|second)/i.test(field.key + ' ' + field.label) ? '2025-02-01' : '2025-01-01';
    if (field.type === 'time') return '12:30';
    if (field.type === 'number') {
      const key = (field.key + ' ' + field.label).toLowerCase();
      if (/rate|interest|apr|tax|discount|margin|percent|pct|inflation|growth/.test(key)) return 8;
      if (/year|tenure/.test(key)) return 5;
      if (/month|days|duration|period|term/.test(key)) return 12;
      if (/quantity|count|units|items|age/.test(key)) return 3;
      return 12000;
    }
    if (field.type === 'text') return field.default ?? '10';
    return typeof field.default === 'function' ? field.default({}) : (field.default ?? '');
  };
  for (const category of CATEGORIES) for (const tool of category.items) {
    try {
      const values = Object.fromEntries(tool.fields.map(field => [field.key, sampleValue(field)]));
      const rows = tool.compute(values);
      if (!Array.isArray(rows) || rows.length === 0) throw new Error('No result rows');
      for (const row of rows) {
        const result = typeof row.value === 'string' ? row.value : '';
        if (/NaN|undefined/i.test(result)) throw new Error('Invalid result: ' + result);
      }
    } catch (error) { populatedFailures.push(tool.id + ': ' + error.message); }
  }
  if (populatedFailures.length) throw new Error('Populated-input checks failed:\\n' + populatedFailures.join('\\n'));
  const zeroFailures = [];
  for (const category of CATEGORIES) for (const tool of category.items) {
    try {
      const values = Object.fromEntries(tool.fields.map(field => [field.key,
        field.type === 'number' ? 0 : field.type === 'date' ? '2025-01-01' : field.type === 'time' ? '00:00' :
          (field.type === 'select' || field.type === 'pills' || field.type === 'currency') ? (field.default ?? field.options?.[0] ?? '') :
          (typeof field.default === 'function' ? field.default({}) : (field.default ?? ''))]));
      const rows = tool.compute(values);
      if (!Array.isArray(rows) || rows.length === 0) throw new Error('No result rows');
      for (const row of rows) if (typeof row.value === 'string' && /NaN|undefined/i.test(row.value)) throw new Error('Invalid zero-boundary result: ' + row.value);
    } catch (error) { zeroFailures.push(tool.id + ': ' + error.message); }
  }
  if (zeroFailures.length) throw new Error('Zero-boundary checks failed:\\n' + zeroFailures.join('\\n'));
  const tax = CATEGORIES.flatMap(category => category.items).find(tool => tool.id === 'incometax');
  const total = (income, regime='New', residency='Resident') => tax.compute({income, regime, residency}).find(row => row.label === 'Estimated total').value;
  expect(total(1200000) === '₹0', 'new regime rebate at ₹12 lakh');
  expect(total(1200001) === '₹1.04', 'new regime threshold relief immediately above ₹12 lakh');
  expect(total(500000, 'Old') === '₹0', 'old regime rebate at ₹5 lakh');
  expect(total(550000, 'Old') !== '₹0', 'old regime tax above ₹5 lakh');
  expect(total(1200000, 'New', 'Non-resident') !== '₹0', 'section 87A rebate is resident-only');
  const carLoan = CATEGORIES.flatMap(category => category.items).find(tool => tool.id === 'carloan');
  const carResult = values => carLoan.compute(values);
  const amount = rows => Number(rows.find(row => row.label === 'Amount financed').value.replace(/[₹,\s]/g, ''));
  const money = (rows, label) => Number(rows.find(row => row.label === label).value.replace(/[₹,\s]/g, ''));
  const car = {carPrice:2000000,downPayment:500000,tradeIn:200000,taxPct:5,fees:25000,rate:8,years:5};
  const carRows = carResult(car), financed = amount(carRows), payments = money(carRows,'Total of loan payments');
  expect(financed === 1425000, 'car loan amount includes tax and fees less down payment and trade-in');
  expect(Math.abs(money(carRows,'Total interest') - (payments-financed)) < 0.02, 'car loan reports total interest consistently');
  expect(Math.abs(money(carRows,'Monthly EMI')*60 - payments) < 0.31, 'car loan payments reconcile to monthly EMI within display rounding');
  const zeroRateCar = carResult({...car,rate:0,years:1});
  expect(Math.abs(money(zeroRateCar,'Monthly EMI') - amount(zeroRateCar)/12) < 0.02, 'zero-rate car loan uses straight principal division');
  const paidOffCar = carResult({...car,downPayment:5000000,tradeIn:0});
  expect(amount(paidOffCar) === 0 && money(paidOffCar,'Total interest') === 0, 'car loan caps down payment and prevents negative financing');
  const emiTool=CATEGORIES.flatMap(category=>category.items).find(tool=>tool.id==='emi');
  expect(money(emiTool.compute({principal:1200,rate:0,years:1}),'Monthly EMI')===100, 'zero-rate EMI divides principal by months');
  const gstTool=CATEGORIES.flatMap(category=>category.items).find(tool=>tool.id==='gst');
  expect(money(gstTool.compute({amount:100,rate:18,type:'Exclusive'}),'Total amount')===118, 'exclusive GST adds tax');
  expect(money(gstTool.compute({amount:118,rate:18,type:'Inclusive'}),'Total GST')===18, 'inclusive GST extracts tax');
  expect(money(gstTool.compute({amount:118,rate:18,type:'Inclusive'}),'Total amount')===118, 'inclusive GST preserves entered total');
  const annual = xirrCalc([{amount:-10000,date:new Date('2024-01-01')},{amount:12100,date:new Date('2025-12-31')}]);
  expect(Math.abs(annual - 10) < 0.01, 'two-year XIRR should be 10%');
  expect(!Number.isFinite(xirrCalc([{amount:0,date:new Date('2024-01-01')},{amount:100,date:new Date('2025-01-01')}])) , 'invalid XIRR input is rejected');
  const xirrTool = CATEGORIES.flatMap(category => category.items).find(tool => tool.id === 'xirr');
  expect(xirrTool.compute({amt1:100,amt2:121,date1:'2025-01-01',date2:'2024-01-01'})[0].value.includes('final date after investment'), 'XIRR rejects reversed dates');
  expect(evalCustomFormula('(A+B)*C',{a:-2.5,b:4,c:3})===4.5, 'custom formula handles negatives and decimals');
  expect(evalCustomFormula('pow(A,2)+sqrt(B)',{a:3,b:16})===13, 'custom formula supports bounded math functions');
  expect(evalCustomFormula('-2^2',{})===-4, 'exponentiation precedes unary minus');
  expect(evalCustomFormula('(-2)^2',{})===4, 'parentheses override unary exponent precedence');
  expect(evalCustomFormula('2^-2',{})===0.25, 'negative exponent remains supported');
  expect(evalCustomFormula('2^3^2',{})===512, 'exponentiation remains right-associative');
  expect(parseCalendarDate('2024-02-29')?.day===29, 'leap-day date is valid');
  expect(parseCalendarDate('2025-02-29')===null, 'non-leap February 29 is rejected');
  expect(parseCalendarDate('2026-02-30')===null, 'overflowing date is rejected');
  const janEndAge=calendarAge(parseCalendarDate('2025-01-31'),parseCalendarDate('2025-03-01'));
  expect(janEndAge.years===0&&janEndAge.months===1&&janEndAge.days===1, 'age handles a short month after January 31');
  const leapAge=calendarAge(parseCalendarDate('2000-02-29'),parseCalendarDate('2021-02-28'));
  expect(leapAge.years===21&&leapAge.months===0&&leapAge.days===0, 'February 29 anniversary uses February 28 in non-leap years');
  const dateDifference=CATEGORIES.flatMap(category=>category.items).find(tool=>tool.id==='datedifference');
  expect(dateDifference.compute({date1:'2024-02-28',date2:'2024-03-01'})[0].value==='2', 'date difference counts leap day');
  expect(dateDifference.compute({date1:'2026-02-30',date2:'2026-03-01'})[0].value==='Enter valid dates.', 'date difference rejects invalid dates');
  const workdays=CATEGORIES.flatMap(category=>category.items).find(tool=>tool.id==='workingdays');
  expect(workdays.compute({date1:'2024-02-29',date2:'2024-03-04'})[0].value==='3', 'working days span leap day and weekend');
  expect(workdays.compute({date1:'2026-02-30',date2:'2026-03-01'})[0].value==='Enter valid dates.', 'working days reject invalid dates');
  expect(workdays.compute({date1:'2026-03-02',date2:'2026-03-01'})[0].value.includes('End date'), 'working days reject reversed dates');
  for(const payload of ['globalThis.alert(1)','constructor.constructor(1)','A;alert(1)','A[0]']) {
    let rejected=false;try{evalCustomFormula(payload,{a:1});}catch{rejected=true;}
    expect(rejected, 'custom formula rejects JavaScript syntax: '+payload);
  }
  const converter = CATEGORIES.flatMap(category => category.items).find(tool => tool.id === 'unitconverter');
  expect(converter.compute({cat:'Length',from:'m',to:'cm',value:1})[0].value==='100 cm', 'one metre is 100 centimetres');
  expect(converter.compute({cat:'Length',from:'cm',to:'m',value:1})[0].value==='0.01 m', 'one centimetre is 0.01 metres');
  expect(converter.compute({cat:'Temperature',from:'°C',to:'°F',value:0})[0].value==='32 °F', 'zero Celsius is 32 Fahrenheit');
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
  console.log(JSON.stringify({catalogTools: audit.total, defaultRunsPassed: audit.total, populatedRunsPassed: audit.total, zeroBoundaryRunsPassed: audit.total, conversionPairs, temperaturePairs: 16, targetedChecks: 40, failures: audit.failures.length}));
`;

const source = core.replace(marker, injectedChecks + '\n  ' + marker);
const context = {
  HTMLElement: class {},
  customElements: { get: () => undefined, define: () => {} },
  document: { addEventListener: () => {} },
  window: { addEventListener: () => {}, parent: {} },
  location: { origin: 'http://localhost' },
  console,
};
vm.runInNewContext(source, context, { timeout: 15000 });
