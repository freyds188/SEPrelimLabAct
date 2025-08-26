<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeaverController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoryController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\GlossaryTermController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\OrderController;

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

// Simple test endpoint - no dependencies
Route::get('/ping', function () {
    return ['message' => 'pong'];
});

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

// Simple test endpoint
Route::get('/test', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working'
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

    // Auth routes (public)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Weaver routes
    Route::get('/weavers', [WeaverController::class, 'index']);
    Route::get('/weavers/featured', [WeaverController::class, 'featured']);
    Route::get('/weavers/{weaver}', [WeaverController::class, 'show']);

    // Product routes
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/filters', [ProductController::class, 'filters']);
    Route::get('/products/category/{category}', [ProductController::class, 'byCategory']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/products/{product}/related', [ProductController::class, 'related']);

    // Protected routes (require authentication)
    Route::middleware('auth')->group(function () {
        // Order routes
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::get('/orders/shipping-options', [OrderController::class, 'shippingOptions']);
        Route::post('/orders/calculate-totals', [OrderController::class, 'calculateTotals']);
        
        // Media routes
        Route::get('/media', [MediaController::class, 'index']);
        Route::post('/media', [MediaController::class, 'store']);
        Route::get('/media/{media}', [MediaController::class, 'show']);
        Route::delete('/media/{media}', [MediaController::class, 'destroy']);
        Route::post('/media/{media}/retry-optimization', [MediaController::class, 'retryOptimization']);
    });

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



    // Test route without auth
    Route::get('/auth/test', function () {
        return response()->json(['message' => 'Route working', 'user' => auth()->user()]);
    });
    
    // Simple test route
    Route::get('/auth/me', function (Request $request) {
        try {
            $user = $request->user();
            return response()->json([
                'status' => 'success',
                'user' => $user,
                'message' => 'Auth test working'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });
    
    // Protected routes (authentication required)
    Route::middleware('auth:api')->group(function () {
        // Auth routes (authenticated)
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        
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

        // Media management (authenticated users)
        Route::post('/media', [MediaController::class, 'store']);
        Route::post('/media/upload-url', [MediaController::class, 'getUploadUrl']);
        Route::delete('/media/{media}', [MediaController::class, 'destroy']);
        Route::post('/media/{media}/retry-optimization', [MediaController::class, 'retryOptimization']);
    });
});





