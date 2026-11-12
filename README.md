# SevenTask Calculator web app

Static website and PWA for SevenTask Calculator, published on Cloudflare Pages.

- `index.html` is the homepage and `calculator.html` is the full calculator.
- `/calculator` is served through `_redirects` without a redirect loop.
- `manifest.webmanifest`, the transparent SVG/PNG icons and `sw.js` provide the installable PWA shell.
- The Windows desktop installer is version 1.18.17. The install page downloads its 8 MiB chunks from `downloads/desktop-1.18.17/`, checks every chunk SHA-256, and verifies the reconstructed installer size before saving.
- The version 1.18.11 Android APK is built at `downloads/mobile-1.18.11/`, versionCode 27, signed with the existing app certificate, and linked from the install page and native update manifest.
- The desktop app supports its floating bubble, independent duplicate calculator windows, maximize/restore and resize.

Run the calculator audit with `node audit-calculators.cjs`. Deploy the contents of this repository root to Cloudflare Pages.

`release.json` holds the current web version and the Android build number last recorded here. `node scripts/sync-release.cjs` synchronizes web version labels and service-worker cache names only. It does not build native apps, change native version numbers, or update `mobile-update.json`. Change native download metadata only after building and verifying the corresponding APK or installer. Keep old release folders intact; publish newly built binaries under new version paths before linking them for download.
