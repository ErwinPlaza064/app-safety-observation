<?php

namespace App\Providers;

use Illuminate\Support\Facades\Mail;
use App\Mail\Transport\MicrosoftGraphTransport;
use App\Services\MicrosoftGraphMailer;
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

        // Forzar HTTPS en producción o cuando se detecta una conexión segura
        if (config('app.env') === 'production' || request()->secure()) {
            URL::forceScheme('https');
        }

        // Registrar driver de correo de Microsoft Graph
        Mail::extend('microsoft_graph', function (array $config = []) {
            return new MicrosoftGraphTransport(app(MicrosoftGraphMailer::class));
        });

        // Nota: El listener de verificación de email ya está registrado
        // automáticamente por Laravel cuando User implementa MustVerifyEmail
    }
}
