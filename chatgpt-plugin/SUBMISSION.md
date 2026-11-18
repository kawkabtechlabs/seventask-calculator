# SevenTask Calculator — Public Plugin Submission Draft

**Name:** STC - SevenTask Calculator

**Developer:** Kawkab Tech Labs

**Homepage:** https://seventaskcalculator.in/

**Support:** https://mcp.seventaskcalculator.in/support

**Privacy policy:** https://seventaskcalculator.in/privacy-policy

**MCP endpoint:** https://mcp.seventaskcalculator.in/mcp

**Portable plugin manifest:** `chatgpt-plugin/plugin.json`

**Portable MCP configuration:** `chatgpt-plugin/mcp.json`

**Short description:** 136 SevenTask calculators, with popular daily-use and basic maths tools up front.

**Full description:** SevenTask Calculator brings Kawkab Tech Labs' versatile 136-calculator library into ChatGPT. Browse daily essentials, basic maths, money and loans, business, and home/health collections; run discounts, age, EMI, SIP, GST, BMI, fuel cost, averages and more directly. Search for any specialist tool, inspect its inputs, calculate with the website's original engine, and read branded results. Financial/tax outputs are estimates, not advice. Daily currency reference rates use Frankfurter.

**Example prompts:**

1. `Calculate my monthly EMI for ₹15 lakh at 8.5% for 7 years.`
2. `Show the final value for a ₹5,000 monthly SIP over 10 years at an assumed 11% annual return.`
3. `Split GST out of ₹1,180 when GST is 18% inclusive.`
4. `Find the Kirana multi-item bill calculator and show its fields.`
5. `How much paint will I need for 400 sq ft? Find the correct calculator.`
6. `Convert 3 kilometres to metres with SevenTask.`
7. `Show me SevenTask's daily essentials and basic maths calculators.`
8. `Calculate a 15% discount on ₹3,000 with 5% tax.`

**Data processing summary:** Tool parameters are processed in server memory to calculate answers and are not persisted by the plugin. Network requests are only used for currency reference rates. Host-level access logs, if enabled by the deployment provider, must be configured not to store tool input bodies or personal data. ChatGPT itself processes plugin calls under its own privacy terms.

**Before submitting:**

- Validate the deployed MCP endpoint and branded widget in the ChatGPT private test connection.
- Confirm brand name/icon rights and production support email.
- Confirm public Privacy Policy and Terms accurately state plugin data practices and currency provider.
- Review current Indian tax and finance assumptions, including the website's assessment-year labels.
- Test private installation, all tool schemas, UI, error handling, and direct/indirect prompts.
- Add rate limits, monitoring and a production deploy/rollback plan.

**Developer documentation:** https://developers.openai.com/plugins/build/app-quickstart
