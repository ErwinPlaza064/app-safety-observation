// WASION Safety Observer - Service Worker
const CACHE_NAME = "wasion-safety-v3";
const OFFLINE_URL = "/offline.html";

// Archivos para cachear en la instalación (solo archivos que EXISTEN localmente)
const PRECACHE_ASSETS = [
    "/offline.html",
    "/images/icons/icon-192x192.png",
    "/images/icons/icon-512x512.png",
    "/manifest.json",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
    console.log("[SW] Instalando Service Worker...");

    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("[SW] Cacheando archivos iniciales");
                // Usar addAll con manejo de errores individual
                return Promise.all(
                    PRECACHE_ASSETS.map((url) =>
                        cache.add(url).catch((err) => {
                            console.warn("[SW] No se pudo cachear:", url, err);
                        })
                    )
                );
            })
            .then(() => {
                console.log("[SW] Instalación completada");
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error("[SW] Error en instalación:", error);
            })
    );
});

// Activación - Limpia cachés antiguos
self.addEventListener("activate", (event) => {
    console.log("[SW] Activando Service Worker...");

    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log("[SW] Eliminando caché antiguo:", name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                // Tomar control de todas las páginas inmediatamente
                return self.clients.claim();
            })
    );
});

// Estrategia de caché: Network First con fallback a caché
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requests que no sean GET
    if (request.method !== "GET") {
        return;
    }

    // Ignorar requests externos (CDNs, APIs externas, etc.)
    if (url.origin !== location.origin) {
        return;
    }

    // Ignorar hot module replacement de Vite en desarrollo
    if (url.pathname.includes("hot") || url.pathname.includes("@vite")) {
        return;
    }

    // IMPORTANTE: No interceptar rutas de autenticación y API
    const excludedPaths = [
        "/login",
        "/logout",
        "/register",
        "/password",
        "/email",
        "/sanctum",
        "/api",
        "/csrf",
        "/_ignition",
        "/livewire",
    ];

    if (excludedPaths.some((path) => url.pathname.startsWith(path))) {
        return;
    }

    // Solo cachear assets estáticos (imágenes, CSS, JS compilado)
    const isStaticAsset =
        url.pathname.startsWith("/build/") ||
        url.pathname.startsWith("/images/") ||
        url.pathname.startsWith("/fonts/") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith(".png") ||
        url.pathname.endsWith(".jpg") ||
        url.pathname.endsWith(".svg") ||
        url.pathname.endsWith(".woff2");

    // Para assets estáticos - Cache First con actualización en background
    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Para navegación - Solo mostrar offline page si no hay red
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
        return;
    }

    // Para todo lo demás - No interceptar, dejar pasar directamente
});

// Escuchar mensajes desde la app
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
