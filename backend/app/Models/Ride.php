<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ride extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_type',
        'pickup_location',
        'destination',
        'fare',
        'currency',
        'passengers',
        'status',
        'user_id',
        'driver_id',
        'proposed_price',
        'price_offer_message',
        'started_at',
        'completed_at',
        'eta',
        'cancellation_reason'
    ];


    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
