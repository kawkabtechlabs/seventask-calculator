const CACHE = "seventask-calculator-shell-1.18.22";
const CORE = ["./", "./calculator", "./calculator-core.js", "./mobile-settings.js", "./install", "./privacy-policy.html", "./manifest.webmanifest", "./icon.svg", "./assets/fonts/fjalla-one-latin.woff2"];
const SHELL_PREFIX = "seventask-calculator-shell-";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(async path => {
      const request = new Request(path, { cache: "no-store" });
      const response = await fetch(request);
      if (!response.ok) throw new Error(`Core asset unavailable: ${path} (${response.status})`);
      await cache.put(request, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(SHELL_PREFIX) && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/downloads/") || /\/(?:release|mobile-update)\.json$/.test(url.pathname)) return;
  if (request.destination === "font" || request.destination === "image") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
      return response;
    })());
    return;
  }
  event.respondWith((async () => {
    try {
      const response = await fetch(request, { cache: "no-store" });
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {}));
      }
      return response;
    } catch (error) {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === "navigate") {
        const fallback = await cache.match(/\/calculator(?:\.html)?\/?$/.test(url.pathname) ? "./calculator" : "./");
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});
