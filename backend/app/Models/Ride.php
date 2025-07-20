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
        'fare' => 'decimal:0', // Changed to 0 decimal places for whole numbers
        'proposed_price' => 'decimal:0', // Changed to 0 decimal places for whole numbers
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

    /**
     * Mutator to automatically round fare to whole number
     */
    public function setFareAttribute($value)
    {
        $this->attributes['fare'] = round($value);
    }

    /**
     * Mutator to automatically round proposed price to whole number
     */
    public function setProposedPriceAttribute($value)
    {
        $this->attributes['proposed_price'] = round($value);
    }

    /**
     * Calculate fare based on distance and ride type
     */
    public static function calculateFare($distance, $rideType = 'standard')
    {
        $baseFare = 1000; // Base fare in RWF
        $perKmRate = 200; // Rate per kilometer
        
        // Adjust rates based on ride type
        switch (strtolower($rideType)) {
            case 'premium':
                $baseFare = 1500;
                $perKmRate = 300;
                break;
            case 'economy':
                $baseFare = 800;
                $perKmRate = 150;
                break;
            case 'shared':
                $baseFare = 600;
                $perKmRate = 100;
                break;
            default:
                // standard rates already set
                break;
        }
        
        $calculatedFare = $baseFare + ($distance * $perKmRate);
        return round($calculatedFare); // Always return whole number
    }
}
