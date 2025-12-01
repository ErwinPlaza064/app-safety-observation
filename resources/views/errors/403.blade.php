<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Acceso Prohibido</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css'])
</head>
<body class="font-sans antialiased bg-gradient-to-br from-blue-50 to-indigo-50">
    <div class="flex items-center justify-center min-h-screen px-4">
        <div class="w-full max-w-lg text-center">
            <div class="mb-6">
                <img src="{{ asset('images/wasion-logo.svg') }}" alt="Wasion" class="h-12 mx-auto mb-8">
            </div>
            <div class="mb-8">
                <svg class="w-32 h-32 mx-auto text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>

            <h1 class="mb-4 text-6xl font-bold text-gray-900">403</h1>
            <h2 class="mb-4 text-2xl font-semibold text-gray-800">Acceso Prohibido</h2>
            <p class="mb-8 text-gray-600">
                {{ $exception->getMessage() ?: 'No tienes permiso para acceder a este recurso.' }}
            </p>

            <div class="flex flex-col justify-center gap-4 sm:flex-row">
                <a href="{{ url('/') }}"
                   class="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-colors bg-[#1e3a8a] border border-transparent rounded-md hover:bg-[#152d6b]">
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Volver al inicio
                </a>
                <button onclick="window.history.back()"
                        class="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Regresar
                </button>
            </div>
        </div>
    </div>
</body>
</html>
