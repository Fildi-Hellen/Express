<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['full_name', 'location_address', 'payment_method','total_price','contact'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
