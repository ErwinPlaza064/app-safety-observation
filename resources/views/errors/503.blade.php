<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>503 - Servicio no Disponible</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css'])
</head>
<body class="font-sans antialiased bg-gradient-to-br from-blue-50 to-indigo-50">
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="max-w-lg w-full text-center">
            <div class="mb-6">
                <img src="{{ asset('images/wasion-logo.svg') }}" alt="Wasion" class="h-12 mx-auto mb-8">
            </div>
            <div class="mb-8">
                <svg class="mx-auto h-32 w-32 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>

            <h1 class="text-6xl font-bold text-gray-900 mb-4">503</h1>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Servicio en Mantenimiento</h2>
            <p class="text-gray-600 mb-8">
                Estamos realizando tareas de mantenimiento. Volveremos pronto.
            </p>

            <div class="bg-white rounded-lg p-6 mb-8 shadow-md">
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a] mr-3"></div>
                    <p class="text-gray-700 font-medium">Trabajando en mejorar tu experiencia...</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="window.location.reload()"
                        class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1e3a8a] hover:bg-[#152d6b] transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reintentar
                </button>
            </div>

            <p class="mt-8 text-sm text-gray-500">
                Si necesitas asistencia urgente, contacta al administrador del sistema.
            </p>
        </div>
    </div>
</body>
</html>
