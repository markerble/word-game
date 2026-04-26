const CACHE_NAME = 'word-game-v8';
const urlsToCache = ['./', './index.html', './manifest.webmanifest'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ns => Promise.all(ns.filter(n=>n!==CACHE_NAME).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    if(r && r.status === 200) {
      const c = r.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, c));
    }
    return r;
  }).catch(() => caches.match(e.request)));
});
