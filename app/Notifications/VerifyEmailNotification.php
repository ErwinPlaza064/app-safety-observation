<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends VerifyEmail implements ShouldQueue
{
    use Queueable;

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
            ->line('')
            ->line('Por favor, verifica tu dirección de correo electrónico haciendo clic en el botón de abajo.')
            ->line('')
            ->action('Verificar Correo Electrónico', $verificationUrl)
            ->line('')
            ->line('Si no creaste esta cuenta, puedes ignorar este mensaje.')
            ->line('')
            ->salutation('Atentamente,')
            ->line('Equipo de Seguridad e Higiene - Wasion')
            ->priority(1);
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
