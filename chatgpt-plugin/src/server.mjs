import { createServer as createHttpServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { z } from 'zod';
import { calculate, calculateCurrency, catalogSize, categories, featuredCollections, getCalculator, listCalculators, listFeaturedCalculators } from './catalog.mjs';

const PORT = Number(process.env.PORT || 8787);
const MCP_PATH = '/mcp';
const WIDGET_URI = 'ui://seventask-calculator/results-v2.html';
const icon = readFileSync(new URL('../assets/seventask-icon.png', import.meta.url)).toString('base64');
const widget = readFileSync(new URL('../public/result-widget.html', import.meta.url), 'utf8')
  .replace('__STC_ICON_DATA_URI__', `data:image/png;base64,${icon}`);

const inputValue = z.union([z.string(), z.number()]);
const inputsSchema = z.record(inputValue);
const toolMeta = { ui: { resourceUri: WIDGET_URI },
  'openai/toolInvocation/invoking': 'Calculating with SevenTask…',
  'openai/toolInvocation/invoked': 'Calculation complete' };

function response(result) {
  const primary = result.results.find(row => row.emphasis) ?? result.results[0];
  const message = `${result.name}: ${primary?.label ?? 'Result'} — ${primary?.value ?? 'See results'}`;
  return {
    content: [{ type: 'text', text: `${message}${result.disclaimer ? `\n${result.disclaimer}` : ''}` }],
    structuredContent: result,
  };
}

function errorResponse(error) {
  const message = error instanceof Error ? error.message : 'Calculation could not be completed.';
  return { isError: true, content: [{ type: 'text', text: message }] };
}

async function safeCalculation(callback) {
  try { return response(await callback()); } catch (error) { return errorResponse(error); }
}

export function createSevenTaskServer() {
  const server = new McpServer({
    name: 'SevenTask Calculator by Kawkab Tech Labs',
    version: '0.3.0',
    websiteUrl: 'https://seventaskcalculator.in',
    icons: [{
      src: 'https://seventask-calculator-mcp.kawkabtechlabs.workers.dev/icon.png',
      mimeType: 'image/png',
      sizes: ['1024x1024'],
    }],
  });

  registerAppResource(server, 'seventask-results', WIDGET_URI, {}, async () => ({
    contents: [{
      uri: WIDGET_URI,
      mimeType: RESOURCE_MIME_TYPE,
      text: widget,
      _meta: { ui: { prefersBorder: true } },
    }],
  }));

  server.registerTool('list_calculators', {
    title: 'Find SevenTask calculators',
    description: `Search ${catalogSize} SevenTask calculators by name or category. Use this to find calculator IDs, then get_calculator and calculate. Examples: EMI, GST, age, SIP, shop margin, scientific math, units.`,
    inputSchema: {
      query: z.string().max(80).optional(),
      category: z.string().max(80).optional(),
      offset: z.number().int().min(0).max(1000).optional(),
      limit: z.number().int().min(1).max(30).optional(),
    },
  }, async args => {
    const result = listCalculators(args);
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
  });

  server.registerTool('popular_calculators', {
    title: 'Popular and daily-use calculators',
    description: `Browse featured SevenTask calculators in ${featuredCollections.map(group => `${group.id} (${group.name})`).join(', ')}. Includes everyday maths, shopping, loans, tax, business, home and health. All ${catalogSize} original calculators remain accessible via list_calculators.`,
    inputSchema: {
      collection: z.enum(['daily', 'basic', 'finance', 'business', 'home']).optional(),
      offset: z.number().int().min(0).max(1000).optional(),
      limit: z.number().int().min(1).max(30).optional(),
    },
  }, async args => {
    const result = listFeaturedCalculators(args);
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
  });

  server.registerTool('get_calculator', {
    title: 'Get calculator input fields',
    description: 'Look up exact field keys, defaults, and allowed choices for a calculator ID before calling calculate. For a unit converter, pass selections.cat to get matching from/to units.',
    inputSchema: {
      calculator_id: z.string().min(1).max(80),
      selections: inputsSchema.optional(),
    },
  }, async args => {
    try {
      const result = getCalculator(args.calculator_id, args.selections || {});
      return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
    } catch (error) { return errorResponse(error); }
  });

  registerAppTool(server, 'calculate', {
    title: 'Run a SevenTask calculator',
    description: 'Run any calculator in the SevenTask catalog by calculator_id using its exact input keys. Call get_calculator first for fields. All tools share the original seventaskcalculator.in calculation logic; no values are stored. Currency rates are fetched from Frankfurter.',
    inputSchema: { calculator_id: z.string().min(1).max(80), inputs: inputsSchema.optional() },
    _meta: toolMeta,
  }, async args => safeCalculation(async () => {
    const id = args.calculator_id;
    const inputs = args.inputs || {};
    if (id === 'currency' || (id === 'unitconverter' && inputs.cat === 'Currency')) {
      const from = String(inputs.from || (id === 'currency' ? 'USD' : 'USD')).toUpperCase();
      const to = String(inputs.to || (id === 'currency' ? 'INR' : 'INR')).toUpperCase();
      return calculateCurrency({ from, to, amount: Number(inputs.value ?? 1) });
    }
    return calculate(id, inputs);
  }));

  registerAppTool(server, 'calculate_emi', {
    title: 'EMI and loan repayment',
    description: 'Calculate monthly loan EMI, total interest, total payment and a yearly loan breakup in INR. Annual interest rate is a percentage (e.g. 9 for 9%).',
    inputSchema: {
      loan_amount: z.number().nonnegative().max(1e12),
      annual_rate_percent: z.number().min(0).max(100),
      tenure_years: z.number().positive().max(100),
    },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('emi', {
    principal: args.loan_amount, rate: args.annual_rate_percent, years: args.tenure_years,
  })));

  registerAppTool(server, 'calculate_sip', {
    title: 'SIP investment projection',
    description: 'Estimate future value, invested amount, and returns for a monthly SIP in INR with an assumed annual percentage return. This is a projection, not a guaranteed return.',
    inputSchema: {
      monthly_investment: z.number().nonnegative().max(1e12),
      annual_return_percent: z.number().min(-100).max(100),
      years: z.number().positive().max(100),
    },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('sip', {
    monthly: args.monthly_investment, returnRate: args.annual_return_percent, years: args.years,
  })));

  registerAppTool(server, 'calculate_gst', {
    title: 'GST inclusive or exclusive',
    description: 'Calculate Indian GST tax breakdown in INR, inclusive or exclusive of the provided amount. Choose an applicable percentage rate; do not assume the correct rate for a product.',
    inputSchema: {
      amount: z.number().nonnegative().max(1e12),
      gst_rate_percent: z.union([z.literal(5), z.literal(12), z.literal(18), z.literal(28)]),
      mode: z.enum(['Inclusive', 'Exclusive']),
    },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('gst', {
    amount: args.amount, rate: args.gst_rate_percent, type: args.mode,
  })));

  registerAppTool(server, 'calculate_percentage', {
    title: 'Percentage of a number',
    description: 'Find X percent of a value, and compare X as a percentage of that value.',
    inputSchema: { percent: z.number().min(-1e6).max(1e6), of_value: z.number().min(-1e12).max(1e12) },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('percentage', { a: args.percent, b: args.of_value })));

  registerAppTool(server, 'calculate_discount', {
    title: 'Shopping discount and final price',
    description: 'Calculate savings, discounted selling price and optional tax on an original price.',
    inputSchema: {
      original_price: z.number().nonnegative().max(1e12),
      discount_percent: z.number().min(0).max(100),
      tax_percent: z.number().min(0).max(100).optional(),
    },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('discount', { price: args.original_price, discount: args.discount_percent, tax: args.tax_percent ?? 0 })));

  registerAppTool(server, 'calculate_age', {
    title: 'Age from date of birth',
    description: 'Calculate age from an ISO calendar date of birth (YYYY-MM-DD).',
    inputSchema: { date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('age', { dob: args.date_of_birth })));

  registerAppTool(server, 'calculate_bmi', {
    title: 'Body mass index (BMI)',
    description: 'Calculate BMI from weight in kilograms and height in centimetres. General screening metric, not a diagnosis.',
    inputSchema: { weight_kg: z.number().positive().max(1e5), height_cm: z.number().positive().max(500) },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('bmi', { weight: args.weight_kg, height: args.height_cm })));

  registerAppTool(server, 'calculate_profit_margin', {
    title: 'Business profit margin',
    description: 'Calculate profit and margin percentage from total revenue and total costs.',
    inputSchema: { revenue: z.number().nonnegative().max(1e12), cost: z.number().nonnegative().max(1e12) },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('profitmargin', args)));

  registerAppTool(server, 'calculate_fuel_cost', {
    title: 'Travel fuel cost',
    description: 'Estimate petrol or diesel trip cost from distance, mileage and fuel price per litre.',
    inputSchema: {
      distance_km: z.number().nonnegative().max(1e9),
      mileage_km_per_litre: z.number().positive().max(1e6),
      price_per_litre: z.number().nonnegative().max(1e9),
    },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('fuelcost', { distance: args.distance_km, mileage: args.mileage_km_per_litre, price: args.price_per_litre })));

  registerAppTool(server, 'calculate_average', {
    title: 'Average of two to five numbers',
    description: 'Find the arithmetic mean of two to five provided values.',
    inputSchema: { numbers: z.array(z.number().finite()).min(2).max(5) },
    _meta: toolMeta,
  }, async args => safeCalculation(() => calculate('average', Object.fromEntries(args.numbers.map((value, i) => [`v${i + 1}`, value])))));

  return server;
}

export function createSevenTaskHttpServer() {
  return createHttpServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (req.method === 'OPTIONS' && url.pathname === MCP_PATH) {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type, accept, mcp-session-id, mcp-protocol-version',
        'Access-Control-Expose-Headers': 'Mcp-Session-Id',
      }).end();
      return;
    }
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/healthz')) {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        .end(JSON.stringify({ name: 'SevenTask Calculator MCP', status: 'ok', calculators: catalogSize, categories: categories.length }));
      return;
    }
    if (url.pathname === MCP_PATH && ['POST', 'GET', 'DELETE'].includes(req.method)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
      res.setHeader('Cache-Control', 'no-store');
      const server = createSevenTaskServer();
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      res.on('close', () => { void transport.close(); void server.close(); });
      try {
        await server.connect(transport);
        await transport.handleRequest(req, res);
      } catch (error) {
        console.error('SevenTask MCP request failed:', error instanceof Error ? error.message : String(error));
        if (!res.headersSent) res.writeHead(500).end('Internal server error');
      }
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not Found');
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  createSevenTaskHttpServer().listen(PORT, '0.0.0.0', () => {
    console.log(`SevenTask Calculator MCP running on http://localhost:${PORT}/mcp`);
  });
}
