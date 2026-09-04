const CACHE_NAME = 'open-search-v1';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.webmanifest',
    './open-search-192px.png',
    './open-search-512px.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_SHELL).catch((error) => {
                console.warn('Cache addAll failed:', error);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        }

                        return networkResponse;
                    })
                    .catch(() => {
                        // Return cached index.html as fallback
                        return caches.match('./index.html')
                            .catch(() => new Response('Offline - No cache', {
                                status: 503,
                                statusText: 'Service Unavailable'
                            }));
                    });
            })
            .catch(() => {
                // Handle cache.match errors
                return fetch(event.request)
                    .catch(() => new Response('Offline', { status: 503 }));
            })
    );
});
        })
    );
});
