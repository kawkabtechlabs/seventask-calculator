const CACHE = "seventask-calculator-shell-v27";
const CORE = [
  "./",
  "./index.html",
  "./calculator",
  "./calculator.html",
  "./manifest.webmanifest",
  "./favicon.svg?v=calculator-1",
  "./icon.svg?v=seven-task-outline-1",
  "./install.html",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
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
          return caches.match(isCalculatorRoute ? "./calculator.html" : "./index.html");
        });
    })
  );
});
