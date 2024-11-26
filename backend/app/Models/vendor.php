<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
class vendor extends Model
{
    use HasFactory, HasApiTokens;

    
    protected $fillable = [
        'establishment_name',
        'establishment_type',
        'first_name',
        'last_name',
        'phone',
        'email',
        'password',
        'number_of_stores',
        'location',
        'promocode',
        'accept_updates',
        'accept_privacy_policy',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function menus()
    {
        return $this->hasMany(Menu::class);
    }
}
