<?php

namespace App\Events;

use App\Models\Ride;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RideRequested
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $ride;
    /**
     * Create a new event instance.
     */
    public function __construct(Ride $ride)
    {
         $this->ride = $ride;
    }

    /**
     * 
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
         return new Channel('drivers');
    }

     public function broadcastWith()
    {
        return ['ride' => $this->ride];
    }

    public function broadcastAs()
    {
        return 'new-ride-request';
    }
}
