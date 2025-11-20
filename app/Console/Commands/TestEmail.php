<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Notifications\Messages\MailMessage;

class TestEmail extends Command
{
    protected $signature = 'mail:test {type=simple} {email=Erwin.Martinez@wasionmx.onmicrosoft.com}';
    protected $description = 'Enviar un correo de prueba (simple o verification)';

    public function handle()
    {
        $type = $this->argument('type');
        $email = $this->argument('email');

        try {
            if ($type === 'verification') {
                // Crear usuario temporal para probar
                $testUser = new User([
                    'name' => 'Usuario de Prueba',
                    'email' => $email,
                ]);
                $testUser->id = 999;

                $testUser->notify(new VerifyEmailNotification);

                $this->info("✅ Correo de verificación enviado a: {$email}");
            } else {
                Mail::raw('Este es un correo de prueba del sistema Safety Observation de Wasion.', function ($message) use ($email) {
                    $message->to($email)
                        ->subject('Prueba de Correo - Safety Observation');
                });

                $this->info("✅ Correo simple enviado a: {$email}");
            }

            return 0;
        } catch (\Exception $e) {
            $this->error("❌ Error al enviar correo: {$e->getMessage()}");
            return 1;
        }
    }
}
