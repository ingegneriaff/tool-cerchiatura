const CACHE_NAME = "tool-cerchiatura-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        if (response && response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, copy);
          });
        }

        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
