<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payout;
use App\Models\Donation;
use App\Models\AdminAuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminFinancialController extends Controller
{
    /**
     * Get financial overview and statistics
     */
    public function getFinancialOverview(Request $request): JsonResponse
    {
        try {
            $dateRange = $this->getDateRange($request);
            
            $overview = [
                'revenue' => $this->getRevenueStats($dateRange),
                'orders' => $this->getOrderStats($dateRange),
                'payouts' => $this->getPayoutStats($dateRange),
                'donations' => $this->getDonationStats($dateRange),
                'trends' => $this->getFinancialTrends($dateRange),
            ];

            return response()->json([
                'success' => true,
                'data' => $overview,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve financial overview',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get all orders with admin filters
     */
    public function getOrders(Request $request): JsonResponse
    {
        try {
            $query = Order::with(['user', 'orderItems.product', 'orderItems.weaver']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from')) {
                $query->where('created_at', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->where('created_at', '<=', $request->date_to);
            }

            if ($request->has('min_amount')) {
                $query->where('total_amount', '>=', $request->min_amount);
            }

            if ($request->has('max_amount')) {
                $query->where('total_amount', '<=', $request->max_amount);
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $orders = $query->paginate($perPage);

            // Add additional data
            $orders->getCollection()->transform(function ($order) {
                $order->item_count = $order->orderItems->count();
                $order->customer_name = $order->user->name ?? 'Unknown';
                $order->status_label = $this->getOrderStatusLabel($order->status);
                return $order;
            });

            return response()->json([
                'success' => true,
                'data' => $orders,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(Request $request, Order $order): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,processing,shipped,delivered,completed,cancelled,refunded',
                'admin_notes' => 'nullable|string|max:1000',
                'tracking_number' => 'nullable|string|max:100',
                'shipped_at' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $oldValues = $order->toArray();
            
            $updateData = ['status' => $request->status];
            
            if ($request->status === 'shipped' && $request->shipped_at) {
                $updateData['shipped_at'] = $request->shipped_at;
            }
            
            if ($request->tracking_number) {
                $updateData['tracking_number'] = $request->tracking_number;
            }
            
            if ($request->admin_notes) {
                $updateData['admin_notes'] = $request->admin_notes;
            }

            $order->update($updateData);

            // Log the status change
            $this->logAuditAction(
                'update_status',
                'Order',
                $order->id,
                $oldValues,
                $order->fresh()->toArray(),
                "Order status updated to {$request->status} by admin"
            );

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => $order->fresh()->load(['user', 'orderItems.product']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Process refund for order
     */
    public function processRefund(Request $request, Order $order): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'refund_amount' => 'required|numeric|min:0|max:' . $order->total_amount,
                'refund_reason' => 'required|string|max:500',
                'refund_method' => 'required|in:original_payment,store_credit,manual',
                'admin_notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            if ($order->status === 'refunded') {
                return response()->json([
                    'success' => false,
                    'message' => 'Order is already refunded',
                ], 400);
            }

            $oldValues = $order->toArray();
            
            $order->update([
                'status' => 'refunded',
                'refunded_at' => now(),
                'refunded_by' => $request->get('admin_user')->id,
                'refund_amount' => $request->refund_amount,
                'refund_reason' => $request->refund_reason,
                'refund_method' => $request->refund_method,
                'admin_notes' => $request->admin_notes,
            ]);

            // Log the refund
            $this->logAuditAction(
                'refund',
                'Order',
                $order->id,
                $oldValues,
                $order->fresh()->toArray(),
                "Order refunded by admin. Amount: {$request->refund_amount}, Reason: {$request->refund_reason}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Refund processed successfully',
                'data' => $order->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process refund',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get payouts for weavers
     */
    public function getPayouts(Request $request): JsonResponse
    {
        try {
            $query = Payout::with(['weaver', 'orderItems']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('weaver_id')) {
                $query->where('weaver_id', $request->weaver_id);
            }

            if ($request->has('date_from')) {
                $query->where('created_at', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->where('created_at', '<=', $request->date_to);
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $payouts = $query->paginate($perPage);

            // Add additional data
            $payouts->getCollection()->transform(function ($payout) {
                $payout->weaver_name = $payout->weaver->name ?? 'Unknown';
                $payout->status_label = $this->getPayoutStatusLabel($payout->status);
                $payout->order_count = $payout->orderItems->count();
                return $payout;
            });

            return response()->json([
                'success' => true,
                'data' => $payouts,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payouts',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Process payout
     */
    public function processPayout(Request $request, Payout $payout): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:approve,reject,process',
                'admin_notes' => 'nullable|string|max:1000',
                'payment_method' => 'nullable|string|max:100',
                'transaction_id' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $oldValues = $payout->toArray();
            
            $updateData = [];
            
            switch ($request->action) {
                case 'approve':
                    $updateData['status'] = 'approved';
                    $updateData['approved_at'] = now();
                    $updateData['approved_by'] = $request->get('admin_user')->id;
                    break;
                    
                case 'reject':
                    $updateData['status'] = 'rejected';
                    $updateData['rejected_at'] = now();
                    $updateData['rejected_by'] = $request->get('admin_user')->id;
                    break;
                    
                case 'process':
                    $updateData['status'] = 'processed';
                    $updateData['processed_at'] = now();
                    $updateData['processed_by'] = $request->get('admin_user')->id;
                    $updateData['payment_method'] = $request->payment_method;
                    $updateData['transaction_id'] = $request->transaction_id;
                    break;
            }
            
            if ($request->admin_notes) {
                $updateData['admin_notes'] = $request->admin_notes;
            }

            $payout->update($updateData);

            // Log the action
            $this->logAuditAction(
                $request->action,
                'Payout',
                $payout->id,
                $oldValues,
                $payout->fresh()->toArray(),
                "Payout {$request->action} by admin"
            );

            return response()->json([
                'success' => true,
                'message' => "Payout {$request->action} successfully",
                'data' => $payout->fresh()->load(['weaver', 'orderItems']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payout',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get financial reports
     */
    public function getFinancialReports(Request $request): JsonResponse
    {
        try {
            $dateRange = $this->getDateRange($request);
            $reportType = $request->get('type', 'summary');

            switch ($reportType) {
                case 'revenue':
                    $report = $this->generateRevenueReport($dateRange);
                    break;
                case 'orders':
                    $report = $this->generateOrderReport($dateRange);
                    break;
                case 'payouts':
                    $report = $this->generatePayoutReport($dateRange);
                    break;
                case 'donations':
                    $report = $this->generateDonationReport($dateRange);
                    break;
                default:
                    $report = $this->generateSummaryReport($dateRange);
            }

            return response()->json([
                'success' => true,
                'data' => $report,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate financial report',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get date range from request
     */
    private function getDateRange(Request $request): array
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        
        return [
            'start' => Carbon::parse($startDate),
            'end' => Carbon::parse($endDate),
        ];
    }

    /**
     * Get revenue statistics
     */
    private function getRevenueStats(array $dateRange): array
    {
        $totalRevenue = Order::where('status', 'completed')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->sum('total_amount');

        $monthlyRevenue = Order::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->sum('total_amount');

        $averageOrderValue = Order::where('status', 'completed')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->avg('total_amount');

        return [
            'total_revenue' => $totalRevenue,
            'monthly_revenue' => $monthlyRevenue,
            'average_order_value' => round($averageOrderValue, 2),
            'period' => [
                'start' => $dateRange['start']->format('Y-m-d'),
                'end' => $dateRange['end']->format('Y-m-d'),
            ],
        ];
    }

    /**
     * Get order statistics
     */
    private function getOrderStats(array $dateRange): array
    {
        $totalOrders = Order::whereBetween('created_at', [$dateRange['start'], $dateRange['end']])->count();
        $completedOrders = Order::where('status', 'completed')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $cancelledOrders = Order::where('status', 'cancelled')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();

        return [
            'total_orders' => $totalOrders,
            'completed_orders' => $completedOrders,
            'pending_orders' => $pendingOrders,
            'cancelled_orders' => $cancelledOrders,
            'completion_rate' => $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 2) : 0,
        ];
    }

    /**
     * Get payout statistics
     */
    private function getPayoutStats(array $dateRange): array
    {
        $totalPayouts = Payout::whereBetween('created_at', [$dateRange['start'], $dateRange['end']])->count();
        $pendingPayouts = Payout::where('status', 'pending')->count();
        $processedPayouts = Payout::where('status', 'processed')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();
        $totalAmount = Payout::where('status', 'processed')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->sum('amount');

        return [
            'total_payouts' => $totalPayouts,
            'pending_payouts' => $pendingPayouts,
            'processed_payouts' => $processedPayouts,
            'total_amount' => $totalAmount,
        ];
    }

    /**
     * Get donation statistics
     */
    private function getDonationStats(array $dateRange): array
    {
        $totalDonations = Donation::whereBetween('created_at', [$dateRange['start'], $dateRange['end']])->count();
        $completedDonations = Donation::where('status', 'completed')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();
        $totalAmount = Donation::where('status', 'completed')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->sum('amount');

        return [
            'total_donations' => $totalDonations,
            'completed_donations' => $completedDonations,
            'total_amount' => $totalAmount,
        ];
    }

    /**
     * Get financial trends
     */
    private function getFinancialTrends(array $dateRange): array
    {
        // Get daily revenue for the last 30 days
        $dailyRevenue = Order::where('status', 'completed')
            ->whereBetween('created_at', [now()->subDays(30), now()])
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'daily_revenue' => $dailyRevenue,
            'trend_period' => '30 days',
        ];
    }

    /**
     * Generate summary report
     */
    private function generateSummaryReport(array $dateRange): array
    {
        return [
            'period' => [
                'start' => $dateRange['start']->format('Y-m-d'),
                'end' => $dateRange['end']->format('Y-m-d'),
            ],
            'summary' => [
                'total_revenue' => $this->getRevenueStats($dateRange),
                'total_orders' => $this->getOrderStats($dateRange),
                'total_payouts' => $this->getPayoutStats($dateRange),
                'total_donations' => $this->getDonationStats($dateRange),
            ],
        ];
    }

    /**
     * Generate revenue report
     */
    private function generateRevenueReport(array $dateRange): array
    {
        $revenueByDay = Order::where('status', 'completed')
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'period' => $dateRange,
            'daily_breakdown' => $revenueByDay,
            'summary' => $this->getRevenueStats($dateRange),
        ];
    }

    /**
     * Generate order report
     */
    private function generateOrderReport(array $dateRange): array
    {
        $ordersByStatus = Order::whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->selectRaw('status, COUNT(*) as count, SUM(total_amount) as total_amount')
            ->groupBy('status')
            ->get();

        return [
            'period' => $dateRange,
            'by_status' => $ordersByStatus,
            'summary' => $this->getOrderStats($dateRange),
        ];
    }

    /**
     * Generate payout report
     */
    private function generatePayoutReport(array $dateRange): array
    {
        $payoutsByStatus = Payout::whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->selectRaw('status, COUNT(*) as count, SUM(amount) as total_amount')
            ->groupBy('status')
            ->get();

        return [
            'period' => $dateRange,
            'by_status' => $payoutsByStatus,
            'summary' => $this->getPayoutStats($dateRange),
        ];
    }

    /**
     * Generate donation report
     */
    private function generateDonationReport(array $dateRange): array
    {
        $donationsByStatus = Donation::whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->selectRaw('status, COUNT(*) as count, SUM(amount) as total_amount')
            ->groupBy('status')
            ->get();

        return [
            'period' => $dateRange,
            'by_status' => $donationsByStatus,
            'summary' => $this->getDonationStats($dateRange),
        ];
    }

    /**
     * Get order status label
     */
    private function getOrderStatusLabel(string $status): string
    {
        $labels = [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'refunded' => 'Refunded',
        ];

        return $labels[$status] ?? ucfirst($status);
    }

    /**
     * Get payout status label
     */
    private function getPayoutStatusLabel(string $status): string
    {
        $labels = [
            'pending' => 'Pending',
            'approved' => 'Approved',
            'processed' => 'Processed',
            'rejected' => 'Rejected',
            'failed' => 'Failed',
        ];

        return $labels[$status] ?? ucfirst($status);
    }

    /**
     * Log audit action
     */
    private function logAuditAction(string $action, string $resourceType, int $resourceId, array $oldValues, array $newValues, string $description): void
    {
        try {
            $adminUser = request()->get('admin_user');
            if ($adminUser) {
                AdminAuditLog::create([
                    'admin_user_id' => $adminUser->id,
                    'action' => $action,
                    'resource_type' => $resourceType,
                    'resource_id' => $resourceId,
                    'old_values' => $oldValues,
                    'new_values' => $newValues,
                    'description' => $description,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to create audit log: ' . $e->getMessage());
        }
    }
}


