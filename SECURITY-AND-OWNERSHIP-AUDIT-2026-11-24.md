# SevenTask web app: security and ownership audit

Reviewed: 24 November 2026. Web release verified: 1.18.66. Scope: public web application, source snapshot in the active web worktree, production Cloudflare Pages configuration and a limited live browser/API check. The Android APK is separate and was not changed or audited here.

## Ownership

The repository has a proprietary `LICENSE`: Copyright (c) 2026 Kawkab Tech Labs. All rights reserved. The Terms of Use and Open Source Software Licences page say that SevenTask's original code, interface, brand and documentation remain proprietary. Third-party fonts, icons and runtime components retain their own licences. Publishing source or notices does not grant an open-source licence over SevenTask.

## Verified controls and findings

| Priority | Finding | Status / evidence | Remaining action |
| --- | --- | --- | --- |
| High, fixed | The Terms route previously served the homepage. | On 24 Nov, the production `/terms-of-use` route returned the Terms of Use title/content and ownership wording. | Keep this route in the live-route smoke check. |
| Medium, mitigated | Site-wide CSP was absent. | Production HTML now returns enforced `object-src 'none'; base-uri 'self'; frame-ancestors 'self'`, plus a broader CSP in report-only mode. Other response headers include nosniff, referrer, frame and permissions policies. | Review report-only violations and tighten the broader policy before enforcing it. |
| Medium, verified | AI abuse protection could depend on deployment bindings. | Production Pages project `seventaskcalculator` has the `CALCULATOR_AI_RATE_LIMITER` service binding to `seventask-ai-rate-guard`. The Worker is deployed and has a `PER_IP` shared rate-limit binding configured for 8 requests per 60 seconds. | Monitor provider usage and rate-limit errors. Do not rely on the in-memory per-instance counter alone. |
| Medium, open hardening | The calculator evaluates a sanitized expression using `new Function`. | `calculator-core.js` restricts allowed tokens before evaluation, reducing risk, but a dynamic-code sink remains. | Replace it with a small expression parser/evaluator when scheduling engine hardening; preserve scientific functions and operator behavior. |
| Low, open review | Some table-result templates interpolate values without consistent escaping. | `calculator-core.js` interpolates table result `r.title` and `row.year` into `innerHTML`; ordinary labels and values use `escapeHtml`. No direct user-controlled exploit was established in this review. | Trace table producers and escape values or build DOM nodes. |
| Low, fixed | AI dock version used `innerHTML` for dynamic version text. | `ai/assistant-demo.js` creates elements and assigns `textContent`. | Keep dynamic labels as text nodes. |
| Low, fixed | Ownership language was previously implied rather than explicit. | Root `LICENSE`, `terms-of-use.html`, and `privacy-policy.html` now state the proprietary rights position. | Keep ownership and third-party notices aligned as assets change. |

## Live verification

- Production Pages project: `seventaskcalculator`; domain: `https://seventaskcalculator.in`; deployment `a57a858b-78a7-4ac0-a1cc-1641b42d6d54`, source commit `6c6222eb309015d78d97447ec4c0c5fe3fe205eb`.
- `/terms-of-use` returned the Terms page with the All rights reserved wording. `/calculator` returned the calculator page and security headers.
- `GET /api/calculator-ai` returned `{"available":true}`. In the live browser, the AI toggle launched the AI calculator, and typed `2+2` returned result `4`. Turning AI off returned to the basic calculator.
- The live browser granted microphone access and entered the recording state. No spoken phrase was supplied during the check; after recording silence it returned “Voice could not be processed.” This confirms permission/recording startup, but does not verify speech transcription or audio-to-calculation end to end.
- AI/API checks do not certify every tool or every device/browser combination. No Android APK behavior was tested.

## Release gate

The shared rate limiter, production routes, CSP presence, typed AI request and AI/basic toggle path have been checked. Remaining verification is a real spoken sample through the live microphone, plus review of report-only CSP findings. The parser replacement and table escaping are follow-up hardening items. This is a scoped review, not a security certification or a claim that the site is vulnerability-free.
