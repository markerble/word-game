const CACHE_NAME = 'word-game-v6';
const urlsToCache = ['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(n=>Promise.all(n.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r&&r.status===200){const c=r.clone();caches.open(CACHE_NAME).then(ch=>ch.put(e.request,c));}
    return r;
  }).catch(()=>caches.match(e.request)));
});
