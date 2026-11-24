# SevenTask web app: security and ownership audit

Source snapshot reviewed: 24 November 2026. Scope: web deployment source at release record 1.18.65. A small live HTTP check was also performed on the public domain. Cloudflare account settings and third-party account configuration were not available to inspect.

## Ownership conclusion

The repository now has an explicit proprietary `LICENSE`: Copyright (c) 2026 Kawkab Tech Labs. All rights reserved. The Terms of Use and the Open Source Software Licences page now say that SevenTask's original code, interface, brand and documentation remain proprietary. Third-party fonts, icons and runtime components retain their own licences. Publishing source or notices does not grant an open-source licence over SevenTask.

## Security findings

| Priority | Finding | Evidence | Action |
| --- | --- | --- | --- |
| High | The live Terms of Use route serves the homepage. | On 24 Nov 2026, both `/terms-of-use` and `/terms-of-use.html` returned HTTP 200 with the homepage title/body. The intended `terms-of-use.html` exists in source but is not serving publicly. | Include the Terms file in the deployed output, verify both URLs return the Terms title/body and legal links, and prevent a silent homepage fallback for missing legal routes. |
| Medium | A site-wide Content Security Policy is absent. | `_headers` has nosniff, referrer, frame and permissions policies, but no site-wide CSP. HTML includes inline scripts/styles, Google Fonts and ads. | Inventory inline code and external origins, move scripts/styles to files or use hashes/nonces, then introduce CSP in report-only mode before enforcement. Do not add a blanket CSP that breaks the calculator. |
| Medium | AI abuse protection depends on deployment configuration. | `server/calculator-ai.mjs` has an eight-requests-per-minute in-memory IP counter. A shared `CALCULATOR_AI_RATE_LIMITER` is optional. | Confirm a distributed rate limiter is bound in production and monitor provider spend/errors. In-memory limits alone are per worker instance. |
| Medium | The calculator still evaluates a sanitized expression with `new Function`. | `calculator-core.js` `sanitize()` restricts allowed tokens before `evalExpr()`, which reduces risk but leaves a dynamic-code sink. | Replace it with a small expression parser/evaluator when scheduling engine hardening; preserve scientific functions and operator behavior. Review the sanitizer when adding new tokens. |
| Low | Some HTML result templates interpolate values without consistent escaping. | In `calculator-core.js`, table result `r.title` and `row.year` are interpolated into `innerHTML`; ordinary result labels/values use `escapeHtml`. | Trace all table producers, then escape the title and cells or build DOM nodes. Current review does not establish a direct user-controlled exploit path. |
| Low, fixed | AI dock version used `innerHTML` for a string sourced from native bridge or web data attribute. | `ai/assistant-demo.js` now creates DOM elements and assigns `textContent`. | Keep version and other dynamic labels as text nodes. |
| Low, fixed | Rights language was implied rather than explicit. | Root `LICENSE`, `terms-of-use.html`, `privacy-policy.html`. | Keep all three in sync when changing ownership or third-party assets. |

## Controls present in source

- Gemini credential is read only in `server/calculator-ai.mjs` from `GEMINI_API_KEY`; the client calls `/api/calculator-ai`.
- API checks Origin, limits body/prompt/audio sizes, validates selected tool IDs and response schema, returns `Cache-Control: no-store`, and supports an optional shared limiter.
- `.gitignore` excludes `.env`, `.env.*`, `.wrangler/` and `node_modules/`. A targeted scan found no obvious embedded Gemini key or private key in reviewed web source files. This is not a full secrets scan of git history or external storage.
- `_headers` sets `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and `Permissions-Policy`.
- `sw.js` bypasses `/api/`, downloads and release metadata; it does not cache AI POST results.

## Live HTTP spot check, 24 Nov 2026

- `/` and `/calculator` returned HTTP 200 with `X-Frame-Options: SAMEORIGIN` and no `Content-Security-Policy` response header.
- `/privacy-policy` returned the privacy page. `/terms-of-use` and `/terms-of-use.html` returned the homepage, despite HTTP 200. A successful status code alone is therefore insufficient for route verification.
- `GET /api/calculator-ai` returned `{ "available": true }`. This confirms configured provider availability only; no prompt, audio or calculation request was sent during this audit.
- The new All rights reserved wording is in local source and the updated handoff PDF. It was not present in the live Terms route at the time of the check.

## Professional release gate

Before claiming production security readiness: check live response headers and route behavior; confirm secret and rate-limiter bindings in Cloudflare; review third-party scripts and CSP plan; run the existing calculator and web smoke checks; verify mobile/desktop basic, AI, voice and offline flows. Record commit and deployment URL. The present audit does not certify the live site or Android APK.
