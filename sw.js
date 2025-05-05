const cacheName = 'site-v1'; // Увеличивай версию при обновлениях
const assetsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Установка: кэшируем нужные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Активация: очищаем старый кэш
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== cacheName) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Запросы: сначала из интернета, если нет — из кэша
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Обновляем кэш
        const clone = response.clone();
        caches.open(cacheName).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
