/**
 * WASION Safety Observer - PWA Helper
 * Utilidades para interactuar con el Service Worker
 */

const PWAHelper = {
    /**
     * Verificar si el navegador soporta PWA
     */
    isSupported() {
        return "serviceWorker" in navigator;
    },

    /**
     * Verificar si estamos offline
     */
    isOffline() {
        return !navigator.onLine;
    },

    /**
     * Obtener el Service Worker activo
     */
    async getServiceWorker() {
        if (!this.isSupported()) return null;
        const registration = await navigator.serviceWorker.ready;
        return registration.active;
    },

    /**
     * Enviar mensaje al Service Worker
     */
    async sendMessage(type, payload = {}) {
        const sw = await this.getServiceWorker();
        if (!sw) return null;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => resolve(event.data);
            sw.postMessage({ type, payload }, [messageChannel.port2]);

            // Timeout después de 5 segundos
            setTimeout(() => resolve(null), 5000);
        });
    },

    /**
     * Obtener cantidad de observaciones pendientes de sync
     */
    async getPendingCount() {
        const response = await this.sendMessage("GET_OFFLINE_COUNT");
        return response?.count || 0;
    },

    /**
     * Forzar sincronización de observaciones offline
     */
    async forceSync() {
        return await this.sendMessage("FORCE_SYNC");
    },

    /**
     * Limpiar todos los cachés
     */
    async clearCache() {
        return await this.sendMessage("CLEAR_CACHE");
    },

    /**
     * Actualizar el Service Worker
     */
    async update() {
        if (!this.isSupported()) return false;

        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            await registration.update();
            return true;
        }
        return false;
    },

    /**
     * Activar nuevo Service Worker inmediatamente
     */
    async skipWaiting() {
        await this.sendMessage("SKIP_WAITING");
    },

    /**
     * Verificar si hay una actualización disponible
     */
    async checkForUpdates() {
        if (!this.isSupported()) return false;

        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
            return true;
        }

        await registration?.update();
        return !!registration?.waiting;
    },

    /**
     * Suscribirse a cambios de conexión
     */
    onConnectionChange(callback) {
        window.addEventListener("online", () => callback(true));
        window.addEventListener("offline", () => callback(false));

        // Estado inicial
        callback(navigator.onLine);
    },

    /**
     * Mostrar notificación nativa (si está permitido)
     */
    async showNotification(title, options = {}) {
        if (!("Notification" in window)) return false;

        if (Notification.permission === "granted") {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, {
                icon: "/images/icons/icon-192x192.png",
                badge: "/images/icons/icon-72x72.png",
                ...options,
            });
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                return this.showNotification(title, options);
            }
        }

        return false;
    },

    /**
     * Solicitar permiso para notificaciones
     */
    async requestNotificationPermission() {
        if (!("Notification" in window)) return "unsupported";

        if (Notification.permission === "granted") return "granted";
        if (Notification.permission === "denied") return "denied";

        return await Notification.requestPermission();
    },

    /**
     * Registrar para Background Sync
     */
    async registerBackgroundSync(tag = "offline-observations") {
        if (!this.isSupported()) return false;

        const registration = await navigator.serviceWorker.ready;

        if ("sync" in registration) {
            await registration.sync.register(tag);
            return true;
        }

        return false;
    },

    /**
     * Información del estado de la PWA
     */
    async getStatus() {
        const registration = await navigator.serviceWorker.getRegistration();

        return {
            supported: this.isSupported(),
            online: navigator.onLine,
            serviceWorker: {
                installed: !!registration?.active,
                waiting: !!registration?.waiting,
                scope: registration?.scope || null,
            },
            notifications:
                "Notification" in window
                    ? Notification.permission
                    : "unsupported",
            pendingSync: await this.getPendingCount(),
        };
    },
};

// Exportar para uso global
window.PWAHelper = PWAHelper;

// También exportar como módulo si es posible
if (typeof module !== "undefined" && module.exports) {
    module.exports = PWAHelper;
}

console.log("📱 PWA Helper cargado");
