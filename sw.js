const CACHE = "seventask-calculator-shell-v61";
const CORE = [
  "./",
  "./calculator",
  "./install",
  "./promo/",
  "./promo/embed-guide",
  "./promo/product-presentation.html",
  "./manifest.webmanifest",
  "./favicon.svg?v=calculator-2",
  "./icon.svg?v=1.0.10-transparent",
  "./icon-192.png?v=1.0.10-transparent",
  "./icon-512.png?v=1.0.10-transparent",
  "./apple-touch-icon.png?v=1.0.10-transparent",
  "./assets/fonts/fjalla-one-latin.woff2"
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

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          const isCalculatorRoute = /\/calculator(?:\.html)?\/?$/.test(url.pathname);
          return caches.match(isCalculatorRoute ? "./calculator" : "./");
        });
    })
  );
});
