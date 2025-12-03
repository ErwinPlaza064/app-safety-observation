<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Acceso Prohibido</title>
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
        .font-sans { font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif; }
        .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .min-h-screen { min-height: 100vh; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mr-2 { margin-right: 0.5rem; }
        .h-5 { height: 1.25rem; }
        .h-12 { height: 3rem; }
        .h-32 { height: 8rem; }
        .w-5 { width: 1.25rem; }
        .w-32 { width: 8rem; }
        .w-full { width: 100%; }
        .max-w-lg { max-width: 32rem; }
        .gap-4 { gap: 1rem; }
        .rounded-md { border-radius: 0.375rem; }
        .border { border-width: 1px; }
        .border-transparent { border-color: transparent; }
        .border-gray-300 { border-color: #d1d5db; }
        .bg-white { background-color: #ffffff; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .text-center { text-align: center; }
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
