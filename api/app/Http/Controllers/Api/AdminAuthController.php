<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    /**
     * Admin login endpoint
     */
    public function login(Request $request): JsonResponse
    {
        // Rate limiting for admin login attempts
        $throttleKey = 'admin_login:' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'success' => false,
                'message' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }

        // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Attempt to authenticate the user
            $user = User::where('email', $request->email)->first();
            
            if (!$user || !Hash::check($request->password, $user->password)) {
                RateLimiter::hit($throttleKey);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials',
                ], 401);
            }

            // Check if user has admin privileges
            $adminUser = AdminUser::where('user_id', $user->id)
                ->where('is_active', true)
                ->with(['role'])
                ->first();

            if (!$adminUser) {
                RateLimiter::hit($throttleKey);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                ], 403);
            }

            // Generate admin token
            $token = $user->createToken('admin-token', ['admin'])->plainTextToken;

            // Record successful login
            $adminUser->recordLogin($request->ip() ?? '127.0.0.1', $request->userAgent() ?? 'CLI Test');

            // Clear rate limiter on successful login
            RateLimiter::clear($throttleKey);

            return response()->json([
                'success' => true,
                'message' => 'Admin login successful',
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'admin_id' => $adminUser->admin_id,
                        'role' => [
                            'id' => $adminUser->role->id,
                            'name' => $adminUser->role->name,
                            'display_name' => $adminUser->role->display_name,
                            'permissions' => $adminUser->role->permissions,
                        ],
                        'department' => $adminUser->department,
                        'is_super_admin' => $adminUser->is_super_admin,
                        'last_login_at' => $adminUser->last_login_at,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            RateLimiter::hit($throttleKey);
            
            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Admin logout endpoint
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // Revoke the current token
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Admin logout successful',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get current admin user information
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $adminUser = AdminUser::where('user_id', $user->id)
                ->where('is_active', true)
                ->with(['role'])
                ->first();

            if (!$adminUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin user not found or inactive',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'admin_id' => $adminUser->admin_id,
                        'role' => [
                            'id' => $adminUser->role->id,
                            'name' => $adminUser->role->name,
                            'display_name' => $adminUser->role->display_name,
                            'permissions' => $adminUser->role->permissions,
                        ],
                        'department' => $adminUser->department,
                        'is_super_admin' => $adminUser->is_super_admin,
                        'last_login_at' => $adminUser->last_login_at,
                        'permissions' => $adminUser->role->permissions ?? [],
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve admin user information',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Refresh admin token
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Revoke current token
            $request->user()->currentAccessToken()->delete();
            
            // Generate new token
            $token = $user->createToken('admin-token', ['admin'])->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'data' => [
                    'token' => $token,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token refresh failed',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Check if user has specific permission
     */
    public function checkPermission(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'permission' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = $request->user();
            $adminUser = AdminUser::where('user_id', $user->id)
                ->where('is_active', true)
                ->with(['role'])
                ->first();

            if (!$adminUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin user not found or inactive',
                ], 404);
            }

            $hasPermission = $adminUser->hasPermission($request->permission);

            return response()->json([
                'success' => true,
                'data' => [
                    'permission' => $request->permission,
                    'has_permission' => $hasPermission,
                    'user_role' => $adminUser->role->name,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Permission check failed',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
