<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class DriverAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    /**
     * Create a new notification instance.
     *
     * @param $order
     */
    public function __construct($order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database']; // Notification channels (e.g., email and database)
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->greeting('Hello, ' . $notifiable->name . '!')
            ->line('You have been assigned a new order.')
            ->line('Order ID: ' . $this->order->id)
            ->line('Customer: ' . $this->order->full_name)
            ->line('Delivery Address: ' . $this->order->location_address)
            ->action('View Order', url('/orders/' . $this->order->id))
            ->line('Thank you for your service!');
    }

    /**
     * Get the database representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'message' => 'You have been assigned a new order.',
            'customer_name' => $this->order->full_name,
            'delivery_address' => $this->order->location_address,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'message' => "You have been assigned to order #{$this->order->id}.",
        ];
    }
}
