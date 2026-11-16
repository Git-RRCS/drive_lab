// DriveDash offline support: network first (so updates show up), cache fallback (so it opens with no signal).
const CACHE = 'bandersnatch-v5';
const CORE = ['drive.html', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'summon.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    try {
      const res = await fetch(e.request);
      if (res && (res.ok || res.type === 'opaque')) { const c = await caches.open(CACHE); c.put(e.request, res.clone()); }
      return res;
    } catch (err) {
      const hit = await caches.match(e.request, { ignoreSearch: true });
      if (hit) return hit;
      throw err;
    }
  })());
});
