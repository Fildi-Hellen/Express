<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'establishment_type',
        'name',
        'description',
        'price',
        'image',
        'category',
        'additional_attributes',
        'is_approved',
    ];

    protected $casts = [
        'additional_attributes' => 'array',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
