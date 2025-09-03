<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AdminAuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * Get all users with pagination and filters
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::with(['weaver']);

            // Apply filters
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($request->has('status')) {
                $status = $request->status;
                if ($status === 'verified') {
                    $query->whereNotNull('email_verified_at');
                } elseif ($status === 'unverified') {
                    $query->whereNull('email_verified_at');
                }
            }

            if ($request->has('role')) {
                $role = $request->role;
                if ($role === 'weaver') {
                    $query->whereHas('weaver');
                } elseif ($role === 'customer') {
                    $query->whereDoesntHave('weaver');
                }
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $users = $query->paginate($perPage);

            // Add additional data
            $users->getCollection()->transform(function ($user) {
                $user->is_weaver = $user->weaver !== null;
                $user->verification_status = $user->email_verified_at ? 'verified' : 'unverified';
                $user->last_login = $user->last_login_at ?? 'Never';
                return $user;
            });

            return response()->json([
                'success' => true,
                'data' => $users,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve users',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get specific user details
     */
    public function show(User $user): JsonResponse
    {
        try {
            $user->load(['weaver', 'orders', 'donations']);

            // Add additional user data
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'last_login_at' => $user->last_login_at,
                'is_weaver' => $user->weaver !== null,
                'weaver_info' => $user->weaver,
                'order_count' => $user->orders->count(),
                'donation_count' => $user->donations->count(),
                'total_spent' => $user->orders->where('status', 'completed')->sum('total_amount'),
                'total_donated' => $user->donations->where('status', 'completed')->sum('amount'),
            ];

            return response()->json([
                'success' => true,
                'data' => $userData,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user details',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update user information
     */
    public function update(Request $request, User $user): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => [
                    'sometimes',
                    'email',
                    Rule::unique('users')->ignore($user->id),
                ],
                'is_active' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $oldValues = $user->toArray();
            $user->update($request->only(['name', 'email', 'is_active']));
            $newValues = $user->fresh()->toArray();

            // Log the change
            $this->logAuditAction(
                'update',
                'User',
                $user->id,
                $oldValues,
                $newValues,
                'User information updated by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete user (soft delete)
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            // Check if user has active orders or is a weaver
            if ($user->orders()->where('status', '!=', 'cancelled')->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete user with active orders',
                ], 400);
            }

            if ($user->weaver) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete user who is a weaver',
                ], 400);
            }

            $oldValues = $user->toArray();
            $user->delete();

            // Log the deletion
            $this->logAuditAction(
                'delete',
                'User',
                $user->id,
                $oldValues,
                [],
                'User deleted by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Approve user account
     */
    public function approve(User $user): JsonResponse
    {
        try {
            if ($user->email_verified_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is already verified',
                ], 400);
            }

            $oldValues = $user->toArray();
            $user->update(['email_verified_at' => now()]);
            $newValues = $user->fresh()->toArray();

            // Log the approval
            $this->logAuditAction(
                'approve',
                'User',
                $user->id,
                $oldValues,
                $newValues,
                'User account approved by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'User account approved successfully',
                'data' => $user->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve user account',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Ban user account
     */
    public function ban(Request $request, User $user): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'reason' => 'required|string|max:500',
                'duration' => 'required|in:temporary,permanent',
                'banned_until' => 'required_if:duration,temporary|date|after:now',
                'admin_notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $oldValues = $user->toArray();
            
            // Update user status
            $user->update([
                'is_active' => false,
                'banned_at' => now(),
                'ban_reason' => $request->reason,
                'banned_until' => $request->duration === 'temporary' ? $request->banned_until : null,
            ]);

            $newValues = $user->fresh()->toArray();

            // Create ban history record
            $adminUser = $request->get('admin_user');
            if ($adminUser) {
                DB::table('ban_history')->insert([
                    'user_id' => $user->id,
                    'banned_by' => $adminUser->id,
                    'action' => 'banned',
                    'reason' => $request->reason,
                    'duration' => $request->duration,
                    'banned_until' => $request->banned_until,
                    'admin_notes' => $request->admin_notes,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Log the ban action
            $this->logAuditAction(
                'ban',
                'User',
                $user->id,
                $oldValues,
                $newValues,
                "User banned by admin. Reason: {$request->reason}"
            );

            return response()->json([
                'success' => true,
                'message' => 'User banned successfully',
                'data' => $user->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to ban user',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Unban user account
     */
    public function unban(User $user): JsonResponse
    {
        try {
            if (!$user->banned_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not banned',
                ], 400);
            }

            $oldValues = $user->toArray();
            
            // Update user status
            $user->update([
                'is_active' => true,
                'banned_at' => null,
                'ban_reason' => null,
                'banned_until' => null,
            ]);

            $newValues = $user->fresh()->toArray();

            // Update ban history record
            $adminUser = request()->get('admin_user');
            if ($adminUser) {
                DB::table('ban_history')
                    ->where('user_id', $user->id)
                    ->where('is_active', true)
                    ->update([
                        'action' => 'unbanned',
                        'is_active' => false,
                        'updated_at' => now(),
                    ]);
            }

            // Log the unban action
            $this->logAuditAction(
                'unban',
                'User',
                $user->id,
                $oldValues,
                $newValues,
                'User unbanned by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'User unbanned successfully',
                'data' => $user->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to unban user',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
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
            // Log error but don't fail the main operation
            \Log::error('Failed to create audit log: ' . $e->getMessage());
        }
    }
}


