# Checkout System Implementation

## Overview

This document outlines the implementation of a comprehensive end-to-end checkout system for the Traditional Filipino Weaving Platform. The system includes client-side cart management, server-side order processing, and a complete checkout flow.

## Features

### Backend Features
- **Multi-item Order Support**: Orders can contain multiple products from different weavers
- **Real-time Total Calculation**: Dynamic calculation of subtotal, tax, shipping, and final amount
- **Stock Validation**: Ensures products are in stock before order creation
- **Database Transactions**: Ensures data integrity during order processing
- **Shipping Options**: Static shipping methods with pricing
- **Order Status Tracking**: Comprehensive order and payment status management

### Frontend Features
- **Client-side Cart**: Local storage-based cart with React Context
- **Checkout Flow**: Complete checkout process with address forms and shipping selection
- **Order Management**: View order history and order details
- **Real-time Updates**: Live total calculation and form validation
- **Responsive Design**: Mobile-friendly checkout interface

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    order_number VARCHAR UNIQUE,
    user_id BIGINT,
    customer_email VARCHAR,
    customer_phone VARCHAR,
    customer_name VARCHAR,
    total_amount DECIMAL(10,2),
    subtotal_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    shipping_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded'),
    payment_method VARCHAR,
    transaction_id VARCHAR,
    shipping_address JSON,
    billing_address JSON,
    shipping_method VARCHAR,
    shipping_carrier VARCHAR,
    tracking_number VARCHAR,
    shipping_options JSON,
    notes TEXT,
    paid_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    weaver_id BIGINT,
    quantity INTEGER,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    product_data JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## API Endpoints

### Order Management
- `GET /api/v1/orders` - List user's orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/{id}` - Get order details
- `GET /api/v1/orders/shipping-options` - Get shipping options
- `POST /api/v1/orders/calculate-totals` - Calculate order totals

### Request/Response Examples

#### Create Order
```json
POST /api/v1/orders
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "shipping_address": {
    "street": "123 Main St",
    "city": "Manila",
    "state": "Metro Manila",
    "postal_code": "1000",
    "country": "Philippines"
  },
  "billing_address": {
    "street": "123 Main St",
    "city": "Manila",
    "state": "Metro Manila",
    "postal_code": "1000",
    "country": "Philippines"
  },
  "shipping_method": "standard",
  "shipping_amount": 150.00,
  "notes": "Please deliver in the morning"
}
```

#### Order Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-2024-001",
    "customer_name": "John Doe",
    "status": "pending",
    "payment_status": "pending",
    "final_amount": 1250.00,
    "items": [...],
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## Frontend Components

### Cart Context (`frontend/lib/cart-context.tsx`)
- Manages cart state using React Context
- Persists cart data to localStorage
- Provides cart operations (add, remove, update, clear)

### Cart Item (`frontend/components/ui/CartItem.tsx`)
- Displays individual cart items
- Quantity controls and remove functionality
- Product image and details

### Cart Page (`frontend/app/[locale]/cart/page.tsx`)
- Shopping cart interface
- Order summary with totals
- Navigation to checkout

### Checkout Page (`frontend/app/[locale]/checkout/page.tsx`)
- Complete checkout form
- Customer information
- Shipping and billing addresses
- Shipping method selection
- Real-time total calculation
- Order placement

### Order Pages
- **Orders List** (`frontend/app/[locale]/orders/page.tsx`): View all orders
- **Order Detail** (`frontend/app/[locale]/orders/[id]/page.tsx`): View specific order

## Key Features Implementation

### 1. Cart Management
```typescript
// Cart Context provides global cart state
const { addItem, removeItem, updateQuantity, clearCart } = useCart();

// Add item to cart
addItem({
  product_id: product.id,
  name: product.name,
  price: product.price,
  image: product.main_image_url,
  weaver_name: product.weaver.name,
  quantity: 1
});
```

### 2. Checkout Flow
1. **Cart Review**: User reviews items in cart
2. **Customer Info**: Name, email, phone
3. **Addresses**: Shipping and billing addresses
4. **Shipping**: Select shipping method
5. **Review**: Final order summary
6. **Place Order**: Submit order to backend

### 3. Order Processing
```php
// Backend order creation with validation
public function store(Request $request): JsonResponse
{
    // Validate request data
    $validator = Validator::make($request->all(), [
        'items' => 'required|array|min:1',
        'customer_name' => 'required|string|max:255',
        // ... more validation rules
    ]);

    try {
        DB::beginTransaction();
        
        // Check stock availability
        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            if ($product->stock_quantity < $item['quantity']) {
                throw new \Exception("Insufficient stock for {$product->name}");
            }
        }
        
        // Create order
        $order = Order::create([
            'order_number' => $this->generateOrderNumber(),
            'user_id' => auth()->id(),
            // ... order data
        ]);
        
        // Create order items
        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                // ... item data
            ]);
            
            // Update product stock
            $product = Product::find($item['product_id']);
            $product->decrement('stock_quantity', $item['quantity']);
        }
        
        // Calculate totals
        $order->calculateTotals();
        
        DB::commit();
        
        return response()->json([
            'success' => true,
            'data' => $order->load('items'),
            'message' => 'Order created successfully'
        ], 201);
        
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
```

