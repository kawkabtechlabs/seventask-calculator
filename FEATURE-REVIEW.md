# Calculator feature smoke review

Run date: 17 October 2026. Source: SevenTask Calculator web app catalog and the personal-finance feature plan. Repeatable check: `node audit-calculators.cjs`.

- Current catalog: 136 unique calculator entries across 25 groups, plus basic, scientific, Casio-style and programmer modes. The total shown in the app is generated from the catalog so it stays in sync as tools are added.
- Expenses & Personal Finance contains calculation tools only: categorized income and expenses, asset and net-worth breakdowns, debt payoff, recurring costs, Khata balance, shared-bill settlement and business expense balance. Budget/savings/reserve planners are excluded from this category.
- Ran deterministic checks on the expense totals, net-worth components, negative cash flow, unpayable debt, overpayment and invalid split. Debt payoff uses monthly APR/12 compounding as an estimate; lender schedules may use different terms or rounding.
- These are calculation forms, not a complete personal-finance ledger. Transaction storage, receipts/OCR, actual reminders, cloud sync, AI, and report export need backend/product services and are not represented as working features here.
- Executed all 136 catalog `compute()` functions in a Node VM with their schema defaults; all returned result rows without throwing. `audit-calculators.cjs` reruns this catalog smoke check and targeted XIRR/tax checks.
- Executed all 1,846 directed unit-pair conversions across 34 factor-based categories and all 16 temperature pairs. Checks found no NaN/undefined results; prior representative fuel-economy, imperial volume, speed and length examples also passed. Zero fuel economy is guarded.
- Spot checks: ₹1,200 at 0% for 12 months returned ₹100 monthly EMI; ₹100 growing to ₹121 over 2 years returned 10% CAGR; 0°C converted to 32°F.
- Date picker smoke checks confirmed direct month/year controls and correct leap-year behavior (February 2024 has 29 days; February 2023 has 28). The custom formula builder supports eight named inputs (A–H), common math functions, safe token parsing, and saved input presets. `Ctrl/⌘+K`, Backspace from a tool, and typing “calculator” provide routes back to calculator search.
- History is now stored locally (up to 100 entries) and rendered as safe text nodes; desktop bubble/mobile full-screen wiring was statically reviewed. Calculator shell, plans, login and checkout screens use a white-and-black theme and the matching calculator icon; branding names SevenTask Calculator and Kawkab Tech Labs. A browser UI preview was blocked by the browser security policy for local file URLs, so widget/history/login layouts have not received visual device QA. This is a formula execution smoke check, not independent validation of every financial, tax, health or science formula.
- Rebranded product-facing labels to SevenTask Calculator and changed numeric readouts, expressions, history, programmer output and time picker digits from monospaced glyphs to standard system sans-serif numerals.

The measurement catalog targets common and engineering use; it is not a promise to include every specialist unit used in every industry. Native iOS/Android widgets and signed store builds are not included in this PWA handoff.

Fixed the income-tax calculator for AY 2026–27 (under-60 individual slabs, resident section 87A rebates, basic marginal relief above the rebate threshold, 4% cess, and an explicit residential-status input). It excludes surcharge and many special incomes/deductions; the official Income Tax Department table is the reference: https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1.

Replaced the two-cash-flow XIRR Newton iteration with a closed-form Actual/365 calculation, and reject non-positive amounts or a final date that is not after the investment date. It remains a two-date estimate, not a multi-cash-flow XIRR model.

Remaining limits: currency quotes are daily reference rates rather than live trading prices; input validation varies by calculator; several outputs are simplified estimates; custom formulas accept only a restricted set of math operators, variables and functions through a token parser; this is not a general programming language.

Currency conversion now loads the provider-supported ISO currency catalog and fetches daily reference rates from Frankfurter's public v2 API. The provider documents 223 currencies, no API key, and daily updates. Currency list and successful pair rates are cached locally. This adds network dependence for fresh quotes; it cannot promise a rate for codes/pairs the provider does not quote.
