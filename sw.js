const CACHE_NAME = 'word-game-v3';  // 버전 변경하면 자동으로 캐시 갱신
const urlsToCache = [
  './',
  './index.html',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(()=>{});
    })
  );
  self.skipWaiting();  // 즉시 활성화
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(name => name !== CACHE_NAME)
             .map(name => caches.delete(name))
      );
    }).then(()=>self.clients.claim())
  );
});

// 네트워크 우선, 실패 시 캐시 (업데이트 잘 받게)
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      if(response && response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
