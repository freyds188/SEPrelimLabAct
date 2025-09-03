<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Story;
use App\Models\Campaign;
use App\Models\Order;
use App\Models\Donation;
use App\Models\Weaver;
use App\Models\AdminDashboardMetrics;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Get dashboard metrics
     */
    public function getMetrics(Request $request): JsonResponse
    {
        try {
            $metrics = $this->getCachedMetrics();
            
            return response()->json([
                'success' => true,
                'data' => $metrics,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard metrics',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get dashboard overview
     */
    public function getOverview(Request $request): JsonResponse
    {
        try {
            $overview = [
                'summary' => $this->getSummaryStats(),
                'recent_activity' => $this->getRecentActivity(),
                'pending_approvals' => $this->getPendingApprovals(),
                'system_health' => $this->getSystemHealth(),
            ];

            return response()->json([
                'success' => true,
                'data' => $overview,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard overview',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get cached metrics
     */
    private function getCachedMetrics(): array
    {
        $cacheKey = 'admin_dashboard_metrics';
        $cacheDuration = 300; // 5 minutes

        return Cache::remember($cacheKey, $cacheDuration, function () {
            return [
                'users' => $this->getUserMetrics(),
                'products' => $this->getProductMetrics(),
                'content' => $this->getContentMetrics(),
                'financial' => $this->getFinancialMetrics(),
                'performance' => $this->getPerformanceMetrics(),
            ];
        });
    }

    /**
     * Get user metrics
     */
    private function getUserMetrics(): array
    {
        $totalUsers = User::count();
        $activeUsers = User::where('email_verified_at', '!=', null)->count();
        $newUsersThisMonth = User::whereMonth('created_at', now()->month)->count();
        $newUsersThisWeek = User::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();

        return [
            'total_users' => $totalUsers,
            'active_users' => $activeUsers,
            'new_users_month' => $newUsersThisMonth,
            'new_users_week' => $newUsersThisWeek,
            'verification_rate' => $totalUsers > 0 ? round(($activeUsers / $totalUsers) * 100, 2) : 0,
        ];
    }

    /**
     * Get product metrics
     */
    private function getProductMetrics(): array
    {
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $pendingApproval = Product::where('status', 'pending')->count();
        $outOfStock = Product::where('stock_quantity', 0)->count();
        $lowStock = Product::where('stock_quantity', '>', 0)
            ->where('stock_quantity', '<=', 10)
            ->count();

        return [
            'total_products' => $totalProducts,
            'active_products' => $activeProducts,
            'pending_approval' => $pendingApproval,
            'out_of_stock' => $outOfStock,
            'low_stock' => $lowStock,
            'active_rate' => $totalProducts > 0 ? round(($activeProducts / $totalProducts) * 100, 2) : 0,
        ];
    }

    /**
     * Get content metrics
     */
    private function getContentMetrics(): array
    {
        $totalStories = Story::count();
        $publishedStories = Story::where('is_published', true)->count();
        $pendingStories = Story::where('status', 'pending')->count();
        $totalCampaigns = Campaign::count();
        $activeCampaigns = Campaign::where('status', 'active')->count();

        return [
            'total_stories' => $totalStories,
            'published_stories' => $publishedStories,
            'pending_stories' => $pendingStories,
            'total_campaigns' => $totalCampaigns,
            'active_campaigns' => $activeCampaigns,
            'publish_rate' => $totalStories > 0 ? round(($publishedStories / $totalStories) * 100, 2) : 0,
        ];
    }

    /**
     * Get financial metrics
     */
    private function getFinancialMetrics(): array
    {
        $totalOrders = Order::count();
        $completedOrders = Order::where('status', 'completed')->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $monthlyRevenue = Order::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->sum('total_amount');

        $totalDonations = Donation::where('status', 'completed')->sum('amount');
        $monthlyDonations = Donation::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->sum('amount');

        return [
            'total_orders' => $totalOrders,
            'completed_orders' => $completedOrders,
            'pending_orders' => $pendingOrders,
            'total_revenue' => $totalRevenue,
            'monthly_revenue' => $monthlyRevenue,
            'total_donations' => $totalDonations,
            'monthly_donations' => $monthlyDonations,
            'completion_rate' => $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 2) : 0,
        ];
    }

    /**
     * Get performance metrics
     */
    private function getPerformanceMetrics(): array
    {
        $totalWeavers = Weaver::count();
        $activeWeavers = Weaver::where('is_active', true)->count();
        $productsPerWeaver = $totalWeavers > 0 ? round(Product::count() / $totalWeavers, 2) : 0;
        $storiesPerWeaver = $totalWeavers > 0 ? round(Story::count() / $totalWeavers, 2) : 0;

        return [
            'total_weavers' => $totalWeavers,
            'active_weavers' => $activeWeavers,
            'products_per_weaver' => $productsPerWeaver,
            'stories_per_weaver' => $storiesPerWeaver,
            'weaver_activity_rate' => $totalWeavers > 0 ? round(($activeWeavers / $totalWeavers) * 100, 2) : 0,
        ];
    }

    /**
     * Get summary statistics
     */
    private function getSummaryStats(): array
    {
        return [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('status', 'completed')->sum('total_amount'),
            'pending_approvals' => $this->getTotalPendingApprovals(),
            'system_status' => 'healthy',
        ];
    }

    /**
     * Get recent activity
     */
    private function getRecentActivity(): array
    {
        $recentUsers = User::latest()->take(5)->get(['id', 'name', 'email', 'created_at']);
        $recentProducts = Product::latest()->take(5)->get(['id', 'name', 'status', 'created_at']);
        $recentOrders = Order::latest()->take(5)->get(['id', 'order_number', 'status', 'total_amount', 'created_at']);

        return [
            'recent_users' => $recentUsers,
            'recent_products' => $recentProducts,
            'recent_orders' => $recentOrders,
        ];
    }

    /**
     * Get pending approvals
     */
    private function getPendingApprovals(): array
    {
        return [
            'products' => Product::where('status', 'pending')->count(),
            'stories' => Story::where('status', 'pending')->count(),
            'campaigns' => Campaign::where('status', 'pending')->count(),
            'users' => User::where('email_verified_at', null)->count(),
        ];
    }

    /**
     * Get system health
     */
    private function getSystemHealth(): array
    {
        $databaseSize = $this->getDatabaseSize();
        $lastBackup = $this->getLastBackupTime();
        $systemUptime = $this->getSystemUptime();

        return [
            'database_size' => $databaseSize,
            'last_backup' => $lastBackup,
            'system_uptime' => $systemUptime,
            'cache_status' => 'operational',
            'queue_status' => 'operational',
        ];
    }

    /**
     * Get total pending approvals
     */
    private function getTotalPendingApprovals(): int
    {
        return Product::where('status', 'pending')->count() +
               Story::where('status', 'pending')->count() +
               Campaign::where('status', 'pending')->count();
    }

    /**
     * Get database size (placeholder)
     */
    private function getDatabaseSize(): string
    {
        // This would typically query the database for actual size
        return '2.5 MB';
    }

    /**
     * Get last backup time (placeholder)
     */
    private function getLastBackupTime(): string
    {
        // This would typically check actual backup logs
        return now()->subHours(6)->format('Y-m-d H:i:s');
    }

    /**
     * Get system uptime (placeholder)
     */
    private function getSystemUptime(): string
    {
        // This would typically check actual system uptime
        return '7 days, 14 hours';
    }
}


