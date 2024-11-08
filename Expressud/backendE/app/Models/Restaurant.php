<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;

    protected $table = 'restaurants';
    protected $fillable = ['name'];

    public function foods()
    {
        return $this->hasMany(Food::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'restaurant_category', 'restaurant_id', 'category_id')->withTimestamps();
    }
}
