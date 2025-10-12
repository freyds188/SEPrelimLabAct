<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Weaver;
use App\Models\AdminAuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    /**
     * Get all products with admin filters
     */
    public function getProducts(Request $request): JsonResponse
    {
        try {
            $query = Product::with(['weaver', 'media']);

            // Apply filters
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('tribe', 'like', "%{$search}%");
                });
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('tribe')) {
                $query->where('tribe', $request->tribe);
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('weaver_id')) {
                $query->where('weaver_id', $request->weaver_id);
            }

            if ($request->has('stock_status')) {
                $stockStatus = $request->stock_status;
                if ($stockStatus === 'in_stock') {
                    $query->where('stock_quantity', '>', 0);
                } elseif ($stockStatus === 'out_of_stock') {
                    $query->where('stock_quantity', 0);
                } elseif ($stockStatus === 'low_stock') {
                    $query->where('stock_quantity', '>', 0)
                          ->where('stock_quantity', '<=', 10);
                }
            }

            if ($request->has('price_range')) {
                $priceRange = $request->price_range;
                if (isset($priceRange['min'])) {
                    $query->where('price', '>=', $priceRange['min']);
                }
                if (isset($priceRange['max'])) {
                    $query->where('price', '<=', $priceRange['max']);
                }
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $products = $query->paginate($perPage);

            // Add additional data
            $products->getCollection()->transform(function ($product) {
                $product->weaver_name = $product->weaver ? $product->weaver->name : 'Unknown';
                $product->stock_status = $this->getStockStatus($product->stock_quantity);
                $product->approval_status = $product->status;
                return $product;
            });

            return response()->json([
                'success' => true,
                'data' => $products,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve products',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Create new product
     */
    public function createProduct(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'stock_quantity' => 'required|integer|min:0',
                'category' => 'required|string|max:100',
                'tribe' => 'nullable|string|max:100',
                'origin_region' => 'nullable|string|max:100',
                'weaver_id' => 'nullable|exists:weavers,id',
                'is_active' => 'boolean',
                'status' => 'in:active,inactive,out_of_stock',
                'tags' => 'nullable|array',
                'tags.*' => 'string|max:50',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Prepare product data
            $productData = $request->only([
                'name', 'description', 'price', 'stock_quantity', 'category',
                'tribe', 'origin_region', 'weaver_id', 'is_active', 'status', 'tags'
            ]);

            // Set defaults for admin-created products
            $productData['is_active'] = $productData['is_active'] ?? true;
            $productData['status'] = $productData['status'] ?? 'active';
            $productData['tribe'] = $productData['tribe'] ?? 'General';
            $productData['origin_region'] = $productData['origin_region'] ?? 'Cordillera';
            $productData['weaver_id'] = $productData['weaver_id'] ?? 1; // Default weaver or first available

            // Create the product
            $product = Product::create($productData);

            // Handle image upload
            if ($request->hasFile('image')) {
                try {
                    $image = $request->file('image');
                    
                    // Validate image
                    if (!$image->isValid()) {
                        throw new \Exception('Invalid image file');
                    }
                    
                    $imageName = time() . '_' . $product->id . '.' . $image->getClientOriginalExtension();
                    $imagePath = $image->storeAs('products', $imageName, 'public');
                    
                    if (!$imagePath) {
                        throw new \Exception('Failed to store image');
                    }
                    
                    // Update product with image path
                    $product->update(['main_image' => $imagePath]);
                    
                    \Log::info('Image uploaded successfully', [
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'image_name' => $imageName
                    ]);
                    
                } catch (\Exception $e) {
                    \Log::error('Image upload failed', [
                        'product_id' => $product->id,
                        'error' => $e->getMessage()
                    ]);
                    
                    // Continue without image - don't fail the entire product creation
                }
            }

            // Log the creation
            $this->logAuditAction(
                'create',
                'Product',
                $product->id,
                [],
                $product->toArray(),
                'Product created by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product->load(['weaver', 'media']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update product
     */
    public function updateProduct(Request $request, Product $product): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'stock_quantity' => 'sometimes|integer|min:0',
                'category' => 'sometimes|string|max:100',
                'tribe' => 'sometimes|string|max:100',
                'origin_region' => 'sometimes|string|max:100',
                'weaver_id' => 'sometimes|exists:weavers,id',
                'is_active' => 'sometimes|boolean',
                // Align with products table enum
                'status' => 'sometimes|in:active,inactive,out_of_stock',
                'tags' => 'nullable|array',
                'tags.*' => 'string|max:50',
                'featured_image' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $oldValues = $product->toArray();
            // Only allow updating known, safe fields
            $updateData = $request->only([
                'name',
                'description',
                'price',
                'stock_quantity',
                'category',
                'tribe',
                'origin_region',
                'weaver_id',
                'is_active',
                'status',
                'tags',
                'featured_image',
                'images',
            ]);
            $product->update($updateData);
            $newValues = $product->fresh()->toArray();

            // Log the update
            $this->logAuditAction(
                'update',
                'Product',
                $product->id,
                $oldValues,
                $newValues,
                'Product updated by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product->fresh()->load(['weaver', 'media']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete product
     */
    public function deleteProduct(Product $product): JsonResponse
    {
        try {
            // Check if product has active orders
            if ($product->orderItems()->whereHas('order', function ($q) {
                $q->whereNotIn('status', ['cancelled', 'refunded']);
            })->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete product with active orders',
                ], 400);
            }

            $oldValues = $product->toArray();
            $product->delete();

            // Log the deletion
            $this->logAuditAction(
                'delete',
                'Product',
                $product->id,
                $oldValues,
                [],
                'Product deleted by admin'
            );

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Approve product
     */
    public function approveProduct(Request $request, Product $product): JsonResponse
    {
        try {
            // Check if product exists
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                ], 404);
            }

            // Check if already approved
            if ($product->status === 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is already approved',
                ], 400);
            }

            // Get admin user ID safely
            $adminUserId = null;
            $adminUser = $request->get('admin_user');
            if ($adminUser && isset($adminUser->id)) {
                $adminUserId = $adminUser->id;
            }

            // Update product status
            $product->update([
                'status' => 'approved',
                'verified_at' => now(),
                'verified_by' => $adminUserId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product approved successfully',
                'data' => $product->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve product',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Reject product
     */
    public function rejectProduct(Request $request, Product $product): JsonResponse
    {
        try {
            // Check if product exists
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                ], 404);
            }

            // Check if already rejected
            if ($product->status === 'rejected') {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is already rejected',
                ], 400);
            }

            $reason = $request->input('reason', 'No reason provided');

            // Get admin user ID safely
            $adminUserId = null;
            $adminUser = $request->get('admin_user');
            if ($adminUser && isset($adminUser->id)) {
                $adminUserId = $adminUser->id;
            }

            // Update product status
            $product->update([
                'status' => 'rejected',
                'reviewed_at' => now(),
                'reviewed_by' => $adminUserId,
                'rejected_reason' => $reason,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product rejected successfully',
                'data' => $product->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject product',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Bulk upload products
     */
    public function bulkUpload(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'products' => 'required|array|min:1|max:100',
                'products.*.name' => 'required|string|max:255',
                'products.*.description' => 'required|string',
                'products.*.price' => 'required|numeric|min:0',
                'products.*.stock_quantity' => 'required|integer|min:0',
                'products.*.category' => 'required|string|max:100',
                'products.*.tribe' => 'required|string|max:100',
                'products.*.origin_region' => 'required|string|max:100',
                'products.*.weaver_id' => 'required|exists:weavers,id',
                'products.*.tags' => 'nullable|array',
                'products.*.tags.*' => 'string|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $products = $request->products;
            $createdProducts = [];
            $errors = [];

            DB::beginTransaction();

            try {
                foreach ($products as $index => $productData) {
                    try {
                        $product = Product::create(array_merge($productData, [
                            'status' => 'pending',
                            'is_active' => false,
                        ]));

                        $createdProducts[] = $product;

                        // Log the creation
                        $this->logAuditAction(
                            'create',
                            'Product',
                            $product->id,
                            [],
                            $product->toArray(),
                            'Product created via bulk upload by admin'
                        );

                    } catch (\Exception $e) {
                        $errors[] = [
                            'index' => $index,
                            'error' => $e->getMessage(),
                            'data' => $productData,
                        ];
                    }
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Bulk upload completed',
                    'data' => [
                        'created_count' => count($createdProducts),
                        'error_count' => count($errors),
                        'created_products' => $createdProducts,
                        'errors' => $errors,
                    ],
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process bulk upload',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get product statistics
     */
    public function getProductStats(): JsonResponse
    {
        try {
            $stats = [
                'total_products' => Product::count(),
                'active_products' => Product::where('is_active', true)->count(),
                'pending_approval' => Product::where('status', 'pending')->count(),
                'approved_products' => Product::where('status', 'approved')->count(),
                'rejected_products' => Product::where('status', 'rejected')->count(),
                'out_of_stock' => Product::where('stock_quantity', 0)->count(),
                'low_stock' => Product::where('stock_quantity', '>', 0)
                    ->where('stock_quantity', '<=', 10)
                    ->count(),
                'by_category' => Product::selectRaw('category, COUNT(*) as count')
                    ->groupBy('category')
                    ->get(),
                'by_tribe' => Product::selectRaw('tribe, COUNT(*) as count')
                    ->groupBy('tribe')
                    ->get(),
                'by_status' => Product::selectRaw('status, COUNT(*) as count')
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
                'message' => 'Failed to retrieve product statistics',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get stock status
     */
    private function getStockStatus(int $quantity): string
    {
        if ($quantity === 0) {
            return 'out_of_stock';
        } elseif ($quantity <= 10) {
            return 'low_stock';
        } else {
            return 'in_stock';
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


