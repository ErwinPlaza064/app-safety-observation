<?php

namespace App\Notifications;

use App\Models\Observation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ObservationReviewedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Observation $observation;
    protected User $reviewer;

    /**
     * Create a new notification instance.
     */
    public function __construct(Observation $observation, User $reviewer)
    {
        $this->observation = $observation;
        $this->reviewer = $reviewer;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $observationType = match($this->observation->observation_type) {
            'acto_inseguro' => 'Acto Inseguro',
            'condicion_insegura' => 'Condición Insegura',
            'acto_seguro' => 'Acto Seguro',
            default => $this->observation->observation_type,
        };

        $dashboardUrl = url('/dashboard');

        return (new MailMessage)
            ->subject('Tu reporte está listo para cerrar - ' . $this->observation->folio)
            ->greeting('¡Hola, ' . $notifiable->name . '!')
            ->line('Tu reporte de seguridad ha sido **revisado por el equipo de EHS** y está listo para que lo marques como cerrado.')
            ->line('')
            ->line('**Detalles del reporte:**')
            ->line('• **Folio:** ' . $this->observation->folio)
            ->line('• **Tipo:** ' . $observationType)
            ->line('• **Ubicación:** ' . ($this->observation->area->name ?? 'N/A'))
            ->line('• **Fecha de creación:** ' . $this->observation->created_at->format('d/m/Y H:i'))
            ->line('• **Revisado por:** ' . $this->reviewer->name)
            ->line('• **Fecha de revisión:** ' . now()->format('d/m/Y H:i'))
            ->line('')
            ->action('Ir al Dashboard para Cerrar', $dashboardUrl)
            ->line('')
            ->line('Por favor, ingresa a tu dashboard y marca el reporte como cerrado cuando hayas verificado que la situación fue atendida.')
            ->salutation('Atentamente,')
            ->line('Equipo de Seguridad e Higiene - Wasion');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'observation_id' => $this->observation->id,
            'folio' => $this->observation->folio,
            'reviewer_id' => $this->reviewer->id,
            'reviewer_name' => $this->reviewer->name,
        ];
    }
}
