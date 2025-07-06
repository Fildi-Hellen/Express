<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

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

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'fare' => 'decimal:2',
        'proposed_price' => 'decimal:2',
        'passengers' => 'integer'
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
