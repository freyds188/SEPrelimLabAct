<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['items.product', 'items.weaver'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|array',
            'shipping_address.street' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.state' => 'required|string|max:100',
            'shipping_address.postal_code' => 'required|string|max:20',
            'shipping_address.country' => 'required|string|max:100',
            'billing_address' => 'required|array',
            'billing_address.street' => 'required|string|max:255',
            'billing_address.city' => 'required|string|max:100',
            'billing_address.state' => 'required|string|max:100',
            'billing_address.postal_code' => 'required|string|max:20',
            'billing_address.country' => 'required|string|max:100',
            'shipping_method' => 'required|string|max:100',
            'shipping_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Validate stock availability
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                if (!$product || $product->stock_quantity < $item['quantity']) {
                    return response()->json([
                        'success' => false,
                        'message' => "Insufficient stock for product: {$product->name}"
                    ], 400);
                }
            }

            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => auth()->id(),
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
                'shipping_method' => $request->shipping_method,
                'shipping_amount' => $request->shipping_amount,
                'notes' => $request->notes,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            // Create order items and update stock
            $subtotal = 0;
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                
                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'weaver_id' => $product->weaver_id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'total_amount' => $product->price * $item['quantity'],
                    'product_data' => [
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'image' => $product->main_image_url,
                        'category' => $product->category,
                        'weaver_name' => $product->weaver->name ?? 'Unknown',
                    ],
                ]);

                // Update stock
                $product->decrement('stock_quantity', $item['quantity']);
                
                $subtotal += $product->price * $item['quantity'];
            }

            // Calculate totals
            $order->subtotal_amount = $subtotal;
            $order->tax_amount = $subtotal * 0.12; // 12% VAT
            $order->final_amount = $subtotal + $order->tax_amount + $order->shipping_amount;
            $order->total_amount = $order->final_amount;
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order->load(['items.product', 'items.weaver']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order): JsonResponse
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->load(['items.product', 'items.weaver']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Get shipping options.
     */
    public function shippingOptions(): JsonResponse
    {
        $shippingOptions = [
            [
                'id' => 'standard',
                'name' => 'Standard Shipping',
                'description' => '5-7 business days',
                'price' => 150.00,
                'carrier' => 'LBC Express',
            ],
            [
                'id' => 'express',
                'name' => 'Express Shipping',
                'description' => '2-3 business days',
                'price' => 300.00,
                'carrier' => 'LBC Express',
            ],
            [
                'id' => 'premium',
                'name' => 'Premium Shipping',
                'description' => '1-2 business days',
                'price' => 500.00,
                'carrier' => 'LBC Express',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $shippingOptions,
        ]);
    }

    /**
     * Calculate order totals for checkout.
     */
    public function calculateTotals(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $subtotal = 0;
            $items = [];

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $itemTotal = $product->price * $item['quantity'];
                
                $items[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'total' => $itemTotal,
                    'image' => $product->main_image_url,
                ];
                
                $subtotal += $itemTotal;
            }

            // Get shipping cost
            $shippingOptions = [
                'standard' => 150.00,
                'express' => 300.00,
                'premium' => 500.00,
            ];

            $shippingAmount = $shippingOptions[$request->shipping_method] ?? 150.00;
            $taxAmount = $subtotal * 0.12; // 12% VAT
            $finalAmount = $subtotal + $taxAmount + $shippingAmount;

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $items,
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'shipping_amount' => $shippingAmount,
                    'final_amount' => $finalAmount,
                    'breakdown' => [
                        'subtotal' => number_format($subtotal, 2),
                        'tax' => number_format($taxAmount, 2),
                        'shipping' => number_format($shippingAmount, 2),
                        'total' => number_format($finalAmount, 2),
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to calculate totals: ' . $e->getMessage()
            ], 500);
        }
    }
}
