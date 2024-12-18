<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $full_name
 * @property string $location_address
 * @property string $contact
 * @property string $payment_method
 * @property float $total_price
 * @property string $tracking_id
 * @property string $status
 * @property int|null $driver_id
 */

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['full_name', 'location_address', 'payment_method','total_price','contact','tracking_id', 
        'status', 'driver_id'   ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

}
