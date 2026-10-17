const CACHE="kawkab-calculator-shell-v23";
const CORE=["./","./index.html","./calculator.html","./manifest.webmanifest","./favicon.svg?v=calculator-1","./icon.svg?v=seven-task-outline-1","./plans.html","./login.html","./payment.html","./install.html","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;const u=new URL(event.request.url);if(u.origin!==location.origin)return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return r}).catch(()=>caches.match("./index.html"))))});

