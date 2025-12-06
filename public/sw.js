// Service Worker for NexusForge PWA
// Provides offline capability and caching

const CACHE_NAME = 'nexusforge-v1';
const STATIC_ASSETS = [
    '/',
    '/portfolio',
    '/blog',
    '/codelab',
    '/contact',
    '/resume',
    '/products',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('NexusForge: Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and external URLs
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    // Skip API routes (always fetch from network)
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            // Network first for HTML pages
            if (request.headers.get('accept')?.includes('text/html')) {
                return fetch(request)
                    .then((response) => {
                        // Clone and cache the response
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                        return response;
                    })
                    .catch(() => cached || caches.match('/'));
            }

            // Cache first for static assets
            if (cached) {
                // Update cache in background
                fetch(request).then((response) => {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, response);
                    });
                });
                return cached;
            }

            // Fetch and cache
            return fetch(request).then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone);
                });
                return response;
            });
        })
    );
});

// Push notification support
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'New update from NexusForge',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
        },
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'close', title: 'Close' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'NexusForge', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            const url = event.notification.data?.url || '/';

            // Focus existing window or open new
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
