# SevenTask Calculator — ChatGPT Plugin

Official MCP plugin by **Kawkab Tech Labs** for [SevenTask Calculator](https://seventaskcalculator.in/).

Public listing name: **STC - SevenTask Calculator**. Users can search the installed plugin by this name; if ChatGPT shows it in the `@` menu for the short query `STC`, select it there. ChatGPT does not currently document independent `@` aliases, so `@STC` is a naming/search convenience, not a guaranteed standalone alias.

This is a separate server for ChatGPT; it does not alter the static website or its Cloudflare Pages deployment.

The portable public plugin package is `plugin.json` + `mcp.json` in this directory; private ChatGPT custom-MCP registration and public directory submission are separate steps.

The listing icon and composer icon use `assets/seventask-icon.png` (1024×1024 PNG). The same icon is served publicly at `/icon.png` and advertised in MCP `initialize.serverInfo.icons`. Existing ChatGPT custom-app listings may not support logo editing, even when server metadata is refreshed; public plugin branding uses the submitted package/dashboard.

## What it does

- Searches the **original** SevenTask calculator catalog by name/category.
- Highlights daily essentials, basic maths, finance, business and home/health calculators in five curated collections. The full 136-calculator catalog remains intact.
- Returns the exact inputs, defaults and choices needed by each calculator.
- Runs all of the site's synchronous calculators by reading `../calculator-core.js` at startup and evaluating **only the pure calculation catalog**. This avoids copying 136+ formulas into a second codebase.
- Offers first-class EMI, SIP, GST, percentage, discount, age, BMI, business margin, fuel cost and average tools, plus both curated and all-calculators browsing.
- Offers a premium compact black-and-white MCP Apps result card with the SevenTask logo, highlighted answer, input summary, **Edit inputs** and **Recalculate**. Interactive edits call the same MCP server; ChatGPT hosts that do not render MCP Apps still receive a readable plain-text result.
- Converts currencies with Frankfurter's daily public reference-rate API, which needs Internet access.

The server is stateless, has no user accounts, stores no inputs, and uses no OpenAI API key. The plugin is not an investment, tax or medical adviser. Results are estimates; current rules and assumptions must be verified.

## Live Cloudflare Worker

- **MCP URL:** https://mcp.seventaskcalculator.in/mcp
- **Health:** https://mcp.seventaskcalculator.in/healthz
- **Worker name:** `seventask-calculator-mcp`
- **Status:** v0.3 deployed 2026-11-17 with 14 tools, 5 curated collections, all 136 calculators and the premium compact result card (`ui://seventask-calculator/results-v2.html`). ChatGPT custom connections may need **Refresh tools** and a new chat to discover the updated card; public listing updates require a ZIP upload/review.

This is a separate Worker with its own workers.dev hostname. It does **not** replace or route traffic away from the original Cloudflare Pages site. The Worker is reachable publicly and already used by the private ChatGPT plugin. The separate public-directory submission and review are still pending.

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

1. Open ChatGPT Plugins and add a custom MCP server with `https://mcp.seventaskcalculator.in/mcp`. **Do not point ChatGPT at the static website**; it does not run this MCP server.
2. Connect and inspect the tool descriptors. No sign-in is required for calculations.
3. Install the resulting private plugin and test, for example:
   - `@SevenTask Calculate the EMI on ₹10,00,000 at 9% for 5 years.`
   - `@SevenTask What is the GST-inclusive breakdown for ₹118 at 18%?`
   - `@SevenTask Show daily-use calculators, then calculate 20% off ₹2,500.`
   - `@SevenTask Find the shop profit margin calculator and calculate a sale of ₹20,000 with ₹15,000 costs.`
4. Test all relevant calculators before submitting to the public plugin directory.

For the updated card, use the plugin's **Settings → Refresh tools** if the earlier plain-text result or cached card persists. In a new chat, try `@SevenTask 22 lakh ka 20 percent`, then tap **Edit inputs**, change the number, and tap **Recalculate**. Interactive card rendering is controlled by the ChatGPT host; text-only hosts retain the numeric answer.

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
