# SevenTask Calculator — ChatGPT Plugin

Official MCP plugin by **Kawkab Tech Labs** for [SevenTask Calculator](https://seventaskcalculator.in/).

This is a separate server for ChatGPT; it does not alter the static website or its Cloudflare Pages deployment.

The portable public plugin package is `plugin.json` + `mcp.json` in this directory; private ChatGPT custom-MCP registration and public directory submission are separate steps.

The listing icon and composer icon use `assets/seventask-icon.png` (1024×1024 PNG). The same icon is served publicly at `/icon.png` and advertised in MCP `initialize.serverInfo.icons`; refresh the registered ChatGPT MCP connection to pick up server metadata changes.

## What it does

- Searches the **original** SevenTask calculator catalog by name/category.
- Returns the exact inputs, defaults and choices needed by each calculator.
- Runs all of the site's synchronous calculators by reading `../calculator-core.js` at startup and evaluating **only the pure calculation catalog**. This avoids copying 136+ formulas into a second codebase.
- Offers first-class EMI, SIP, GST and percentage tools, plus an all-calculators tool.
- Shows a branded, interactive result card inside ChatGPT. Result editing calls back to the same MCP server.
- Converts currencies with Frankfurter's daily public reference-rate API, which needs Internet access.

The server is stateless, has no user accounts, stores no inputs, and uses no OpenAI API key. The plugin is not an investment, tax or medical adviser. Results are estimates; current rules and assumptions must be verified.

## Live Cloudflare Worker

- **MCP URL:** https://seventask-calculator-mcp.kawkabtechlabs.workers.dev/mcp
- **Health:** https://seventask-calculator-mcp.kawkabtechlabs.workers.dev/healthz
- **Worker name:** `seventask-calculator-mcp`
- **Status:** deployed 2026-11-16; live HTTP initialization, seven tools, EMI call and HTML resource verified.

This is a new Worker with its own workers.dev hostname. It does **not** replace or route traffic away from the original Cloudflare Pages site. The Worker is reachable publicly, but ChatGPT private installation and the separate public-plugin review are not yet complete.

The Worker is built from the same source with `npm run build:worker`. `scripts/build-worker.mjs` compiles the trusted calculation catalog into `dist/worker.mjs`, using `worker/handler.js` for stateless MCP HTTP. The Node runtime uses `node:vm`; the Worker invokes the static, precompiled formulas directly after input validation and tenure bounds. Do not treat the Worker or Node VM as a secure sandbox for untrusted calculator source.

## Run locally

Requires Node.js >= 22.6 and the repo-root `calculator-core.js` file.

```sh
cd chatgpt-plugin
npm ci
npm test
npm start
```

The health endpoint is `http://localhost:8787/` and MCP endpoint is `http://localhost:8787/mcp`.

To test the MCP endpoint use the official [MCP Inspector](https://github.com/modelcontextprotocol/inspector), or run `npm test` to exercise JSON-RPC initialization, tool listing, and actual tool calls.

### Try it in ChatGPT

1. Open ChatGPT Plugins and add a custom MCP server with `https://seventask-calculator-mcp.kawkabtechlabs.workers.dev/mcp`. **Do not point ChatGPT at the static website**; it does not run this MCP server.
2. Connect and inspect the seven tool descriptors. No sign-in is required for calculations.
3. Install the resulting private plugin and test, for example:
   - `@SevenTask Calculate the EMI on ₹10,00,000 at 9% for 5 years.`
   - `@SevenTask What is the GST-inclusive breakdown for ₹118 at 18%?`
   - `@SevenTask Find the shop profit margin calculator and calculate a sale of ₹20,000 with ₹15,000 costs.`
4. Test all relevant calculators before submitting to the public plugin directory.

Official setup: https://developers.openai.com/plugins/build/app-quickstart

Public package format: https://developers.openai.com/plugins/build/plugins

### Docker

Build from the **repository root** (the Dockerfile needs `calculator-core.js`):

```sh
docker build -f chatgpt-plugin/Dockerfile -t seventask-chatgpt-plugin .
docker run --rm -p 8787:8787 seventask-chatgpt-plugin
```

The hosting provider should map HTTPS to port `8787` and continuously run the service. A subdomain such as `mcp.seventaskcalculator.in` is a natural choice, but must be configured in your own DNS/hosting account.

## Public distribution checklist

- [x] MCP tool endpoint and branded MCP Apps widget
- [x] Reuse the original calculator formulas
- [x] Stateless no-login MVP with strict input validation
- [x] Smoke tests for 136+ calculator catalog and core tools
- [x] Deploy server to stable public HTTPS hosting (Cloudflare Worker)
- [ ] Connect and verify the endpoint in ChatGPT, including widget interaction
- [ ] Verify Privacy Policy and Terms cover ChatGPT plugin traffic
- [ ] Test categories with financial/tax/health assumptions and add any current-rate notices
- [ ] Submit for public review; approval is controlled by OpenAI

See `SUBMISSION.md` for proposed listing copy and test prompts.

## Updating calculators

The plugin reads the same `calculator-core.js` as the website. If its `helpers`, `calculator catalog` or `premium icon set` boundaries change, the server **fails clearly at startup** instead of silently running different logic. Review and test on each release.

The catalog is evaluated with Node's `vm` API using no network, filesystem or DOM access within calculation functions. The VM is an isolation measure for ordinary formulas, **not a security boundary for hostile source code**. Only deploy calculator source reviewed in your trusted repository. Calls have a CPU timeout and bounded input sizes.
