<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>500 - Error del Servidor</title>
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>

            <h1 class="text-6xl font-bold text-gray-900 mb-4">500</h1>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Error del Servidor</h2>
            <p class="text-gray-600 mb-8">
                Algo salió mal en nuestros servidores. Estamos trabajando para solucionarlo.
            </p>

            <div class="bg-white rounded-lg p-6 mb-8 shadow-md">
                <div class="flex items-start">
                    <svg class="h-6 w-6 text-[#1e3a8a] mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="text-left">
                        <h3 class="text-sm font-medium text-gray-900 mb-1">¿Qué puedes hacer?</h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>• Intenta recargar la página</li>
                            <li>• Vuelve a intentarlo en unos minutos</li>
                            <li>• Si el problema persiste, contacta al administrador</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="{{ url('/') }}"
                   class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1e3a8a] hover:bg-[#152d6b] transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Volver al inicio
                </a>
                <button onclick="window.location.reload()"
                        class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Recargar
                </button>
            </div>
        </div>
    </div>
</body>
</html>
