# SevenTask Calculator Web App

This is the free web app and PWA. Publish the contents of this folder as the static-host document root. Keep `_redirects`, `_headers`, `calculator.html`, `sw.js`, and `manifest.webmanifest` in the deployed output. Cloudflare Pages clean URLs serve `/calculator` from `calculator.html`; `_redirects` intentionally has no conflicting rewrite, which would create a redirect loop. Keep large desktop binaries in a separate release host; Cloudflare Pages limits each site asset to 25 MiB.

- Local preview: open `index.html`; calculator links use the local `calculator.html` file.
- Production route: `/calculator` is rewritten to `/calculator.html` by `_redirects`.
- PWA install: use the browser's Install app action over HTTPS.
- Windows: use Install & widgets to download the portable ZIP after a hosted desktop release is linked, extract it, and run `SevenTask Calculator.exe`. The local ZIP is in the desktop app's `releases` folder. Pin the running app from its taskbar icon.
- Native Android and iOS releases/widgets are not published yet and remain labeled Coming Soon.

Run the calculator audit with `node audit-calculators.cjs`. See `FEATURE-REVIEW.md` for the current audit coverage and known limits.
