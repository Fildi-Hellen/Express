<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $fillable = ['name', 'photoUrl'];

    public function restaurants()
    {
        return $this->belongsToMany(Restaurant::class, 'restaurant_category', 'category_id', 'restaurant_id')->withTimestamps();
    }

    public function pharmacies()
    {
        return $this->belongsToMany(Pharmacy::class, 'restaurant_category', 'category_id', 'pharmacy_id')->withTimestamps();
    }
}
