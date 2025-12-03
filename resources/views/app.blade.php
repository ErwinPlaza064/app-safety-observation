<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- PWA Meta Tags -->
        <meta name="theme-color" content="#1e3a8a">
        <meta name="description" content="Sistema de gestión de observaciones de seguridad industrial - WASION">
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

        <!-- Service Worker Registration -->
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then((registration) => {
                            console.log('✅ Service Worker registrado:', registration.scope);

                            // Verificar actualizaciones
                            registration.addEventListener('updatefound', () => {
                                const newWorker = registration.installing;
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        // Nueva versión disponible
                                        console.log('🔄 Nueva versión disponible');
                                    }
                                });
                            });
                        })
                        .catch((error) => {
                            console.error('❌ Error al registrar Service Worker:', error);
                        });
                });
            }
        </script>
    </body>
</html>
