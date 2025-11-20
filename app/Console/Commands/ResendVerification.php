<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ResendVerification extends Command
{
    protected $signature = 'user:resend-verification {email}';
    protected $description = 'Reenviar correo de verificación';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error('Usuario no encontrado');
            return 1;
        }

        if ($user->hasVerifiedEmail()) {
            $this->warn('Este usuario ya tiene su email verificado');
            return 0;
        }

        $user->sendEmailVerificationNotification();
        $this->info("Correo de verificación enviado a: {$email}");

        return 0;
    }
}
