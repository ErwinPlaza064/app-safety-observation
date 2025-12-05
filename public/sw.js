const CACHE_VERSION = "v7";
const STATIC_CACHE = `wasion-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `wasion-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `wasion-offline-${CACHE_VERSION}`;

const SYNC_QUEUE = "offline-observations";

const PRECACHE_ASSETS = [
    "/offline.html",
    "/manifest.json",
    "/images/icons/icon-72x72.png",
    "/images/icons/icon-96x96.png",
    "/images/icons/icon-128x128.png",
    "/images/icons/icon-144x144.png",
    "/images/icons/icon-152x152.png",
    "/images/icons/icon-192x192.png",
    "/images/icons/icon-384x384.png",
    "/images/icons/icon-512x512.png",
    "/images/wasion-logo.svg",
];

const EXCLUDED_PATHS = [
    "/sanctum",
    "/csrf",
    "/_ignition",
    "/livewire",
    "/broadcasting",
    "/hot",
    "/@vite",
    "/__vite",
];

const AUTH_PATHS = [
    "/login",
    "/logout",
    "/register",
    "/password",
    "/email",
    "/verify-email",
];

const OFFLINE_CAPABLE_PATHS = ["/dashboard", "/observations", "/profile"];

function shouldExclude(pathname) {
    return EXCLUDED_PATHS.some((path) => pathname.startsWith(path));
}

function isAuthPath(pathname) {
    return AUTH_PATHS.some((path) => pathname.startsWith(path));
}

function isStaticAsset(pathname) {
    return (
        pathname.startsWith("/build/") ||
        pathname.startsWith("/images/") ||
        pathname.startsWith("/fonts/") ||
        pathname.startsWith("/css/") ||
        pathname.startsWith("/js/") ||
        pathname.endsWith(".css") ||
        pathname.endsWith(".js") ||
        pathname.endsWith(".png") ||
        pathname.endsWith(".jpg") ||
        pathname.endsWith(".jpeg") ||
        pathname.endsWith(".gif") ||
        pathname.endsWith(".svg") ||
        pathname.endsWith(".woff") ||
        pathname.endsWith(".woff2") ||
        pathname.endsWith(".ttf") ||
        pathname.endsWith(".ico")
    );
}

function isApiRequest(pathname) {
    return pathname.startsWith("/api/") || pathname.startsWith("/observations");
}

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => {
                return Promise.allSettled(
                    PRECACHE_ASSETS.map(async (url) => {
                        try {
                            const response = await fetch(url);
                            if (response.ok) {
                                await cache.put(url, response);
                                console.log(`[SW] ✅ Cacheado: ${url}`);
                            }
                        } catch (err) {
                            console.warn(`[SW] ⚠️ No se pudo cachear: ${url}`);
                        }
                    })
                );
            })
            .then(() => {
                console.log("[SW] ✅ Instalación completada");
                return self.skipWaiting();
            })
    );
});

self.addEventListener("activate", (event) => {
    console.log("[SW] 🚀 Activando Service Worker v4...");

    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => {
                            return (
                                name.startsWith("wasion-") &&
                                !name.endsWith(CACHE_VERSION)
                            );
                        })
                        .map((name) => {
                            console.log(
                                `[SW] 🗑️ Eliminando caché antiguo: ${name}`
                            );
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log("[SW] ✅ Activación completada");
                return self.clients.claim();
            })
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (shouldExclude(url.pathname)) {
        return;
    }

    if (request.method !== "GET") {
        if (
            request.method === "POST" &&
            url.pathname.includes("/observations")
        ) {
            event.respondWith(handleOfflinePost(request));
        }
        return;
    }

    if (isAuthPath(url.pathname)) {
        event.respondWith(networkOnlyWithOfflineFallback(request));
        return;
    }

    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(networkFirstWithOfflineFallback(request));
        return;
    }

    if (isApiRequest(url.pathname)) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    event.respondWith(networkFirstStrategy(request));
});

async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        updateCacheInBackground(request);
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const url = new URL(request.url);
        if (url.pathname.endsWith(".ico")) {
            return new Response("", { status: 204 });
        }
        return new Response("Asset no disponible offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
        });
    }
}

