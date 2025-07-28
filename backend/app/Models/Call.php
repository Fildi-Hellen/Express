<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Call extends Model
{
    use HasFactory;

    protected $fillable = [
        'caller_id',
        'recipient_id',
        'caller_type',
        'status',
        'started_at',
        'answered_at',
        'ended_at'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'answered_at' => 'datetime',
        'ended_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the caller of the call
     */
    public function caller()
    {
        if ($this->caller_type === 'driver') {
            return $this->belongsTo(Driver::class, 'caller_id');
        }
        return $this->belongsTo(User::class, 'caller_id');
    }

    /**
     * Get the recipient of the call
     */
    public function recipient()
    {
        // Determine recipient type based on caller type
        if ($this->caller_type === 'driver') {
            return $this->belongsTo(User::class, 'recipient_id');
        }
        return $this->belongsTo(Driver::class, 'recipient_id');
    }

    /**
     * Calculate call duration in seconds
     */
    public function getDurationAttribute()
    {
        if ($this->answered_at && $this->ended_at) {
            return $this->ended_at->diffInSeconds($this->answered_at);
        }
        return 0;
    }

    /**
     * Scope for active calls
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['ringing', 'connected']);
    }

    /**
     * Scope for completed calls
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'ended');
    }

    /**
     * Check if call is active
     */
    public function isActive()
    {
        return in_array($this->status, ['ringing', 'connected']);
    }

    /**
     * Check if call was answered
     */
    public function wasAnswered()
    {
        return !is_null($this->answered_at);
    }
}
