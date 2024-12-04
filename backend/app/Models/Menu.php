<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'location',
        'size',
        'expirationDate',
        'cookTime',
        'availability',
        'category',
        'establishmentName',
        'image',
        'status', // For admin approval status
    ];

    protected $casts = [
        'additional_attributes' => 'array',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
