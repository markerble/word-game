const CACHE_NAME = 'word-game-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.webmanifest',
  'https://fonts.googleapis.com/css2?family=Jua&family=Black+Han+Sans&family=Fredoka:wght@400;600;700&display=swap'
];

// 설치 시 캐시 저장
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        // 일부 실패해도 진행
        console.log('일부 캐시 실패:', err);
      });
    })
  );
  self.skipWaiting();
});

// 활성화 시 이전 캐시 삭제
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(name => name !== CACHE_NAME)
             .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 네트워크 요청 가로채기 - 캐시 우선 (오프라인 작동)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if(response) return response;
      
      return fetch(event.request).then(response => {
        // 폰트 등 외부 리소스도 캐시
        if(response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // 오프라인이고 캐시도 없으면 그냥 실패
        return new Response('Offline', {status: 503});
      });
    })
  );
});
