<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends VerifyEmail
{
    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verificar Dirección de Correo Electrónico')
            ->greeting('Hola, ' . $notifiable->name)
            ->line('Gracias por registrarte en el Sistema de Observaciones de Seguridad de Wasion.')
            ->line('Por favor, verifica tu dirección de correo electrónico haciendo clic en el botón de abajo.')
            ->action('Verificar Correo Electrónico', $verificationUrl)
            ->line('Si no creaste esta cuenta, puedes ignorar este mensaje.')
            ->salutation('Atentamente, Equipo de Seguridad e Higiene - Wasion');
    }

    /**
     * Get the verification URL for the given notifiable.
     */
    protected function verificationUrl($notifiable): string
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}
