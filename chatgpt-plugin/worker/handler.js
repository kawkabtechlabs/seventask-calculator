// Worker-native, stateless MCP Streamable HTTP adapter. The calculation
// catalog and branded HTML widget are injected by scripts/build-worker.mjs.
const MCP_URI = 'ui://seventask-calculator/results-v1.html';
const MCP_MIME = 'text/html;profile=mcp-app';
const INPUT_VALUE = { oneOf: [{ type: 'string' }, { type: 'number' }] };
const INPUTS = { type: 'object', additionalProperties: INPUT_VALUE };
const str = (maxLength = 80) => ({ type: 'string', maxLength });
const numSchema = (min, max, exclusiveMinimum = false) => ({
  type: 'number', ...(exclusiveMinimum ? { exclusiveMinimum: min } : { minimum: min }), maximum: max,
});
const schema = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const TOOL_UI = {
  ui: { resourceUri: MCP_URI },
  'openai/outputTemplate': MCP_URI,
  'openai/toolInvocation/invoking': 'Calculating with SevenTask…',
  'openai/toolInvocation/invoked': 'Calculation complete',
};
const tools = [
  {
    name: 'list_calculators', title: 'Find SevenTask calculators',
    description: `Search ${catalogSize} SevenTask calculators by name or category. Use calculator IDs with get_calculator and calculate.`,
    inputSchema: schema({ query: str(), category: str(), offset: { type: 'integer', minimum: 0, maximum: 1000 }, limit: { type: 'integer', minimum: 1, maximum: 30 } }),
  },
  {
    name: 'get_calculator', title: 'Get calculator input fields',
    description: 'Look up the field keys, defaults and choices for a calculator ID before calculating.',
    inputSchema: schema({ calculator_id: str(), selections: INPUTS }, ['calculator_id']),
  },
  {
    name: 'calculate', title: 'Run a SevenTask calculator',
    description: `Run any of ${catalogSize} original SevenTask calculators by calculator_id. Call get_calculator first. No inputs are stored.`,
    inputSchema: schema({ calculator_id: str(), inputs: INPUTS }, ['calculator_id']), _meta: TOOL_UI,
  },
  {
    name: 'calculate_emi', title: 'EMI and loan repayment',
    description: 'Calculate monthly loan EMI, total interest and total payment in INR.',
    inputSchema: schema({ loan_amount: numSchema(0, 1e12), annual_rate_percent: numSchema(0, 100), tenure_years: numSchema(0, 100, true) }, ['loan_amount', 'annual_rate_percent', 'tenure_years']), _meta: TOOL_UI,
  },
  {
    name: 'calculate_sip', title: 'SIP investment projection',
    description: 'Estimate future value of monthly SIP in INR. This is a projection, not a guaranteed return.',
    inputSchema: schema({ monthly_investment: numSchema(0, 1e12), annual_return_percent: numSchema(-100, 100), years: numSchema(0, 100, true) }, ['monthly_investment', 'annual_return_percent', 'years']), _meta: TOOL_UI,
  },
  {
    name: 'calculate_gst', title: 'GST inclusive or exclusive',
    description: 'Calculate Indian GST tax breakdown in INR. Confirm the applicable tax rate yourself.',
    inputSchema: schema({ amount: numSchema(0, 1e12), gst_rate_percent: { type: 'number', enum: [5, 12, 18, 28] }, mode: { type: 'string', enum: ['Inclusive', 'Exclusive'] } }, ['amount', 'gst_rate_percent', 'mode']), _meta: TOOL_UI,
  },
  {
    name: 'calculate_percentage', title: 'Percentage of a number',
    description: 'Find X percent of a value, and compare X as a percentage of that value.',
    inputSchema: schema({ percent: numSchema(-1e6, 1e6), of_value: numSchema(-1e12, 1e12) }, ['percent', 'of_value']), _meta: TOOL_UI,
  },
];
const toolByName = new Map(tools.map(tool => [tool.name, tool]));
const json = data => JSON.stringify(data);
const success = (id, result) => ({ jsonrpc: '2.0', id, result });
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });
const errorResult = error => ({ isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : 'Calculation failed.' }] });

function validateValue(value, spec) {
  if (spec.oneOf) return spec.oneOf.some(child => validateValue(value, child));
  if (spec.type === 'number' || spec.type === 'integer') {
    if (typeof value !== 'number' || !Number.isFinite(value) || (spec.type === 'integer' && !Number.isInteger(value))) return false;
    if ('minimum' in spec && value < spec.minimum) return false;
    if ('exclusiveMinimum' in spec && value <= spec.exclusiveMinimum) return false;
    if ('maximum' in spec && value > spec.maximum) return false;
  } else if (spec.type === 'string') {
    if (typeof value !== 'string' || (spec.maxLength && value.length > spec.maxLength)) return false;
  } else if (spec.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    if (spec.required?.some(key => !(key in value))) return false;
    for (const [key, val] of Object.entries(value)) {
      const prop = spec.properties?.[key] ?? spec.additionalProperties;
      if (!prop || prop === false || !validateValue(val, prop)) return false;
    }
  }
  if (spec.enum && !spec.enum.includes(value)) return false;
  return true;
}

