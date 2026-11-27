import { readFileSync } from 'node:fs';
import { createContext, Script } from 'node:vm';

// The site remains the source of truth for all calculator definitions and
// formulas. Only its pure helpers/catalog are evaluated here, not its DOM UI.
const source = readFileSync(new URL('../../calculator-core.js', import.meta.url), 'utf8');
const start = source.indexOf('  /* ===================== helpers ===================== */');
const end = source.indexOf('  /* ===================== premium icon set ===================== */');
if (start < 0 || end <= start) {
  throw new Error('SevenTask calculator catalog boundary changed; review the site before deploying.');
}

const context = createContext({
  // Network access is deliberately absent from the formula runtime.
  window: { setTimeout, clearTimeout },
  AbortController,
});
new Script(`${source.slice(start, end)}\nglobalThis.__sevenCatalog = { categories: CATEGORIES, map: CALC_MAP };`, {
  filename: 'calculator-core-catalog.js',
}).runInContext(context, { timeout: 1500 });

const catalog = context.__sevenCatalog;
const all = catalog.categories.flatMap(category =>
  category.items.map(item => ({ id: item.id, name: item.name, category: category.name }))
);
const categoryOf = new Map(all.map(item => [item.id, item.category]));
const ids = new Set(all.map(item => item.id));
const numberFields = new Set(['number']);
const selectionFields = new Set(['select', 'pills', 'currency']);

export const catalogSize = all.length;
export const categories = catalog.categories.map(category => ({
  name: category.name,
  count: category.items.length,
}));

// Curated entry points only: every original calculator remains available.
const featured = [
  { id: 'daily', name: 'Daily essentials', ids: ['percentage', 'discount', 'age', 'unitconverter', 'currency', 'splitbill', 'unitprice', 'datedifference', 'workingdays', 'fuelcost', 'electricitybill', 'incomesummary', 'recurringcost'] },
  { id: 'basic', name: 'Basic maths', ids: ['percentage', 'fraction', 'ratio', 'average', 'rounding', 'powerroot', 'lcmhcf', 'linearequation', 'circlecalc', 'standarddeviation'] },
  { id: 'finance', name: 'Money, loans & tax', ids: ['emi', 'sip', 'gst', 'simpleinterest', 'compoundinterest', 'fd', 'rd', 'savingsgoal', 'creditcardinterest', 'homeloan', 'debtpayoff', 'inflation', 'cagr', 'roi', 'incometax'] },
  { id: 'business', name: 'Business & shopping', ids: ['profitmargin', 'grossmargin', 'markup', 'breakeven', 'retailmargin', 'kiranainvoice', 'shopinvoice', 'marketplaceprofit', 'wholesaleretail', 'khataamount', 'netmargin', 'cashflow', 'onlinecompare'] },
  { id: 'home', name: 'Home, health & travel', ids: ['bmi', 'bmr', 'waterintake', 'calorietarget', 'areacalc', 'paintcalc', 'tilecalc', 'concretecalc', 'fuelcost', 'tripbudget', 'electricitybill', 'evchargingcost'] },
];

for (const group of featured) {
  for (const id of group.ids) {
    if (!ids.has(id)) throw new Error(`Featured calculator ${id} no longer exists in the original catalog.`);
  }
}

export const featuredCollections = featured.map(({ id, name, ids: items }) => ({ id, name, count: items.length }));

export function listFeaturedCalculators({ collection = '', limit = 30, offset = 0 } = {}) {
  const group = collection ? featured.find(item => item.id === collection) : undefined;
  if (collection && !group) throw new Error(`Unknown collection: ${collection}. Choose daily, basic, finance, business or home.`);
  const idsInOrder = group ? group.ids : [...new Set(featured.flatMap(item => item.ids))];
  return {
    total: idsInOrder.length,
    catalogTotal: catalogSize,
    offset,
    calculators: idsInOrder.slice(offset, offset + limit).map(id => {
      const item = all.find(candidate => candidate.id === id);
      return { ...item, collections: featured.filter(g => g.ids.includes(id)).map(g => g.id) };
    }),
    collections: featuredCollections,
    website: 'https://seventaskcalculator.in/calculator',
  };
}

export function listCalculators({ query = '', category = '', limit = 20, offset = 0 } = {}) {
  const q = query.toLowerCase().trim();
  const matches = all.filter(item =>
    (!q || `${item.name} ${item.id} ${item.category}`.toLowerCase().includes(q)) &&
    (!category || item.category.toLowerCase() === category.toLowerCase())
  );
  return {
    total: matches.length,
    catalogTotal: catalogSize,
    offset,
    calculators: matches.slice(offset, offset + limit),
    categories,
    website: 'https://seventaskcalculator.in/calculator',
  };
}

function availableOptions(field, values) {
  const options = typeof field.options === 'function' ? field.options(values) : (field.options ?? []);
  return options.map(option => typeof option === 'object' && option !== null
    ? { value: option.value, label: option.label ?? String(option.value) }
    : { value: option, label: String(option) });
}

function resolveDefault(field, values) {
  return typeof field.default === 'function' ? field.default(values) : field.default;
}

