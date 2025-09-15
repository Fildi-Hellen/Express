<?php

return [

    // Include any browser-hit endpoints (api/* plus auth/csrf routes)
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],

    // IMPORTANT: origin must be just scheme + host (no trailing slash, no hash)
    'allowed_origins' => [
        'https://www.expressud.com',
        'https://vendor.expressud.com',
        'https://admin.expressud.com',
        'https://driver.expressud.com',
    ],
//   'allowed_origins' =>  ['http://localhost:4200', 'http://127.0.0.1:4200'],

    // Optional: allow any subdomain of expressud.com in the future (keeps things flexible)
    'allowed_origins_patterns' => [
        '#^https://([a-z0-9-]+\.)*expressud\.com$#i',
    ],

    'allowed_headers' => ['Authorization','Content-Type','X-Requested-With','Origin','Accept'],

    'exposed_headers' => [],

    // Cache preflight for a day (0 = no caching)
    'max_age' => 86400,

    // Using cookies/sessions/Sanctum => must be true (and no '*' in allowed_origins)
    'supports_credentials' => true,
];
