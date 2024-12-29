<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Blog extends Model
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['title', 'content', 'author'];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}

