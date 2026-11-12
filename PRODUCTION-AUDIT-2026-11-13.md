# SevenTask Calculator production audit — 13 November 2026

Scope: source and live HTTP checks for web/PWA, Android, and Windows. UI/UX Step 2 was excluded at the owner's request. This is a technical snapshot, not a Play Store approval or device certification.

## Architecture and inventory

- Web: static HTML/CSS/JavaScript on Cloudflare Pages; no web package manager or bundler. `index.html` is the homepage, `calculator.html` hosts the interface, and `calculator-core.js` contains the calculator catalog and engine. `_redirects`, `_headers`, `robots.txt`, and `sitemap.xml` control routes and indexing.
- Calculator catalog: 136 tools across Utility, Loan & EMI, Investment, Tax, Retirement, Savings, Debt & Credit, Property, Business, Market & Stock, Currency, Basic Math, Algebra & Geometry, Construction, Engineering, Health & Fitness, Date & Travel, Science, Technology, Agriculture & EV, Business & Shops, Trade & Materials, Online Seller & Buyer, Expenses & Personal Finance, and Custom. The catalog is embedded in `calculator-core.js`.
- PWA: `manifest.webmanifest` and `sw.js` provide install and network-first caching. User state, history, pinned tools, saved formulas, and theme preferences use localStorage. Currency rates come from Frankfurter. Google Fonts is loaded remotely.
- Android: native Java WebView wrapper in `../work/release-1.18.07/android`, package `in.seventaskcalculator.app`; it loads the live `/calculator?mobile=1&native=1`, exposes a restricted JavaScript bridge, and implements floating windows. Local source version is 1.18.11, code 27, target SDK 35.
- Windows: Electron app in `../work/desktop-release-build`, version 1.18.17, with a local calculator copy, floating bubble, tray, and NSIS installer. It has a package lockfile. Web and desktop calculator copies must be kept in sync deliberately.
- Analytics: no analytics tracker found in the reviewed HTML/JavaScript. This does not prove server-side logging is absent.

## Confirmed issues and priorities

| Priority | Finding and reproduction | Resolution / status |
| --- | --- | --- |
| P0 for Play submission | `../work/release-1.18.07/android/app/build.gradle` targets API 35 and signs `release` with `signingConfigs.debug`. Inspect the file and compare with current Google Play target API and signing requirements. | Block Play submission until API 36 migration is built/tested and the legitimate upload key is configured. Existing direct APK signing lineage must be verified before changing keys. No key was generated or changed in this audit. |
| P1 SEO | `sitemap.xml` listed `/calculator.html`; live `curl -I` returns 308 to `/calculator`. `calculator.html` lacked a canonical link. | Sitemap now lists `/calculator`, and the calculator page declares that canonical URL. The old route remains usable. |
| P2 documentation | `README.md` claimed the sync script updates `mobile-update.json` and native source; `scripts/sync-release.cjs` only updates web labels/cache names. | README corrected. |
| P2 maintainability | Calculator source is copied into the Windows app, so a web fix does not automatically update the packaged desktop copy. Legacy `sw-v103.js` also remains present. | Keep explicit release sync checks; do not remove files before verifying installed-client migration. |
| P2 SEO | `calculator.html` has no static H1; the calculator catalog is rendered by JavaScript inside a custom element. A crawler without JavaScript does not receive meaningful calculator content. | Keep the current indexed route and add crawlable explanatory content in a later content-focused patch. No UI changes were made in this audit. |

## Verification performed

- `node audit-calculators.cjs`: passed; 136 default, 136 populated, 136 zero-boundary cases, 1,846 conversion pairs, 16 temperature pairs, 19 targeted checks, zero reported failures. The six new checks cover custom formula decimals, negatives, supported functions, and rejection of JavaScript syntax. This is sample coverage, not exhaustive proof of every formula.
- `node scripts/sync-release.cjs --check`: passed.
- `node scripts/verify-seo.cjs`: checks canonical links, descriptions, titles, static page headings, and the calculator sitemap URL. The calculator H1 is tracked separately as an open issue.
- `git diff --check`: passed.
- Live `https://seventaskcalculator.in/calculator.html`: 308 to `/calculator`; live `/calculator`: 200. This verifies the canonical issue; it does not verify deployment of this patch.
- Android Gradle build/AAB and physical-device tests: not run; no Android SDK/Gradle command found in this shell.
- Windows installer rebuild, code-signature check, and floating-window manual test: not run in this audit.
- Lighthouse/Core Web Vitals: not run; no score asserted.

## Release checks still required

### Android / Play

1. Preserve the existing package ID and verify the fingerprint of the key that signed distributed APKs. Configure a separate legitimate release/upload signing credential without committing passwords or keystores.
2. Migrate target/compile SDK to 36, then build and test on current and minimum supported Android versions. Generate an AAB and verify its signature, version code, icons, splash, back navigation, permission flow, WebView origin behavior, and offline behavior.
3. Review `SYSTEM_ALERT_WINDOW`, foreground service, notifications, and data safety declarations against actual behavior; verify the live privacy policy URL in Play Console.
4. For applicable new personal accounts, complete the required closed test before applying for production access. Submission and approval remain unverified.

### Windows

1. Copy the tested web core into the desktop package, rebuild the NSIS installer, and test bubble, tray, duplicate windows, resize, install/uninstall, and upgrade over the previous version.
2. Verify the installer SHA-256 and chunk manifest before publication. Configure trusted Windows code signing for publisher identity and SmartScreen reputation; current build configuration does not show a signing certificate.
3. Check that desktop app and web calculator versions are labeled independently and accurately.

## SEO, privacy, PWA, and performance follow-up

- Preserve `/calculator.html` as a redirect while using `/calculator` as the indexed canonical URL. The install and privacy pages now declare canonical URLs and descriptions; confirm their final live routes after deployment.
- Test PWA install/update/offline on Chrome and Android. The service worker is network-first and caches shell assets, but cached data persistence and offline handling need browser tests.
- Review all source-controlled external links and response headers. CSP is currently absent; adding it requires testing Google Fonts, dynamic script execution, and embedded/native contexts before rollout.
- Measure Lighthouse and Core Web Vitals on live mobile and desktop under repeatable conditions before making score claims or changing caching strategy.
