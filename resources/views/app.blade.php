<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Safety Obs') }}</title>

    <!-- Open Graph / Meta Compartir -->
    <meta property="og:title" content="{{ $page['props']['meta']['title'] ?? config('app.name', 'Safety Obs') }}">
    <meta property="og:description"
        content="{{ $page['props']['meta']['description'] ?? 'Sistema de gestión de observaciones de seguridad industrial - WASION' }}">
    <meta property="og:image" content="{{ $page['props']['meta']['image'] ?? url('/images/icons/icon-512x512.png') }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta name="twitter:card" content="summary_large_image">

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#1e3a8a">
    <meta name="description"
        content="{{ $page['props']['meta']['description'] ?? 'Sistema de gestión de observaciones de seguridad industrial - WASION' }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Safety Obs">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="Safety Obs">
    <meta name="msapplication-TileColor" content="#1e3a8a">
    <meta name="msapplication-tap-highlight" content="no">

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">

    <!-- PWA Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/icon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/icon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/icon-192x192.png">
    <link rel="mask-icon" href="/images/wasion-logo.svg" color="#1e3a8a">

    <!-- Preconnect para fuentes (mejora FCP) -->
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.bunny.net">

    <!-- Fonts con display=swap para evitar FOIT -->
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

    <!-- PWA Helper -->
    <script src="/js/pwa-helper.js"></script>

    <!-- Service Worker Registration -->
    <script>
        // Solo registrar SW en producción o localhost (evita errores con certificados auto-firmados)
        const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const isProduction = !isLocalhost; // Cualquier host que no sea localhost se considera producción
        const shouldRegisterSW = true;

        if (shouldRegisterSW) {
            window.addEventListener('load', async () => {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('✅ Service Worker v4 registrado:', registration.scope);

                    // Verificar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 Descargando nueva versión del Service Worker...');

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // Nueva versión disponible
                                    console.log(
                                        '🆕 Nueva versión disponible - Recarga para actualizar'
                                    );

                                    // Mostrar notificación al usuario (opcional)
                                    if (window.showUpdateNotification) {
                                        window.showUpdateNotification();
                                    }
                                } else {
                                    console.log('✅ Service Worker instalado por primera vez');
                                }
                            }
                        });
                    });

                    // Escuchar mensajes del Service Worker
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        console.log('📨 Mensaje del SW:', event.data);

                        if (event.data.type === 'SYNC_COMPLETE') {
                            console.log('✅ Sincronización completada');
                            // Recargar datos si es necesario
                            if (window.refreshData) {
                                window.refreshData();
                            }
                        }
                    });

                    // Verificar si hay observaciones pendientes
                    if (window.PWAHelper) {
                        const pending = await PWAHelper.getPendingCount();
                        if (pending > 0) {
                            console.log(`📋 ${pending} observación(es) pendiente(s) de sincronizar`);
                        }
                    }

                } catch (error) {
                    console.error('❌ Error al registrar Service Worker:', error);
                }
            });

            // Detectar cambios de conexión
            window.addEventListener('online', () => {
                console.log('🌐 Conexión restaurada');
                // Intentar sincronizar observaciones pendientes
                if (window.PWAHelper) {
                    PWAHelper.forceSync();
                }
            });

            window.addEventListener('offline', () => {
                console.log('📴 Sin conexión - Modo offline activado');
            });
        }
    </script>
</body>

</html>
