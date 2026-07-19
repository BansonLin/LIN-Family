const C = "lin-family-1784491686441";
const ASSETS = ['./', './index.html', './time.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => {
    const fresh = fetch(e.request).then(r => { if (r && r.ok && new URL(e.request.url).origin === location.origin) { const cl = r.clone(); caches.open(C).then(x => x.put(e.request, cl)); } return r; }).catch(() => cached);
    return cached || fresh;
  }));
});