<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeaverController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoryController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\GlossaryTermController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});

// Public API endpoints (v1)
Route::prefix('v1')->group(function () {
    // Public routes (no authentication required)
    Route::get('/status', function () {
        return response()->json([
            'message' => 'API is running',
            'version' => '1.0.0'
        ]);
    });

    // Weaver routes
    Route::get('/weavers', [WeaverController::class, 'index']);
    Route::get('/weavers/featured', [WeaverController::class, 'featured']);
    Route::get('/weavers/{weaver}', [WeaverController::class, 'show']);

    // Product routes
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/category/{category}', [ProductController::class, 'byCategory']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // Story routes
    Route::get('/stories', [StoryController::class, 'index']);
    Route::get('/stories/featured', [StoryController::class, 'featured']);
    Route::get('/stories/{story}', [StoryController::class, 'show']);

    // Campaign routes
    Route::get('/campaigns', [CampaignController::class, 'index']);
    Route::get('/campaigns/featured', [CampaignController::class, 'featured']);
    Route::get('/campaigns/{campaign}', [CampaignController::class, 'show']);

    // Glossary routes
    Route::get('/glossary', [GlossaryTermController::class, 'index']);
    Route::get('/glossary/featured', [GlossaryTermController::class, 'featured']);
    Route::get('/glossary/search', [GlossaryTermController::class, 'search']);
    Route::get('/glossary/{glossaryTerm}', [GlossaryTermController::class, 'show']);

    // Protected routes (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        // Weaver management (authenticated users)
        Route::post('/weavers', [WeaverController::class, 'store']);
        Route::put('/weavers/{weaver}', [WeaverController::class, 'update']);
        Route::delete('/weavers/{weaver}', [WeaverController::class, 'destroy']);

        // Product management (authenticated users)
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        // Story management (authenticated users)
        Route::post('/stories', [StoryController::class, 'store']);
        Route::put('/stories/{story}', [StoryController::class, 'update']);
        Route::delete('/stories/{story}', [StoryController::class, 'destroy']);

        // Campaign management (authenticated users)
        Route::post('/campaigns', [CampaignController::class, 'store']);
        Route::put('/campaigns/{campaign}', [CampaignController::class, 'update']);
        Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy']);

        // Glossary management (authenticated users)
        Route::post('/glossary', [GlossaryTermController::class, 'store']);
        Route::put('/glossary/{glossaryTerm}', [GlossaryTermController::class, 'update']);
        Route::delete('/glossary/{glossaryTerm}', [GlossaryTermController::class, 'destroy']);
    });
});





