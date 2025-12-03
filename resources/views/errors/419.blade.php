<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>419 - Sesión Expirada</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <style>
        *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; }
        html { line-height: 1.5; -webkit-text-size-adjust: 100%; font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif; }
        body { margin: 0; line-height: inherit; }
        h1, h2, h3, p { margin: 0; }
        a { color: inherit; text-decoration: inherit; }
        button { font-family: inherit; font-size: 100%; font-weight: inherit; line-height: inherit; color: inherit; margin: 0; padding: 0; background-color: transparent; cursor: pointer; }
        img, svg { display: block; vertical-align: middle; max-width: 100%; height: auto; }
        ul { list-style: none; margin: 0; padding: 0; }
        .font-sans { font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif; }
        .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .min-h-screen { min-height: 100vh; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-center { justify-content: center; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mr-2 { margin-right: 0.5rem; }
        .mr-3 { margin-right: 0.75rem; }
        .mt-0\.5 { margin-top: 0.125rem; }
        .h-6 { height: 1.5rem; }
        .h-12 { height: 3rem; }
        .h-32 { height: 8rem; }
        .w-5 { width: 1.25rem; }
        .w-6 { width: 1.5rem; }
        .w-32 { width: 8rem; }
        .w-full { width: 100%; }
        .max-w-lg { max-width: 32rem; }
        .flex-shrink-0 { flex-shrink: 0; }
        .gap-4 { gap: 1rem; }
        .rounded-md { border-radius: 0.375rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .border { border-width: 1px; }
        .border-transparent { border-color: transparent; }
        .border-gray-300 { border-color: #d1d5db; }
        .bg-white { background-color: #ffffff; }
        .p-6 { padding: 1.5rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-base { font-size: 1rem; line-height: 1.5rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-6xl { font-size: 3.75rem; line-height: 1; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .text-white { color: #ffffff; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-700 { color: #374151; }
        .text-gray-800 { color: #1f2937; }
        .text-gray-900 { color: #111827; }
        .text-primary { color: #1e3a8a; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .transition-colors { transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .bg-primary { background-color: #1e3a8a; }
        .bg-primary:hover { background-color: #152d6b; }
        .bg-white:hover { background-color: #f9fafb; }
        .inline-flex { display: inline-flex; }
        @media (min-width: 640px) {
            .sm\:flex-row { flex-direction: row; }
        }
    </style>
</head>
<body class="font-sans antialiased" style="background: linear-gradient(to bottom right, #eff6ff, #eef2ff);">
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="max-w-lg w-full text-center">
            <div class="mb-6">
                <img src="{{ asset('images/wasion-logo.svg') }}" alt="Wasion" class="h-12 mx-auto mb-8">
            </div>
            <div class="mb-8">
                <svg class="mx-auto h-32 w-32 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            <h1 class="text-6xl font-bold text-gray-900 mb-4">419</h1>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Sesión Expirada</h2>
            <p class="text-gray-600 mb-8">
                Tu sesión ha expirado por inactividad. Por favor, recarga la página e intenta nuevamente.
            </p>

            <div class="bg-white rounded-lg p-6 mb-8 shadow-md">
                <div class="flex items-start">
                    <svg class="h-6 w-6 text-[#1e3a8a] mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div class="text-left">
                        <h3 class="text-sm font-medium text-gray-900 mb-1">Medida de seguridad</h3>
                        <p class="text-sm text-gray-600">
                            Las sesiones expiran automáticamente después de cierto tiempo de inactividad para proteger tu información.
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="window.location.reload()"
                        class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1e3a8a] hover:bg-[#152d6b] transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Recargar página
                </button>
                <a href="{{ url('/') }}"
                   class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Ir al inicio
                </a>
            </div>
        </div>
    </div>
</body>
</html>