export function getCalculator(id, selections = {}) {
  if (!ids.has(id)) throw new Error(`Unknown calculator: ${id}. Call list_calculators first.`);
  const item = catalog.map[id];
  const values = { ...selections };
  const fields = item.fields.map(field => {
    const fallback = resolveDefault(field, values);
    if (!(field.key in values)) values[field.key] = fallback;
    const details = {
      key: field.key,
      label: field.label,
      type: field.type,
      default: fallback ?? '',
    };
    if (selectionFields.has(field.type)) {
      let options = availableOptions(field, values);
      if (id === 'unitconverter' && field.key === 'cat') {
        options = options.filter(option => option.value !== 'Currency');
      }
      details.options = options;
    }
    if (field.placeholder) details.placeholder = field.placeholder;
    return details;
  });
  return { id, name: item.name, category: categoryOf.get(id), fields,
    notes: id === 'currency' ? 'Currency values use Frankfurter daily reference rates (not trading quotes).' : undefined };
}

function coerce(field, raw, values) {
  if (numberFields.has(field.type)) {
    if (raw === '' || raw === null) return '';
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || Math.abs(n) > 1e12) throw new Error(`${field.label}: enter a finite number no larger than 1 trillion.`);
    return n;
  }
  if (selectionFields.has(field.type)) {
    const options = availableOptions(field, values);
    if (field.key === 'cat' && values.__calculatorId === 'unitconverter' && raw === 'Currency') {
      throw new Error('For currency rates, use the Currency Converter calculator instead.');
    }
    const match = options.find(option => String(option.value) === String(raw));
    if (!match) throw new Error(`${field.label}: choose one of ${options.map(o => o.value).join(', ')}.`);
    return match.value;
  }
  if (field.type === 'date') {
    if (raw === '') return '';
    if (typeof raw !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error(`${field.label}: use YYYY-MM-DD.`);
    const [year, month, day] = raw.split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    if (d.getUTCFullYear() !== year || d.getUTCMonth() + 1 !== month || d.getUTCDate() !== day) {
      throw new Error(`${field.label}: invalid calendar date.`);
    }
    return raw;
  }
  if (field.type === 'time') {
    if (raw === '') return '';
    if (typeof raw !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) throw new Error(`${field.label}: use HH:MM.`);
    return raw;
  }
  if (typeof raw !== 'string' || raw.length > 240) throw new Error(`${field.label}: enter text under 240 characters.`);
  return raw;
}

function cleanRows(rows) {
  if (!Array.isArray(rows) || rows.length > 100) throw new Error('Calculator returned an unexpected number of results.');
  return JSON.parse(JSON.stringify(rows, (_key, value) => {
    if (typeof value === 'number' && !Number.isFinite(value)) return null;
    return value;
  }));
}

export function calculate(id, inputs = {}) {
  if (!ids.has(id)) throw new Error(`Unknown calculator: ${id}. Call list_calculators first.`);
  if (!inputs || Array.isArray(inputs) || typeof inputs !== 'object') throw new Error('inputs must be an object.');
  const item = catalog.map[id];
  const allowed = new Set(item.fields.map(field => field.key));
  const extra = Object.keys(inputs).filter(key => !allowed.has(key));
  if (extra.length) throw new Error(`Unrecognized fields: ${extra.join(', ')}. Call get_calculator to see field names.`);

  const values = { __calculatorId: id };
  for (const field of item.fields) {
    const raw = Object.hasOwn(inputs, field.key) ? inputs[field.key] : resolveDefault(field, values);
    values[field.key] = coerce(field, raw ?? '', values);
  }
  delete values.__calculatorId;

  // Avoid unbounded iteration in formulas when an input contains a huge tenure.
  if (Number(values.years) > 100 || Number(values.months) > 1200) {
    throw new Error('Tenure is limited to 100 years or 1200 months.');
  }
  context.__calculationId = id;
  context.__calculationInputs = values;
  try {
    const rows = new Script('CALC_MAP[__calculationId].compute(__calculationInputs)', {
      filename: 'seventask-calculation.js',
    }).runInContext(context, { timeout: 400 });
    return {
      id,
      name: item.name,
      category: categoryOf.get(id),
      inputs: values,
      results: cleanRows(rows),
      source: 'SevenTask Calculator',
      website: 'https://seventaskcalculator.in/calculator',
      disclaimer: /Tax|Investment|Retirement|Loan|Credit|Health|Property|Savings|Market/.test(categoryOf.get(id))
        ? 'Illustrative estimate only. Check current rules, rates, and professional guidance before decisions.'
        : undefined,
    };
  } finally {
    delete context.__calculationId;
    delete context.__calculationInputs;
  }
}

export async function calculateCurrency({ from, to, amount }) {
  const codes = /^[A-Z]{3}$/;
  if (!codes.test(from) || !codes.test(to)) throw new Error('Use 3-letter ISO currency codes, such as USD and INR.');
  if (!Number.isFinite(amount) || Math.abs(amount) > 1e12) throw new Error('Enter a valid currency amount.');
  let quote = { rate: 1, date: new Date().toISOString().slice(0, 10) };
  if (from !== to) {
    const response = await fetch(`https://api.frankfurter.dev/v2/rate/${from.toLowerCase()}/${to.toLowerCase()}`, {
      signal: AbortSignal.timeout(7000),
      headers: { accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Currency provider is unavailable (${response.status}).`);
    quote = await response.json();
  }
  const rate = Number(quote.rate);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('Currency provider returned an invalid rate.');
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }).format(amount * rate);
  return {
    id: 'currency', name: 'Currency Converter', category: 'Currency',
    inputs: { from, to, value: amount },
    results: [
      { label: `${amount} ${from} converts to`, value: `${formatted} ${to}`, emphasis: true },
      { label: `1 ${from}`, value: `${rate} ${to}` },
      { label: 'Reference date', value: quote.date },
    ],
    source: 'Frankfurter daily reference rate',
    website: 'https://seventaskcalculator.in/calculator',
    disclaimer: 'Daily reference rate, not a live trading or bank quote.',
  };
}
