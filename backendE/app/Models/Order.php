<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $table='orders';
    
    protected $fillable = [
        'user_id', 'total_amount', 'delivery_address', 'phone_number', 'payment_method', 'status'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
