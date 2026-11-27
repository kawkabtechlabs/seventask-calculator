import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Script } from 'node:vm';
import worker from '../dist/worker.mjs';
import { calculate, catalogSize, getCalculator, listCalculators } from '../src/catalog.mjs';

let counter = 0;
const rpc = async (method, params = {}) => {
  const request = new Request('https://seventask-calculator-mcp.example.workers.dev/mcp', {
    method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++counter, method, params }),
  });
  const response = await worker.fetch(request);
  assert.equal(response.status, 200, method);
  const result = await response.json();
  if (result.error) assert.fail(JSON.stringify(result.error));
  return result.result;
};

test('Cloudflare Worker health, discovery, UI and direct tool call', async () => {
  const health = await (await worker.fetch(new Request('https://example.org/healthz'))).json();
  assert.equal(health.calculators, 136);
  assert.equal(health.status, 'ok');
  const initialize = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {} });
  assert.match(initialize.serverInfo.name, /SevenTask/);
  assert.equal(initialize.serverInfo.websiteUrl, 'https://seventaskcalculator.in');
  assert.equal(initialize.serverInfo.icons[0].mimeType, 'image/png');
  const icon = await worker.fetch(new Request('https://example.org/icon.png'));
  assert.equal(icon.status, 200);
  assert.equal(icon.headers.get('content-type'), 'image/png');
  assert.ok((await icon.arrayBuffer()).byteLength > 10000);
  const support = await worker.fetch(new Request('https://example.org/support'));
  assert.equal(support.status, 200);
  assert.match(await support.text(), /kawkabtechlabs@gmail.com/);
  const tools = await rpc('tools/list');
  assert.equal(tools.tools.length, 14);
  const result = await rpc('tools/call', {
    name: 'calculate_emi', arguments: { loan_amount: 1200, annual_rate_percent: 0, tenure_years: 1 },
  });
  assert.equal(result.structuredContent.results[0].value, '₹100');
  const daily = await rpc('tools/call', { name: 'popular_calculators', arguments: { collection: 'daily' } });
  assert.ok(daily.structuredContent.calculators.some(item => item.id === 'discount'));
  for (const [name, arguments_, id, inputs] of [
    ['calculate_discount', { original_price: 100, discount_percent: 10, tax_percent: 5 }, 'discount', { price: 100, discount: 10, tax: 5 }],
    ['calculate_age', { date_of_birth: '2000-01-01' }, 'age', { dob: '2000-01-01' }],
    ['calculate_bmi', { weight_kg: 70, height_cm: 170 }, 'bmi', { weight: 70, height: 170 }],
    ['calculate_profit_margin', { revenue: 1000, cost: 600 }, 'profitmargin', { revenue: 1000, cost: 600 }],
    ['calculate_fuel_cost', { distance_km: 100, mileage_km_per_litre: 20, price_per_litre: 100 }, 'fuelcost', { distance: 100, mileage: 20, price: 100 }],
    ['calculate_average', { numbers: [2, 4, 6] }, 'average', { v1: 2, v2: 4, v3: 6 }],
  ]) {
    const actual = await rpc('tools/call', { name, arguments: arguments_ });
    assert.deepEqual(actual.structuredContent.results, calculate(id, inputs).results, name);
  }
  assert.equal(tools.tools.find(t => t.name === 'calculate_emi')._meta.ui.resourceUri, 'ui://seventask-calculator/results-v2.html');
  const resource = await rpc('resources/read', { uri: 'ui://seventask-calculator/results-v2.html' });
  assert.match(resource.contents[0].mimeType, /mcp-app/);
  assert.match(resource.contents[0].text, /SevenTask Calculator/);
  assert.match(resource.contents[0].text, /data:image\/png;base64,/);
  assert.match(resource.contents[0].text, /ui\/notifications\/size-changed/);
  assert.match(resource.contents[0].text, /Edit inputs/);
  assert.match(resource.contents[0].text, /Recalculate/);
  assert.doesNotMatch(resource.contents[0].text, /__STC_ICON_DATA_URI__/);
  const inlineScript = resource.contents[0].text.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(inlineScript, 'MCP Apps result card must include its bridge script');
  assert.doesNotThrow(() => new Script(inlineScript), 'The interactive card must contain valid JavaScript');
  const unsupported = await worker.fetch(new Request('https://example.org/mcp', { method: 'GET' }));
  assert.equal(unsupported.status, 405);
});

test('Worker matches existing 136 calculator formulas and field definitions', async () => {
  const catalog = listCalculators({ limit: 200 });
  assert.equal(catalogSize, 136);
  const ids = catalog.calculators.map(c => c.id);
  // list_calculators is intentionally paginated at 30 per request.
  for (const id of ids) {
    const descriptor = await rpc('tools/call', { name: 'get_calculator', arguments: { calculator_id: id } });
    assert.equal(JSON.stringify(descriptor.structuredContent.fields), JSON.stringify(getCalculator(id).fields), id);
    if (id === 'currency') continue; // Requires a live external exchange-rate provider.
    const expected = calculate(id).results;
    const output = await rpc('tools/call', { name: 'calculate', arguments: { calculator_id: id } });
    assert.equal(JSON.stringify(output.structuredContent.results), JSON.stringify(expected), id);
  }
});

test('Worker rejects invalid and unknown inputs safely', async () => {
  const result = await rpc('tools/call', { name: 'calculate_emi', arguments: { loan_amount: -1, annual_rate_percent: 9, tenure_years: 5 } });
  assert.equal(result.isError, true);
  const unknown = await rpc('tools/call', { name: 'calculate', arguments: { calculator_id: 'not-a-calculator' } });
  assert.equal(unknown.isError, true);
  const badAverage = await rpc('tools/call', { name: 'calculate_average', arguments: { numbers: [1] } });
  assert.equal(badAverage.isError, true);
});
