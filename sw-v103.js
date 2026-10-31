const CACHE = "seventask-calculator-shell-v103";
const CORE = [
  "./",
  "./calculator",
  "./install",
  "./privacy-policy.html",
  "./pwa-install.js",
  "./promo/",
  "./promo/embed-guide",
  "./promo/product-presentation.html",
  "./promo/product-presentation",
  "./promo/product-tour",
  "./promo/product-tour.html",
  "./manifest.webmanifest",
  "./favicon.svg?v=calculator-2",
  "./icon.svg?v=1.18.07",
  "./icon-192.png?v=1.18.07-clean-2",
  "./icon-512.png?v=1.18.07-clean-2",
  "./apple-touch-icon.png?v=1.18.07-clean-2",
  "./assets/fonts/fjalla-one-latin.woff2",
  "./assets/kawkab-tech-labs-logo.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE)
              .then(cache => cache.put(event.request, copy))
              .catch(() => {});
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(event.request);
          if (cachedPage) return cachedPage;
          const isCalculatorRoute = /\/calculator(?:\.html)?\/?$/.test(url.pathname);
          return caches.match(isCalculatorRoute ? "./calculator" : "./");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE)
              .then(cache => cache.put(event.request, copy))
              .catch(() => {});
          }
          return response;
        })
        .catch(() => Response.error());
    })
  );
});
