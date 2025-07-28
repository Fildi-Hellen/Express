<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// Add this route temporarily for debugging
Route::get('/debug/storage', function() {
    $publicPath = public_path('storage/profile_pictures');
    $storagePath = storage_path('app/public/profile_pictures');
    
    return response()->json([
        'public_path_exists' => is_dir($publicPath),
        'storage_path_exists' => is_dir($storagePath),
        'public_files' => is_dir($publicPath) ? scandir($publicPath) : [],
        'storage_files' => is_dir($storagePath) ? scandir($storagePath) : [],
        'symlink_exists' => is_link(public_path('storage')),
        'symlink_target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : null,
        'app_url' => config('app.url'),
        'asset_url' => asset('storage/profile_pictures/test.png'),
        'url_helper' => url('storage/profile_pictures/test.png'),
    ]);
});
