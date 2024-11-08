<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pharma extends Model
{
    use HasFactory;

    protected $table='pharmas';

    protected $fillable = ['name','photoUrl', 'pharmacy_id', 'category_id', 'price'];

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
