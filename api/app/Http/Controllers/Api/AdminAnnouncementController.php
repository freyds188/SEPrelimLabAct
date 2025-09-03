<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\AdminAuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminAnnouncementController extends Controller
{
    /**
     * Get all announcements with filters
     */
    public function getAnnouncements(Request $request): JsonResponse
    {
        try {
            $query = Announcement::with(['createdBy', 'approvedBy']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
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
            $announcements = $query->paginate($perPage);

            // Add additional data
            $announcements->getCollection()->transform(function ($announcement) {
                $announcement->creator_name = $announcement->createdBy?->user?->name ?? 'Unknown';
                $announcement->approver_name = $announcement->approvedBy?->user?->name ?? null;
                $announcement->status_label = $this->getStatusLabel($announcement->status);
                $announcement->priority_label = $this->getPriorityLabel($announcement->priority);
                return $announcement;
            });

            return response()->json([
                'success' => true,
                'data' => $announcements,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve announcements',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Create new announcement
     */
    public function createAnnouncement(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string|max:5000',
                'type' => 'required|in:info,warning,success,error',
                'priority' => 'required|in:low,normal,high,urgent',
                'target_audience' => 'nullable|array',
                'target_audience.*' => 'string|in:all,users,weavers,admins',
                'scheduled_at' => 'nullable|date|after:now',
                'expires_at' => 'nullable|date|after:scheduled_at',
                'requires_approval' => 'boolean',
                'metadata' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $announcement = Announcement::create([
                'title' => $request->title,
                'content' => $request->content,
                'type' => $request->type,
                'priority' => $request->priority,
                'target_audience' => $request->target_audience ?? ['all'],
                'scheduled_at' => $request->scheduled_at,
                'expires_at' => $request->expires_at,
                'requires_approval' => $request->requires_approval ?? false,
                'status' => $request->requires_approval ? 'draft' : 'active',
                'created_by' => $request->get('admin_user')->id,
                'metadata' => $request->metadata,
            ]);

            // Log the creation
            $this->logAuditAction(
                'create',
                'Announcement',
                $announcement->id,
                [],
                $announcement->toArray(),
                'Announcement created by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Announcement created successfully',
                'data' => $announcement->load(['createdBy']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create announcement',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update announcement
     */
    public function updateAnnouncement(Request $request, Announcement $announcement): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'content' => 'sometimes|string|max:5000',
                'type' => 'sometimes|in:info,warning,success,error',
                'priority' => 'sometimes|in:low,normal,high,urgent',
                'target_audience' => 'nullable|array',
                'target_audience.*' => 'string|in:all,users,weavers,admins',
                'scheduled_at' => 'nullable|date|after:now',
                'expires_at' => 'nullable|date|after:scheduled_at',
                'requires_approval' => 'boolean',
                'metadata' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $oldValues = $announcement->toArray();
            
            $announcement->update([
                'title' => $request->title ?? $announcement->title,
                'content' => $request->content ?? $announcement->content,
                'type' => $request->type ?? $announcement->type,
                'priority' => $request->priority ?? $announcement->priority,
                'target_audience' => $request->target_audience ?? $announcement->target_audience,
                'scheduled_at' => $request->scheduled_at ?? $announcement->scheduled_at,
                'expires_at' => $request->expires_at ?? $announcement->expires_at,
                'requires_approval' => $request->has('requires_approval') ? $request->requires_approval : $announcement->requires_approval,
                'metadata' => $request->metadata ?? $announcement->metadata,
            ]);

            // Log the update
            $this->logAuditAction(
                'update',
                'Announcement',
                $announcement->id,
                $oldValues,
                $announcement->fresh()->toArray(),
                'Announcement updated by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Announcement updated successfully',
                'data' => $announcement->fresh()->load(['createdBy', 'approvedBy']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update announcement',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete announcement
     */
    public function deleteAnnouncement(Announcement $announcement): JsonResponse
    {
        try {
            if ($announcement->status === 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete active announcement. Please deactivate it first.',
                ], 400);
            }

            $oldValues = $announcement->toArray();
            $announcement->delete();

            // Log the deletion
            $this->logAuditAction(
                'delete',
                'Announcement',
                $announcement->id,
                $oldValues,
                [],
                'Announcement deleted by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Announcement deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete announcement',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Approve announcement
     */
    public function approveAnnouncement(Request $request, Announcement $announcement): JsonResponse
    {
        try {
            if ($announcement->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only draft announcements can be approved',
                ], 400);
            }

            $oldValues = $announcement->toArray();
            
            $announcement->update([
                'status' => 'active',
                'approved_by' => $request->get('admin_user')->id,
                'approved_at' => now(),
            ]);

            // Log the approval
            $this->logAuditAction(
                'approve',
                'Announcement',
                $announcement->id,
                $oldValues,
                $announcement->fresh()->toArray(),
                'Announcement approved by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Announcement approved successfully',
                'data' => $announcement->fresh()->load(['createdBy', 'approvedBy']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve announcement',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Publish announcement
     */
    public function publishAnnouncement(Request $request, Announcement $announcement): JsonResponse
    {
        try {
            if ($announcement->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only draft announcements can be published',
                ], 400);
            }

            $oldValues = $announcement->toArray();
            
            $announcement->update([
                'status' => 'active',
                'approved_by' => $request->get('admin_user')->id,
                'approved_at' => now(),
            ]);

            // Log the publication
            $this->logAuditAction(
                'publish',
                'Announcement',
                $announcement->id,
                $oldValues,
                $announcement->fresh()->toArray(),
                'Announcement published by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Announcement published successfully',
                'data' => $announcement->fresh()->load(['createdBy', 'approvedBy']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to publish announcement',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Deactivate announcement
     */
    public function deactivateAnnouncement(Request $request, Announcement $announcement): JsonResponse
    {
        try {
            if ($announcement->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only active announcements can be deactivated',
                ], 400);
            }

            $oldValues = $announcement->toArray();
            
            $announcement->update([
                'status' => 'inactive',
                'deactivated_at' => now(),
                'deactivated_by' => $request->get('admin_user')->id,
            ]);

            // Log the deactivation
            $this->logAuditAction(
                'deactivate',
                'Announcement',
                $announcement->id,
                $oldValues,
                $announcement->fresh()->toArray(),
                'Announcement deactivated by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Announcement deactivated successfully',
                'data' => $announcement->fresh()->load(['createdBy', 'approvedBy']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate announcement',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get announcement statistics
     */
    public function getAnnouncementStats(): JsonResponse
    {
        try {
            $stats = [
                'total_announcements' => Announcement::count(),
                'active_announcements' => Announcement::where('status', 'active')->count(),
                'draft_announcements' => Announcement::where('status', 'draft')->count(),
                'scheduled_announcements' => Announcement::where('status', 'scheduled')->count(),
                'expired_announcements' => Announcement::where('expires_at', '<', now())->count(),
                'by_type' => Announcement::selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->get(),
                'by_priority' => Announcement::selectRaw('priority, COUNT(*) as count')
                    ->groupBy('priority')
                    ->get(),
                'by_status' => Announcement::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve announcement statistics',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get public announcements (for frontend display)
     */
    public function getPublicAnnouncements(Request $request): JsonResponse
    {
        try {
            $query = Announcement::where('status', 'active')
                ->where(function ($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                })
                ->where(function ($q) {
                    $q->whereNull('scheduled_at')
                      ->orWhere('scheduled_at', '<=', now());
                });

            // Filter by target audience
            if ($request->has('audience')) {
                $audience = $request->audience;
                $query->where(function ($q) use ($audience) {
                    $q->whereJsonContains('target_audience', 'all')
                      ->orWhereJsonContains('target_audience', $audience);
                });
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Apply sorting
            $query->orderBy('priority', 'desc')
                  ->orderBy('created_at', 'desc');

            // Limit results
            $limit = $request->get('limit', 10);
            $announcements = $query->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $announcements,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve public announcements',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Bulk update announcement status
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'announcement_ids' => 'required|array|min:1',
                'announcement_ids.*' => 'integer|exists:announcements,id',
                'status' => 'required|in:draft,active,inactive,archived',
                'admin_notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $announcements = Announcement::whereIn('id', $request->announcement_ids)->get();
            $updatedCount = 0;

            foreach ($announcements as $announcement) {
                $oldValues = $announcement->toArray();
                
                $updateData = ['status' => $request->status];
                
                if ($request->status === 'active') {
                    $updateData['approved_by'] = $request->get('admin_user')->id;
                    $updateData['approved_at'] = now();
                }
                
                if ($request->admin_notes) {
                    $updateData['admin_notes'] = $request->admin_notes;
                }

                $announcement->update($updateData);
                $updatedCount++;

                // Log the status change
                $this->logAuditAction(
                    'bulk_update_status',
                    'Announcement',
                    $announcement->id,
                    $oldValues,
                    $announcement->fresh()->toArray(),
                    "Announcement status updated to {$request->status} via bulk update"
                );
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully updated {$updatedCount} announcements",
                'data' => [
                    'updated_count' => $updatedCount,
                    'new_status' => $request->status,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to bulk update announcement status',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get status label
     */
    private function getStatusLabel(string $status): string
    {
        $labels = [
            'draft' => 'Draft',
            'scheduled' => 'Scheduled',
            'active' => 'Active',
            'inactive' => 'Inactive',
            'archived' => 'Archived',
        ];

        return $labels[$status] ?? ucfirst($status);
    }

    /**
     * Get priority label
     */
    private function getPriorityLabel(string $priority): string
    {
        $labels = [
            'low' => 'Low',
            'normal' => 'Normal',
            'high' => 'High',
            'urgent' => 'Urgent',
        ];

        return $labels[$priority] ?? ucfirst($priority);
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


