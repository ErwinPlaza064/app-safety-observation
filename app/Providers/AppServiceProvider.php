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

        // Forzar HTTPS cuando se accede por IP o en producción
        if (config('app.env') === 'production' || request()->secure() || str_contains(request()->host(), '10.110.100.84')) {
            URL::forceScheme('https');
            URL::forceRootUrl('https://10.110.100.84');
        }

        // Nota: El listener de verificación de email ya está registrado
        // automáticamente por Laravel cuando User implementa MustVerifyEmail
    }
}
