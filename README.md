# SevenTask Calculator — Web app

This folder is the official website and web/PWA deliverable. Upload `webapp/` to an HTTPS static host. `index.html` is the product landing page with an embedded live calculator and download/store status; `calculator.html` is the focused full-screen calculator page. It works in modern desktop and mobile browsers; supported browsers can install it as a PWA. Offline app-shell support begins after the first successful HTTPS visit.

Use `install.html` for the device/download hub. The Windows desktop download is linked from the landing page and install hub; store buttons remain pending until the Play Store and App Store listings are published. For desktop downloads to work, publish this web app alongside `../desktop/releases/` under the same host root. The download buttons appear only when the corresponding installer exists. Android/iOS store links should be set after store approval.

This web bundle includes 136 calculator entries, conversion/date/currency features, persistent history, Undo/Redo and the branded calculator UI. The India individual income-tax estimate is labeled for AY 2026–27 and covers the common under-60 slab/rebate case; it includes resident rebate and threshold relief, excludes surcharge and special income cases, and is not tax-filing advice. Login and payment are interface prototypes; production accounts, billing and plan limits need backend services.

The Expenses & Personal Finance section contains calculation tools only: categorized income and expenses, assets and net worth, debt payoff, recurring costs, Khata balance, shared bill settlement and business expense balance. It does not contain planners or trackers, store a transaction ledger, or send reminders.
# Partner API and floating bubble

- Open `partner-api.html` for copyable integration instructions and widget preview.
- `embed.js` is the drop-in script. Replace the placeholder host in the docs after deployment; it opens `calculator.html` in a responsive floating panel.
- Partner plan pricing is ₹199/month or ₹1,990/year and includes 10,000 API calculations per month. The API service is in `../payments/`.
- Checkout is a scaffold until Razorpay merchant credentials and HTTPS hosting are configured. See `../payments/README.md` for setup and production limitations.
- Commercial API and embedded calculator enquiries: [kawkabtechlabs@gmail.com](mailto:kawkabtechlabs@gmail.com). The mailbox link is ready; there is no connected CRM or automatic enquiry handling yet.
- Revenue plan: the consumer product is designed to stay ad-free. Proposed income comes from paid Pro subscriptions and the ₹199/month or ₹1,990/year partner API/embed plan; checkout and paid entitlements are not live until the production backend and merchant account are configured.
- Launch order: publish and verify the web app first. Start app-store release work after the web launch, then connect the native app listings to the live web service.
