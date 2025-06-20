<?php

namespace App\Events;

use App\Models\Ride;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RideCancelled
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $ride;

    public function __construct(Ride $ride)
    {
        $this->ride = $ride;
    }

    public function broadcastOn()
    {
        return new Channel('drivers.' . $this->ride->driver_id); // each driver has their own channel
    }

    public function broadcastAs()
    {
        return 'ride-cancelled';
    }

    public function broadcastWith()
    {
        return [
            'ride_id' => $this->ride->id,
            'reason' => $this->ride->cancellation_reason,
            'user_id' => $this->ride->user_id,
        ];
    }

}