function toolReply(result) {
  const primary = result.results.find(row => row.emphasis) ?? result.results[0];
  return {
    content: [{ type: 'text', text: `${result.name}: ${primary?.label ?? 'Result'} — ${primary?.value ?? 'See results'}${result.disclaimer ? `\n${result.disclaimer}` : ''}` }],
    structuredContent: result,
  };
}

async function executeTool(name, args = {}) {
  const tool = toolByName.get(name);
  if (!tool) return errorResult(new Error(`Unknown tool: ${name}`));
  if (!validateValue(args, tool.inputSchema)) return errorResult(new Error(`Invalid ${name} input. Check the tool schema.`));
  try {
    if (name === 'list_calculators') {
      const result = listCalculators(args);
      return { content: [{ type: 'text', text: json(result) }], structuredContent: result };
    }
    if (name === 'get_calculator') {
      const result = getCalculator(args.calculator_id, args.selections ?? {});
      return { content: [{ type: 'text', text: json(result) }], structuredContent: result };
    }
    let result;
    if (name === 'calculate') {
      const inputs = args.inputs ?? {};
      if (args.calculator_id === 'currency' || (args.calculator_id === 'unitconverter' && inputs.cat === 'Currency')) {
        result = await calculateCurrency({ from: String(inputs.from ?? 'USD').toUpperCase(), to: String(inputs.to ?? 'INR').toUpperCase(), amount: Number(inputs.value ?? 1) });
      } else result = calculate(args.calculator_id, inputs);
    } else if (name === 'calculate_emi') result = calculate('emi', { principal: args.loan_amount, rate: args.annual_rate_percent, years: args.tenure_years });
    else if (name === 'calculate_sip') result = calculate('sip', { monthly: args.monthly_investment, returnRate: args.annual_return_percent, years: args.years });
    else if (name === 'calculate_gst') result = calculate('gst', { amount: args.amount, rate: args.gst_rate_percent, type: args.mode });
    else result = calculate('percentage', { a: args.percent, b: args.of_value });
    return toolReply(result);
  } catch (error) { return errorResult(error); }
}

async function mcpMessage(message) {
  if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    return rpcError(message?.id ?? null, -32600, 'Invalid JSON-RPC request');
  }
  if (!Object.hasOwn(message, 'id')) return null; // notifications need no response
  const { id, method, params = {} } = message;
  if (method === 'initialize') {
    return success(id, {
      protocolVersion: params.protocolVersion || '2025-06-18',
      capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
      serverInfo: { name: 'SevenTask Calculator by Kawkab Tech Labs', version: '0.1.0', websiteUrl: 'https://seventaskcalculator.in' },
      instructions: 'Use list_calculators and get_calculator to discover inputs. Use calculate or direct tools. Financial/tax results are estimates.',
    });
  }
  if (method === 'ping') return success(id, {});
  if (method === 'tools/list') return success(id, { tools });
  if (method === 'tools/call') return success(id, await executeTool(params.name, params.arguments));
  if (method === 'resources/list') return success(id, { resources: [{ uri: MCP_URI, name: 'SevenTask Results', mimeType: MCP_MIME }] });
  if (method === 'resources/read') {
    if (params.uri !== MCP_URI) return rpcError(id, -32602, 'Unknown resource URI');
    return success(id, { contents: [{ uri: MCP_URI, mimeType: MCP_MIME, text: WIDGET_HTML, _meta: { ui: { prefersBorder: true } } }] });
  }
  if (method === 'prompts/list') return success(id, { prompts: [] });
  return rpcError(id, -32601, `Unknown method: ${method}`);
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, accept, mcp-session-id, mcp-protocol-version',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
  'Cache-Control': 'no-store',
};
const respondJson = (data, status = 200) => new Response(json(data), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

export default {
  async fetch(request) {
    const pathname = new URL(request.url).pathname;
    if ((pathname === '/' || pathname === '/healthz') && request.method === 'GET') {
      return respondJson({ name: 'SevenTask Calculator MCP', status: 'ok', calculators: catalogSize, categories: categories.length });
    }
    if (pathname !== '/mcp') return new Response('Not Found', { status: 404 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { ...cors, Allow: 'POST, OPTIONS' } });
    try {
      if (Number(request.headers.get('content-length') ?? 0) > 65536) return respondJson({ error: 'Body too large' }, 413);
      const raw = await request.text();
      if (raw.length > 65536) return respondJson({ error: 'Body too large' }, 413);
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return respondJson(rpcError(null, -32600, 'Batch requests are not supported'));
      const reply = await mcpMessage(data);
      if (!reply) return new Response(null, { status: 202, headers: cors });
      return respondJson(reply);
    } catch (error) {
      console.error(json({ message: 'mcp_request_failed', error: error instanceof Error ? error.message : String(error) }));
      return respondJson(rpcError(null, -32700, 'Could not parse MCP request'), 400);
    }
  },
};
