<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{
    use HasFactory;

    protected $table = 'pharmacies';
    protected $fillable = ['name'];

    public function pharmas()
    {
        return $this->hasMany(Pharma::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'restaurant_category', 'pharmacy_id', 'category_id')->withTimestamps();
    }
}
