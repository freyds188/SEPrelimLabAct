<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | Intervention Image supports "GD Library" and "Imagick" to process images
    | internally. You may choose one of them according to your PHP
    | configuration. By default PHP's "GD Library" implementation is used.
    |
    | Supported: "gd", "imagick"
    |
    */

    'driver' => env('IMAGE_DRIVER', 'gd'),

    /*
    |--------------------------------------------------------------------------
    | Image Cache
    |--------------------------------------------------------------------------
    |
    | Cache settings for image optimization
    |
    */

    'cache' => [
        'enabled' => env('IMAGE_CACHE_ENABLED', true),
        'lifetime' => env('IMAGE_CACHE_LIFETIME', 43200), // 12 hours
        'prefix' => env('IMAGE_CACHE_PREFIX', 'img_cache_'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Image Optimization Settings
    |--------------------------------------------------------------------------
    |
    | Default settings for image optimization
    |
    */

    'optimization' => [
        'quality' => [
            'thumb' => 80,
            'card' => 85,
            'full' => 90,
        ],
        'sizes' => [
            'thumb' => ['width' => 150, 'height' => 150],
            'card' => ['width' => 400, 'height' => 300],
            'full' => ['width' => 1200, 'height' => 800],
        ],
        'formats' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'max_file_size' => 10485760, // 10MB
    ],

];



