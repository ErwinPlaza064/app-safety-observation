<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Forzar HTTPS en producción
        if (config('app.env') === 'production' || request()->secure()) {
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
        }

        // Nota: El listener de verificación de email ya está registrado
        // automáticamente por Laravel cuando User implementa MustVerifyEmail
    }
}
