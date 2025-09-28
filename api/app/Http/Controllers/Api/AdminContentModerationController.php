<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Story;
use App\Models\Campaign;
use App\Models\GlossaryTerm;
use App\Models\ContentModerationQueue;
use App\Models\AdminAuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminContentModerationController extends Controller
{
    /**
     * Get content moderation queue
     */
    public function getModerationQueue(Request $request): JsonResponse
    {
        try {
            $query = ContentModerationQueue::with(['submittedBy', 'assignedTo', 'reviewedBy']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }

            if ($request->has('content_type')) {
                $query->where('content_type', $request->content_type);
            }

            if ($request->has('assigned_to')) {
                $query->where('assigned_to', $request->assigned_to);
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $queue = $query->paginate($perPage);

            // Add content details
            $queue->getCollection()->transform(function ($item) {
                $item->content_details = $this->getContentDetails($item->content_type, $item->content_id);
                return $item;
            });

            return response()->json([
                'success' => true,
                'data' => $queue,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve moderation queue',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Assign content for moderation
     */
    public function assignContent(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'content_type' => 'required|string|in:story,campaign,glossary,product',
                'content_id' => 'required|integer',
                'assigned_to' => 'required|exists:admin_users,id',
                'priority' => 'sometimes|in:low,normal,high,urgent',
                'due_date' => 'sometimes|date|after:now',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Check if content is already in queue
            $existing = ContentModerationQueue::where('content_type', $request->content_type)
                ->where('content_id', $request->content_id)
                ->where('status', 'pending')
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Content is already in moderation queue',
                ], 400);
            }

            $queueItem = ContentModerationQueue::create([
                'content_type' => $request->content_type,
                'content_id' => $request->content_id,
                'submitted_by' => $request->get('admin_user')->id,
                'status' => 'pending',
                'priority' => $request->priority ?? 'normal',
                'assigned_to' => $request->assigned_to,
                'assigned_at' => now(),
                'due_date' => $request->due_date,
            ]);

            // Log the assignment
            $this->logAuditAction(
                'assign',
                'ContentModeration',
                $queueItem->id,
                [],
                $queueItem->toArray(),
                "Content assigned for moderation: {$request->content_type} #{$request->content_id}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Content assigned for moderation successfully',
                'data' => $queueItem->load(['submittedBy', 'assignedTo']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign content for moderation',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
            }
    }

    /**
     * Review and approve/reject content
     */
    public function reviewContent(Request $request, ContentModerationQueue $queueItem): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:approve,reject,requires_changes',
                'moderation_notes' => 'required|string|max:1000',
                'flags' => 'nullable|array',
                'flags.*' => 'string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $oldValues = $queueItem->toArray();
            
            // Update queue item
            $queueItem->update([
                'status' => $request->action,
                'moderation_notes' => $request->moderation_notes,
                'reviewed_by' => $request->get('admin_user')->id,
                'reviewed_at' => now(),
                'review_count' => $queueItem->review_count + 1,
                'flags' => $request->flags,
            ]);

            // Update the actual content based on action
            $this->updateContentStatus($queueItem->content_type, $queueItem->content_id, $request->action);

            // Log the review
            $this->logAuditAction(
                'review',
                'ContentModeration',
                $queueItem->id,
                $oldValues,
                $queueItem->fresh()->toArray(),
                "Content reviewed: {$request->action} - {$queueItem->content_type} #{$queueItem->content_id}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Content reviewed successfully',
                'data' => $queueItem->fresh()->load(['submittedBy', 'assignedTo', 'reviewedBy']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to review content',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get stories for moderation
     */
    public function getStoriesForModeration(Request $request): JsonResponse
    {
        try {
            $query = Story::with(['weaver']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                $query->whereIn('status', ['pending', 'draft']);
            }

            // Apply search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $stories = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $stories,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve stories for moderation',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Approve story
     */
    public function approveStory(Request $request, Story $story): JsonResponse
    {
        try {
            if ($story->status === 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Story is already approved',
                ], 400);
            }

            $oldValues = $story->toArray();
            
            $story->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $request->get('admin_user')->id,
                'is_published' => true,
            ]);

            // Log the approval
            $this->logAuditAction(
                'approve',
                'Story',
                $story->id,
                $oldValues,
                $story->fresh()->toArray(),
                'Story approved by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Story approved successfully',
                'data' => $story->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve story',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Reject story
     */
    public function rejectStory(Request $request, Story $story): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'rejection_reason' => 'required|string|max:500',
                'admin_notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $oldValues = $story->toArray();
            
            $story->update([
                'status' => 'rejected',
                'rejection_reason' => $request->rejection_reason,
                'admin_notes' => $request->admin_notes,
                'rejected_at' => now(),
                'rejected_by' => $request->get('admin_user')->id,
                'is_published' => false,
            ]);

            // Log the rejection
            $this->logAuditAction(
                'reject',
                'Story',
                $story->id,
                $oldValues,
                $story->fresh()->toArray(),
                "Story rejected by admin. Reason: {$request->rejection_reason}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Story rejected successfully',
                'data' => $story->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject story',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get campaigns for moderation
     */
    public function getCampaignsForModeration(Request $request): JsonResponse
    {
        try {
            $query = Campaign::with(['weaver']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                $query->whereIn('status', ['pending', 'draft']);
            }

            // Apply search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $campaigns = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $campaigns,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve campaigns for moderation',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Permanently delete a story (admin only)
     */
    public function deleteStory(Story $story): JsonResponse
    {
        try {
            $oldValues = $story->toArray();
            $storyId = $story->id;
            $story->delete();

            // Log delete action
            $this->logAuditAction(
                'delete',
                'Story',
                $storyId,
                $oldValues,
                [],
                'Story hard deleted by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Story deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete story',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Approve campaign
     */
    public function approveCampaign(Request $request, Campaign $campaign): JsonResponse
    {
        try {
            if ($campaign->status === 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Campaign is already approved',
                ], 400);
            }

            $oldValues = $campaign->toArray();
            
            $campaign->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $request->get('admin_user')->id,
                'is_active' => true,
            ]);

            // Log the approval
            $this->logAuditAction(
                'approve',
                'Campaign',
                $campaign->id,
                $oldValues,
                $campaign->fresh()->toArray(),
                'Campaign approved by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Campaign approved successfully',
                'data' => $campaign->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve campaign',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get moderation statistics
     */
    public function getModerationStats(): JsonResponse
    {
        try {
            $stats = [
                'queue_summary' => [
                    'total_pending' => ContentModerationQueue::where('status', 'pending')->count(),
                    'total_under_review' => ContentModerationQueue::where('status', 'under_review')->count(),
                    'total_approved' => ContentModerationQueue::where('status', 'approved')->count(),
                    'total_rejected' => ContentModerationQueue::where('status', 'rejected')->count(),
                ],
                'content_summary' => [
                    'stories_pending' => Story::where('status', 'pending')->count(),
                    'campaigns_pending' => Campaign::where('status', 'pending')->count(),
                    'glossary_pending' => GlossaryTerm::where('status', 'pending')->count(),
                ],
                'priority_breakdown' => ContentModerationQueue::selectRaw('priority, COUNT(*) as count')
                    ->groupBy('priority')
                    ->get(),
                'type_breakdown' => ContentModerationQueue::selectRaw('content_type, COUNT(*) as count')
                    ->groupBy('content_type')
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve moderation statistics',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get content details for moderation
     */
    private function getContentDetails(string $contentType, int $contentId): ?array
    {
        try {
            switch ($contentType) {
                case 'story':
                    $content = Story::find($contentId);
                    return $content ? [
                        'title' => $content->title,
                        'excerpt' => substr($content->content, 0, 100) . '...',
                        'author' => $content->weaver?->name ?? 'Unknown',
                        'created_at' => $content->created_at,
                    ] : null;
                
                case 'campaign':
                    $content = Campaign::find($contentId);
                    return $content ? [
                        'title' => $content->title,
                        'excerpt' => substr($content->description, 0, 100) . '...',
                        'author' => $content->weaver?->name ?? 'Unknown',
                        'created_at' => $content->created_at,
                    ] : null;
                
                case 'glossary':
                    $content = GlossaryTerm::find($contentId);
                    return $content ? [
                        'title' => $content->term,
                        'excerpt' => substr($content->definition, 0, 100) . '...',
                        'created_at' => $content->created_at,
                    ] : null;
                
                default:
                    return null;
            }
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Update content status based on moderation action
     */
    private function updateContentStatus(string $contentType, int $contentId, string $action): void
    {
        try {
            switch ($contentType) {
                case 'story':
                    $content = Story::find($contentId);
                    if ($content) {
                        $content->update([
                            'status' => $action === 'approve' ? 'approved' : 'rejected',
                            'approved_at' => $action === 'approve' ? now() : null,
                            'approved_by' => $action === 'approve' ? request()->get('admin_user')->id : null,
                            'is_published' => $action === 'approve',
                        ]);
                    }
                    break;
                
                case 'campaign':
                    $content = Campaign::find($contentId);
                    if ($content) {
                        $content->update([
                            'status' => $action === 'approve' ? 'approved' : 'rejected',
                            'approved_at' => $action === 'approve' ? now() : null,
                            'approved_by' => $action === 'approve' ? request()->get('admin_user')->id : null,
                            'is_active' => $action === 'approve',
                        ]);
                    }
                    break;
                
                case 'glossary':
                    $content = GlossaryTerm::find($contentId);
                    if ($content) {
                        $content->update([
                            'status' => $action === 'approve' ? 'approved' : 'rejected',
                            'approved_at' => $action === 'approve' ? now() : null,
                            'approved_by' => $action === 'approve' ? request()->get('admin_user')->id : null,
                        ]);
                    }
                    break;
            }
        } catch (\Exception $e) {
            \Log::error('Failed to update content status: ' . $e->getMessage());
        }
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


