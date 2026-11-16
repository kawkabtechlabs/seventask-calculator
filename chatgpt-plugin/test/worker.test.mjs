import assert from 'node:assert/strict';
import { test } from 'node:test';
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
  const tools = await rpc('tools/list');
  assert.equal(tools.tools.length, 7);
  const result = await rpc('tools/call', {
    name: 'calculate_emi', arguments: { loan_amount: 1200, annual_rate_percent: 0, tenure_years: 1 },
  });
  assert.equal(result.structuredContent.results[0].value, '₹100');
  assert.equal(tools.tools.find(t => t.name === 'calculate_emi')._meta.ui.resourceUri, 'ui://seventask-calculator/results-v1.html');
  const resource = await rpc('resources/read', { uri: 'ui://seventask-calculator/results-v1.html' });
  assert.match(resource.contents[0].mimeType, /mcp-app/);
  assert.match(resource.contents[0].text, /SevenTask Calculator/);
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
});