async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return new Response(
            JSON.stringify({
                error: "Sin conexión",
                offline: true,
            }),
            {
                status: 503,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

async function networkFirstWithOfflineFallback(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Cachear páginas navegables para uso offline
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return caches.match("/offline.html");
    }
}

async function networkOnlyWithOfflineFallback(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        return caches.match("/offline.html");
    }
}

function updateCacheInBackground(request) {
    return;
}

async function handleOfflinePost(request) {
    try {
        // Intentar enviar normalmente
        const response = await fetch(request.clone());
        return response;
    } catch (error) {
        console.log("[SW] 📴 Guardando observación para sync posterior...");

        try {
            const requestData = await request.clone().text();

            await saveToOfflineQueue({
                url: request.url,
                method: request.method,
                headers: Object.fromEntries(request.headers.entries()),
                body: requestData,
                timestamp: Date.now(),
            });

            if ("sync" in self.registration) {
                await self.registration.sync.register(SYNC_QUEUE);
                console.log("[SW] 📝 Background sync registrado");
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    offline: true,
                    message:
                        "Observación guardada. Se enviará cuando vuelvas a tener conexión.",
                }),
                {
                    status: 202,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } catch (saveError) {
            console.error("[SW] Error guardando offline:", saveError);
            return new Response(
                JSON.stringify({
                    error: "No se pudo guardar la observación offline",
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    }
}

const DB_NAME = "wasion-offline-db";
const DB_VERSION = 1;
const STORE_NAME = "offline-queue";

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true,
                });
            }
        };
    });
}

async function saveToOfflineQueue(data) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getOfflineQueue() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function removeFromOfflineQueue(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

self.addEventListener("sync", (event) => {
    console.log("[SW] 🔄 Background Sync activado:", event.tag);

    if (event.tag === SYNC_QUEUE) {
        event.waitUntil(syncOfflineObservations());
    }
});

async function syncOfflineObservations() {
    console.log("[SW] 📤 Sincronizando observaciones offline...");

    try {
        const queue = await getOfflineQueue();

        if (queue.length === 0) {
            console.log("[SW] ✅ No hay observaciones pendientes");
            return;
        }

        console.log(`[SW] 📋 ${queue.length} observaciones para sincronizar`);

        for (const item of queue) {
            try {
                const response = await fetch(item.url, {
                    method: item.method,
                    headers: item.headers,
                    body: item.body,
                });

                if (response.ok) {
                    await removeFromOfflineQueue(item.id);
                    console.log(`[SW] ✅ Sincronizado: ${item.id}`);

                    // Notificar al usuario
                    await notifyUser(
                        "Observación sincronizada",
                        "Tu observación guardada offline ha sido enviada correctamente."
                    );
                } else {
                    console.error(
                        `[SW] ❌ Error sincronizando ${item.id}:`,
                        response.status
                    );
                }
            } catch (error) {
                console.error(`[SW] ❌ Error sincronizando ${item.id}:`, error);
            }
        }
    } catch (error) {
        console.error("[SW] Error en syncOfflineObservations:", error);
    }
}

async function notifyUser(title, body) {
    if (self.registration.showNotification) {
        await self.registration.showNotification(title, {
            body: body,
            icon: "/images/icons/icon-192x192.png",
            badge: "/images/icons/icon-72x72.png",
            vibrate: [200, 100, 200],
            tag: "sync-notification",
        });
    }
}

self.addEventListener("message", (event) => {
    const { type, payload } = event.data || {};

    switch (type) {
        case "SKIP_WAITING":
            self.skipWaiting();
            break;

        case "GET_OFFLINE_COUNT":
            getOfflineQueue().then((queue) => {
                event.ports[0].postMessage({ count: queue.length });
            });
            break;

        case "FORCE_SYNC":
            syncOfflineObservations().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;

        case "CLEAR_CACHE":
            caches
                .keys()
                .then((names) => {
                    Promise.all(names.map((name) => caches.delete(name)));
                })
                .then(() => {
                    event.ports[0].postMessage({ success: true });
                });
            break;
    }
});

self.addEventListener("periodicsync", (event) => {
    if (event.tag === "sync-observations") {
        event.waitUntil(syncOfflineObservations());
    }
});

console.log(
    "[SW] 🚀 Service Worker v6 cargado - Modo Offline Real + Background Sync"
);
