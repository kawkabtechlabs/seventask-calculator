# SevenTask Calculator — ChatGPT Plugin

Official MCP plugin by **Kawkab Tech Labs** for [SevenTask Calculator](https://seventaskcalculator.in/).

This is a separate server for ChatGPT; it does not alter the static website or its Cloudflare Pages deployment.

## What it does

- Searches the **original** SevenTask calculator catalog by name/category.
- Returns the exact inputs, defaults and choices needed by each calculator.
- Runs all of the site's synchronous calculators by reading `../calculator-core.js` at startup and evaluating **only the pure calculation catalog**. This avoids copying 136+ formulas into a second codebase.
- Offers first-class EMI, SIP, GST and percentage tools, plus an all-calculators tool.
- Shows a branded, interactive result card inside ChatGPT. Result editing calls back to the same MCP server.
- Converts currencies with Frankfurter's daily public reference-rate API, which needs Internet access.

The server is stateless, has no user accounts, stores no inputs, and uses no OpenAI API key. The plugin is not an investment, tax or medical adviser. Results are estimates; current rules and assumptions must be verified.

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

1. Deploy the container to an HTTPS host. **Do not point ChatGPT at the static website**; it does not run this MCP server.
2. In ChatGPT Plugins, add a custom MCP server using `https://YOUR-HOST/mcp`.
3. Install the resulting private plugin and test, for example:
   - `@SevenTask Calculate the EMI on ₹10,00,000 at 9% for 5 years.`
   - `@SevenTask What is the GST-inclusive breakdown for ₹118 at 18%?`
   - `@SevenTask Find the shop profit margin calculator and calculate a sale of ₹20,000 with ₹15,000 costs.`
4. Test all relevant calculators before submitting to the public plugin directory.

Official setup: https://developers.openai.com/plugins/build/app-quickstart

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
- [ ] Deploy server to stable public HTTPS hosting
- [ ] Connect and verify the endpoint in ChatGPT, including widget interaction
- [ ] Verify Privacy Policy and Terms cover ChatGPT plugin traffic
- [ ] Test categories with financial/tax/health assumptions and add any current-rate notices
- [ ] Submit for public review; approval is controlled by OpenAI

See `SUBMISSION.md` for proposed listing copy and test prompts.

## Updating calculators

The plugin reads the same `calculator-core.js` as the website. If its `helpers`, `calculator catalog` or `premium icon set` boundaries change, the server **fails clearly at startup** instead of silently running different logic. Review and test on each release.

The catalog is evaluated with Node's `vm` API using no network, filesystem or DOM access within calculation functions. The VM is an isolation measure for ordinary formulas, **not a security boundary for hostile source code**. Only deploy calculator source reviewed in your trusted repository. Calls have a CPU timeout and bounded input sizes.
