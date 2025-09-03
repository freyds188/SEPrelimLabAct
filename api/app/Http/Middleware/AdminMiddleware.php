<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\AdminUser;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission = null): Response
    {
        try {
            // Check if user is authenticated
            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            // Check if user has admin privileges
            $adminUser = AdminUser::where('user_id', $request->user()->id)
                ->where('is_active', true)
                ->with(['role'])
                ->first();

            if (!$adminUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                ], 403);
            }

            // Check specific permission if provided
            if ($permission && !$adminUser->hasPermission($permission)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Insufficient permissions.',
                    'required_permission' => $permission,
                    'user_role' => $adminUser->role->display_name,
                ], 403);
            }

            // Add admin user to request for use in controllers
            $request->merge(['admin_user' => $adminUser]);

            return $next($request);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Middleware error',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}


