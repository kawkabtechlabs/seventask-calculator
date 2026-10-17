# Feature and calculation review

## Audit results — 17 October 2026

- Calculator catalog: 136 tools and modes.
- All 136 calculators returned result rows with their normal empty/default inputs.
- All 136 calculators returned usable results with representative populated inputs and zero-boundary inputs; no `NaN` or `undefined` values were found.
- Unit conversion: 1,846 from/to pairs; temperature conversion: all 16 pairs.
- 13 targeted formula checks passed, including tax thresholds, XIRR date/order rules, car-loan financing and interest totals, and zero-rate car-loan behavior.
- Audit command: `node audit-calculators.cjs`.

## Car Loan improvements

- Itemizes car price, sales tax, title/registration fees, down payment, and trade-in credit.
- Calculates amount financed, monthly EMI, total interest, total loan payments, and the total cost including the down payment and trade-in value.
- Prevents negative financed amounts and handles zero-interest loans.

## Deployment and install readiness

- Cloudflare Pages clean URLs serve `calculator.html` at `/calculator`. The root `_redirects` file intentionally avoids a conflicting rewrite because that creates a redirect loop.
- The service worker precaches the calculator file and restores the calculator route when offline. Its syntax has been checked and the cache version advanced to v27.
- The Windows portable ZIP is stored in the sibling desktop release folder. It must be hosted separately before the web download button can be enabled; Cloudflare Pages cannot store a 150 MB asset because its per-file limit is 25 MiB. No setup installer is included in this release.
- Extract the ZIP and run `SevenTask Calculator.exe`; Windows users can pin the running app from its taskbar icon.
- The web app can be installed as a PWA. Native Android/iOS store widgets remain marked Coming Soon until their store releases exist.

## Limits

- Automated checks cover every catalog tool with empty/default and representative inputs, but do not independently prove every domain formula against external authorities.
- Currency conversion requires the Frankfurter reference-rate service and internet access; only the currencies it publishes are available.
- Debt payoff uses monthly APR/12 estimates; lender schedules can differ.
- The India income-tax tool covers the common under-60 slab/rebate case for AY 2026–27, excludes surcharge and special income cases, and is not tax-filing advice.
- Review consequential financial, tax, health, science, or trade outputs against the relevant professional or authoritative source.
