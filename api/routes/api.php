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
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AdminProductController;
use App\Http\Controllers\Api\AdminContentModerationController;
use App\Http\Controllers\Api\AdminFinancialController;
use App\Http\Controllers\Api\AdminAnnouncementController;

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

Route::middleware('auth')->get('/user', function (Request $request) {
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
        
        // Media routes (protected)
        Route::get('/media', [MediaController::class, 'index']);
        Route::post('/media', [MediaController::class, 'store']);
        Route::get('/media/{media}', [MediaController::class, 'show']);
        Route::delete('/media/{media}', [MediaController::class, 'destroy']);
        Route::post('/media/{media}/retry-optimization', [MediaController::class, 'retryOptimization']);
        Route::post('/media/upload-url', [MediaController::class, 'getUploadUrl']);
    });

    // Story routes
    Route::get('/stories', [StoryController::class, 'index']);
    Route::get('/stories/featured', [StoryController::class, 'featured']);
    Route::get('/stories/types', [StoryController::class, 'types']);
    Route::get('/stories/slug/{slug}', [StoryController::class, 'showBySlug']);
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

    // Debug authentication route
    Route::middleware(['auth'])->get('/auth/debug', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
            'guard' => 'sanctum',
            'token' => $request->bearerToken(),
            'message' => 'Authentication debug info'
        ]);
    });

    // Simple test route with auth
    Route::middleware(['auth'])->get('/auth/test-simple', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
            'message' => 'Simple auth test'
        ]);
    });

    // Public test route (no auth)
    Route::get('/auth/test-public', function () {
        return response()->json([
            'status' => 'success',
            'message' => 'Public route working'
        ]);
    });

    // Test authentication route
    Route::middleware(['auth'])->get('/test-auth', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'message' => 'Authentication working!',
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email
        ]);
    });
    
    // Protected routes (authentication required)
    Route::middleware(['auth'])->group(function () {
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
        Route::post('/stories/{story}/publish', [StoryController::class, 'publish']);
        Route::post('/stories/{story}/unpublish', [StoryController::class, 'unpublish']);

        // Campaign management (authenticated users)
        Route::post('/campaigns', [CampaignController::class, 'store']);
        Route::put('/campaigns/{campaign}', [CampaignController::class, 'update']);
        Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy']);

        // Glossary management (authenticated users)
        Route::post('/glossary', [GlossaryTermController::class, 'store']);
        Route::put('/glossary/{glossaryTerm}', [GlossaryTermController::class, 'update']);
        Route::delete('/glossary/{glossaryTerm}', [GlossaryTermController::class, 'destroy']);
    });

    // Admin API routes
    Route::prefix('admin')->group(function () {
        // Admin authentication routes (public)
        Route::post('/auth/login', [AdminAuthController::class, 'login']);
        
        // Protected admin routes
        Route::middleware(['auth', 'admin'])->group(function () {
            // Admin authentication
            Route::post('/auth/logout', [AdminAuthController::class, 'logout']);
            Route::get('/auth/me', [AdminAuthController::class, 'me']);
            Route::post('/auth/refresh', [AdminAuthController::class, 'refresh']);
            Route::post('/auth/check-permission', [AdminAuthController::class, 'checkPermission']);
            
            // Dashboard metrics
            Route::get('/dashboard/metrics', [AdminDashboardController::class, 'getMetrics']);
            Route::get('/dashboard/overview', [AdminDashboardController::class, 'getOverview']);
            
            // User management
            Route::get('/users', [AdminUserController::class, 'index']);
            Route::get('/users/{user}', [AdminUserController::class, 'show']);
            Route::put('/users/{user}', [AdminUserController::class, 'update']);
            Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
            Route::post('/users/{user}/approve', [AdminUserController::class, 'approve']);
            Route::post('/users/{user}/ban', [AdminUserController::class, 'ban']);
            Route::post('/users/{user}/unban', [AdminUserController::class, 'unban']);
            
            // Product management
            Route::get('/products', [AdminProductController::class, 'getProducts']);
            Route::post('/products', [AdminProductController::class, 'createProduct']);
            Route::put('/products/{product}', [AdminProductController::class, 'updateProduct']);
            Route::delete('/products/{product}', [AdminProductController::class, 'deleteProduct']);
            Route::post('/products/bulk-upload', [AdminProductController::class, 'bulkUpload']);
            Route::post('/products/{product}/approve', [AdminProductController::class, 'approveProduct']);
            Route::get('/products/stats', [AdminProductController::class, 'getProductStats']);
            
            // Content moderation
            Route::get('/moderation/queue', [AdminContentModerationController::class, 'getModerationQueue']);
            Route::post('/moderation/assign', [AdminContentModerationController::class, 'assignContent']);
            Route::post('/moderation/{queueItem}/review', [AdminContentModerationController::class, 'reviewContent']);
            Route::get('/moderation/stories', [AdminContentModerationController::class, 'getStoriesForModeration']);
            Route::post('/moderation/stories/{story}/approve', [AdminContentModerationController::class, 'approveStory']);
            Route::post('/moderation/stories/{story}/reject', [AdminContentModerationController::class, 'rejectStory']);
            Route::get('/moderation/campaigns', [AdminContentModerationController::class, 'getCampaignsForModeration']);
            Route::post('/moderation/campaigns/{campaign}/approve', [AdminContentModerationController::class, 'approveCampaign']);
            Route::get('/moderation/stats', [AdminContentModerationController::class, 'getModerationStats']);
            
            // Financial management
            Route::get('/financial/overview', [AdminFinancialController::class, 'getFinancialOverview']);
            Route::get('/financial/orders', [AdminFinancialController::class, 'getOrders']);
            Route::put('/financial/orders/{order}/status', [AdminFinancialController::class, 'updateOrderStatus']);
            Route::post('/financial/orders/{order}/refund', [AdminFinancialController::class, 'processRefund']);
            Route::get('/financial/payouts', [AdminFinancialController::class, 'getPayouts']);
            Route::post('/financial/payouts/{payout}/process', [AdminFinancialController::class, 'processPayout']);
            Route::get('/financial/reports', [AdminFinancialController::class, 'getFinancialReports']);
            
            // Announcement system
            Route::get('/announcements', [AdminAnnouncementController::class, 'getAnnouncements']);
            Route::post('/announcements', [AdminAnnouncementController::class, 'createAnnouncement']);
            Route::put('/announcements/{announcement}', [AdminAnnouncementController::class, 'updateAnnouncement']);
            Route::delete('/announcements/{announcement}', [AdminAnnouncementController::class, 'deleteAnnouncement']);
            Route::post('/announcements/{announcement}/approve', [AdminAnnouncementController::class, 'approveAnnouncement']);
            Route::post('/announcements/{announcement}/publish', [AdminAnnouncementController::class, 'publishAnnouncement']);
            Route::post('/announcements/{announcement}/deactivate', [AdminAnnouncementController::class, 'deactivateAnnouncement']);
            Route::get('/announcements/stats', [AdminAnnouncementController::class, 'getAnnouncementStats']);
            Route::get('/announcements/public', [AdminAnnouncementController::class, 'getPublicAnnouncements']);
            Route::post('/announcements/bulk-status', [AdminAnnouncementController::class, 'bulkUpdateStatus']);
        });
    });
});





