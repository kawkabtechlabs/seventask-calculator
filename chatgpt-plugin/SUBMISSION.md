# SevenTask Calculator — Public Plugin Submission Draft

**Name:** SevenTask Calculator

**Developer:** Kawkab Tech Labs

**Homepage:** https://seventaskcalculator.in/

**Privacy policy:** https://seventaskcalculator.in/privacy-policy

**MCP endpoint:** https://seventask-calculator-mcp.kawkabtechlabs.workers.dev/mcp

**Portable plugin manifest:** `chatgpt-plugin/plugin.json`

**Portable MCP configuration:** `chatgpt-plugin/mcp.json`

**Short description:** Calculate EMI, SIP, GST, business costs, daily maths, conversions and more with 136+ focused calculators from SevenTask.

**Full description:** SevenTask Calculator brings Kawkab Tech Labs' versatile calculator library into ChatGPT. Search for the right tool, inspect its input fields, calculate with the original website's engine, and read clear, branded results. Common finance and tax outputs are estimates, not advice. Daily currency reference rates use Frankfurter.

**Example prompts:**

1. `Calculate my monthly EMI for ₹15 lakh at 8.5% for 7 years.`
2. `Show the final value for a ₹5,000 monthly SIP over 10 years at an assumed 11% annual return.`
3. `Split GST out of ₹1,180 when GST is 18% inclusive.`
4. `Find the Kirana multi-item bill calculator and show its fields.`
5. `How much paint will I need for 400 sq ft? Find the correct calculator.`
6. `Convert 3 kilometres to metres with SevenTask.`

**Data processing summary:** Tool parameters are processed in server memory to calculate answers and are not persisted by the plugin. Network requests are only used for currency reference rates. Host-level access logs, if enabled by the deployment provider, must be configured not to store tool input bodies or personal data. ChatGPT itself processes plugin calls under its own privacy terms.

**Before submitting:**

- Validate the deployed MCP endpoint and branded widget in the ChatGPT private test connection.
- Confirm brand name/icon rights and production support email.
- Confirm public Privacy Policy and Terms accurately state plugin data practices and currency provider.
- Review current Indian tax and finance assumptions, including the website's assessment-year labels.
- Test private installation, all tool schemas, UI, error handling, and direct/indirect prompts.
- Add rate limits, monitoring and a production deploy/rollback plan.

**Developer documentation:** https://developers.openai.com/plugins/build/app-quickstart
