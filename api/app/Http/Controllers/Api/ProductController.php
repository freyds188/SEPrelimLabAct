<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['weaver', 'weaver.user', 'media']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            // Default to active products only
            $query->active();
        }

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by tribe
        if ($request->has('tribe')) {
            $query->byTribe($request->tribe);
        }

        // Filter by technique
        if ($request->has('technique')) {
            $query->byTechnique($request->technique);
        }

        // Filter by material
        if ($request->has('material')) {
            $query->byMaterial($request->material);
        }

        // Filter by color
        if ($request->has('color')) {
            $query->byColor($request->color);
        }

        // Filter by origin region
        if ($request->has('origin_region')) {
            $query->byOriginRegion($request->origin_region);
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Filter by in stock
        if ($request->boolean('in_stock')) {
            $query->inStock();
        }

        // Filter by availability
        if ($request->has('availability')) {
            switch ($request->availability) {
                case 'in_stock':
                    $query->inStock();
                    break;
                case 'low_stock':
                    $query->where('stock_quantity', '>', 0)
                          ->where('stock_quantity', '<=', 10);
                    break;
                case 'out_of_stock':
                    $query->where('stock_quantity', 0);
                    break;
            }
        }

        // Filter by handmade
        if ($request->boolean('handmade')) {
            $query->handmade();
        }

        // Filter by weaver
        if ($request->has('weaver_id')) {
            $query->where('weaver_id', $request->weaver_id);
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Weight range filter
        if ($request->has('min_weight')) {
            $query->where('weight_grams', '>=', $request->min_weight);
        }
        if ($request->has('max_weight')) {
            $query->where('weight_grams', '<=', $request->max_weight);
        }

        // Search by name, description, or tags
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%")
                  ->orWhere('material', 'like', "%{$search}%")
                  ->orWhere('technique', 'like', "%{$search}%");
            });
        }

        // Sort by
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        // Validate sort fields
        $allowedSortFields = [
            'name', 'price', 'created_at', 'updated_at', 'views_count', 
            'sales_count', 'rating', 'stock_quantity'
        ];
        
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }
        
        $query->orderBy($sortBy, $sortOrder);

        $perPage = min($request->get('per_page', 15), 50); // Max 50 per page
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load(['weaver', 'weaver.user', 'media']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        $product->load(['weaver', 'weaver.user', 'media']);
        
        // Increment views count
        $product->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product->fresh()->load(['weaver', 'weaver.user', 'media']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Get featured products.
     */
    public function featured(): JsonResponse
    {
        $products = Product::featured()
            ->active()
            ->inStock()
            ->with(['weaver', 'weaver.user', 'media'])
            ->take(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Get products by category.
     */
    public function byCategory(string $category): JsonResponse
    {
        $products = Product::byCategory($category)
            ->active()
            ->with(['weaver', 'weaver.user', 'media'])
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * Get filter options for the catalog.
     */
    public function filters(): JsonResponse
    {
        $filters = [
            'categories' => Product::active()->distinct()->pluck('category')->filter()->values(),
            'tribes' => Product::active()->distinct()->pluck('tribe')->filter()->values(),
            'techniques' => Product::active()->distinct()->pluck('technique')->filter()->values(),
            'materials' => Product::active()->distinct()->pluck('material')->filter()->values(),
            'colors' => Product::active()->distinct()->pluck('color')->filter()->values(),
            'origin_regions' => Product::active()->distinct()->pluck('origin_region')->filter()->values(),
            'price_range' => [
                'min' => Product::active()->min('price') ?? 0,
                'max' => Product::active()->max('price') ?? 10000,
            ],
            'weight_range' => [
                'min' => Product::active()->min('weight_grams') ?? 0,
                'max' => Product::active()->max('weight_grams') ?? 5000,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $filters,
        ]);
    }

    /**
     * Get related products.
     */
    public function related(Product $product): JsonResponse
    {
        $related = Product::where('id', '!=', $product->id)
            ->where(function ($query) use ($product) {
                $query->where('category', $product->category)
                      ->orWhere('tribe', $product->tribe)
                      ->orWhere('technique', $product->technique)
                      ->orWhere('material', $product->material);
            })
            ->active()
            ->inStock()
            ->with(['weaver', 'weaver.user', 'media'])
            ->take(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $related,
        ]);
    }
}
