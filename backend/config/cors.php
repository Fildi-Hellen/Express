<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:4200',  // Customer App (Expressud)
        'http://localhost:4201',  // Admin Panel
        'http://localhost:4202',  // Driver App
        'http://127.0.0.1:4200',  // Alternative localhost
        'http://127.0.0.1:4201',  // Alternative localhost
        'http://127.0.0.1:4202',  // Alternative localhost
        'http://localhost:54496',
        'http://localhost:58306'
    ],

    'allowed_origins_patterns' => [
        'http://localhost:*',
        'http://127.0.0.1:*'
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
