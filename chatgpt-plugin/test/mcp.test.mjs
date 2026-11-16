import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSevenTaskHttpServer } from '../src/server.mjs';

test('HTTP health, MCP discovery, tool execution and UI resource', async () => {
  const server = createSevenTaskHttpServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  let id = 1;
  const rpc = async (method, params = {}) => {
    const response = await fetch(`${origin}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', connection: 'close' },
      body: JSON.stringify({ jsonrpc: '2.0', id: id++, method, params }),
    });
    if (!response.ok) assert.fail(`${method}: ${response.status} ${await response.text()}`);
    return response.json();
  };

  try {
    const health = await (await fetch(origin, { headers: { connection: 'close' } })).json();
    assert.equal(health.status, 'ok');
    assert.equal(health.calculators, 136);

    const init = await rpc('initialize', {
      protocolVersion: '2025-06-18', capabilities: {},
      clientInfo: { name: 'seventask-test', version: '1.0.0' },
    });
    assert.match(init.result.serverInfo.name, /SevenTask/);

    const tools = await rpc('tools/list');
    const names = tools.result.tools.map(tool => tool.name);
    for (const required of ['list_calculators', 'popular_calculators', 'get_calculator', 'calculate', 'calculate_emi', 'calculate_sip', 'calculate_gst', 'calculate_percentage', 'calculate_discount', 'calculate_age', 'calculate_bmi', 'calculate_profit_margin', 'calculate_fuel_cost', 'calculate_average']) {
      assert.ok(names.includes(required), `${required} is not registered`);
    }

    const featured = await rpc('tools/call', { name: 'popular_calculators', arguments: { collection: 'basic' } });
    assert.ok(featured.result.structuredContent.calculators.some(item => item.id === 'fraction'));

    const discount = await rpc('tools/call', { name: 'calculate_discount', arguments: { original_price: 100, discount_percent: 10 } });
    assert.equal(discount.result.structuredContent.id, 'discount');

    const result = await rpc('tools/call', {
      name: 'calculate_emi', arguments: { loan_amount: 1200, annual_rate_percent: 0, tenure_years: 1 },
    });
    assert.equal(result.result.structuredContent.results[0].value, '₹100');

    const generic = await rpc('tools/call', {
      name: 'calculate', arguments: { calculator_id: 'gst', inputs: { amount: 118, rate: 18, type: 'Inclusive' } },
    });
    assert.equal(generic.result.structuredContent.results.find(row => row.label === 'Total GST').value, '₹18');

    const resources = await rpc('resources/read', { uri: 'ui://seventask-calculator/results-v2.html' });
    assert.match(resources.result.contents[0].mimeType, /mcp-app/);
    assert.match(resources.result.contents[0].text, /SevenTask Calculator/);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
