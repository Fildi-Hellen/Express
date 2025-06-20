<?php

namespace App\Notifications;

use App\Models\Ride;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RideAssignedNotification extends Notification
{
    use Queueable;

    public $ride;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ride $ride)
    {
         $this->ride = $ride;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via( $notifiable)
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
      public function toArray($notifiable)
    {
        return [
            'ride_id' => $this->ride->id,
            'message' => 'You have been assigned a ride!',
            'fare' => $this->ride->fare,
            'currency' => $this->ride->currency,
            'passengers' => $this->ride->passengers,
        ];
    }
}