### 4. Real-time Total Calculation
```php
public function calculateTotals(Request $request): JsonResponse
{
    $subtotal = 0;
    $items = $request->items;
    
    foreach ($items as $item) {
        $product = Product::find($item['product_id']);
        $subtotal += $product->price * $item['quantity'];
    }
    
    $tax = $subtotal * 0.12; // 12% VAT
    $shipping = $this->getShippingCost($request->shipping_method);
    $total = $subtotal + $tax + $shipping;
    
    return response()->json([
        'success' => true,
        'data' => [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'breakdown' => [
                'subtotal' => number_format($subtotal, 2),
                'tax' => number_format($tax, 2),
                'shipping' => number_format($shipping, 2),
                'total' => number_format($total, 2)
            ]
        ]
    ]);
}
```

## Shipping Options

Currently implemented as static options:
- **Standard Shipping**: ₱150.00 (3-5 business days)
- **Express Shipping**: ₱300.00 (1-2 business days)
- **Overnight**: ₱500.00 (Next day delivery)

## Order Status Flow

1. **Pending**: Order created, awaiting confirmation
2. **Confirmed**: Order confirmed by admin
3. **Processing**: Order being prepared
4. **Shipped**: Order shipped with tracking
5. **Delivered**: Order delivered to customer
6. **Cancelled**: Order cancelled
7. **Refunded**: Order refunded

## Payment Status

1. **Pending**: Payment not yet processed
2. **Paid**: Payment received
3. **Failed**: Payment failed
4. **Refunded**: Payment refunded

## Security Considerations

1. **Input Validation**: All user inputs are validated on both frontend and backend
2. **Stock Validation**: Prevents overselling by checking stock before order creation
3. **Database Transactions**: Ensures data consistency
4. **Authentication**: Orders are associated with authenticated users
5. **Authorization**: Users can only view their own orders

## Error Handling

### Frontend
- Form validation with real-time feedback
- Toast notifications for success/error states
- Loading states during API calls
- Graceful error handling for network issues

### Backend
- Comprehensive validation with detailed error messages
- Database transaction rollback on errors
- Stock validation with specific error messages
- Proper HTTP status codes

## Testing Considerations

1. **Cart Functionality**: Test add, remove, update, clear operations
2. **Checkout Flow**: Test complete checkout process
3. **Stock Management**: Test stock validation and updates
4. **Order Creation**: Test order creation with various scenarios
5. **Error Handling**: Test error scenarios and edge cases

## Future Enhancements

1. **Payment Integration**: Integrate with payment gateways (PayPal, Stripe)
2. **Email Notifications**: Send order confirmation and status update emails
3. **Inventory Management**: Advanced inventory tracking and alerts
4. **Shipping Integration**: Real-time shipping rates and tracking
5. **Order Analytics**: Order analytics and reporting
6. **Return/Refund System**: Handle returns and refunds
7. **Discount System**: Coupon codes and promotional discounts

## File Structure

```
api/
├── app/
│   ├── Models/
│   │   ├── Order.php (updated)
│   │   └── OrderItem.php (new)
│   ├── Http/Controllers/Api/
│   │   └── OrderController.php (new)
│   └── Jobs/
├── database/migrations/
│   └── 2025_08_26_170507_recreate_orders_table_for_checkout.php (new)
└── routes/
    └── api.php (updated)

frontend/
├── app/[locale]/
│   ├── cart/
│   │   └── page.tsx (new)
│   ├── checkout/
│   │   └── page.tsx (new)
│   ├── orders/
│   │   ├── page.tsx (new)
│   │   └── [id]/page.tsx (new)
│   └── product/[slug]/page.tsx (updated)
├── components/ui/
│   └── CartItem.tsx (new)
└── lib/
    ├── api.ts (updated)
    └── cart-context.tsx (new)
```

## Usage Examples

### Adding to Cart
```typescript
// In product detail page
const { addItem } = useCart();

const handleAddToCart = () => {
  addItem({
    product_id: product.id,
    name: product.name,
    price: product.price,
    image: product.main_image_url,
    weaver_name: product.weaver.name,
    quantity: quantity
  });
  toast.success('Added to cart!');
};
```

### Checkout Process
```typescript
// In checkout page
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const orderData = {
    items: items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    })),
    ...formData,
    shipping_amount: orderTotals?.shipping_amount
  };
  
  const response = await apiService.createOrder(orderData);
  
  if (response.success) {
    toast.success('Order placed successfully!');
    clearCart();
    router.push(`/orders/${response.data.id}`);
  }
};
```

This checkout system provides a complete e-commerce solution with robust error handling, real-time calculations, and a smooth user experience.


