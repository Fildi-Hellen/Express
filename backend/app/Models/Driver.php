<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Driver extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'is_available',
        'is_available_for_ride',
        'vehicle_type',
        'vehicle_number',
        // Will be uncommented after migration runs successfully
        // 'vehicle_model',
        // 'license_plate',
        // 'rating',
        'account_name',
        'account_number',
        'bank_name',
        'payout_method'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'is_available_for_ride'=>'boolean'
    ];
    
}

