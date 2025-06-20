<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'amount',
        'status', // e.g., pending, completed, failed
        'reference',
        'payment_method',
        'description',
    ];

    /**
     * Get the driver that owns the payout.
     */
    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}
