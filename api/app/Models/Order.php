<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'customer_email',
        'customer_phone',
        'customer_name',
        'total_amount',
        'subtotal_amount',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'final_amount',
        'status',
        'payment_status',
        'payment_method',
        'transaction_id',
        'shipping_address',
        'billing_address',
        'shipping_method',
        'shipping_carrier',
        'tracking_number',
        'shipping_options',
        'notes',
        'paid_at',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'subtotal_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'shipping_options' => 'array',
        'paid_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order items for this order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the products for this order.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_items');
    }

    /**
     * Get the weavers for this order.
     */
    public function weavers()
    {
        return $this->belongsToMany(Weaver::class, 'order_items');
    }

    /**
     * Scope a query to only include pending orders.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include completed orders.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'delivered');
    }

    /**
     * Scope a query to only include paid orders.
     */
    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    /**
     * Generate order number.
     */
    public static function generateOrderNumber(): string
    {
        return 'ORD-' . date('Ymd') . '-' . strtoupper(uniqid());
    }

    /**
     * Check if order is paid.
     */
    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Check if order is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'delivered';
    }

    /**
     * Calculate order totals.
     */
    public function calculateTotals(): void
    {
        $subtotal = $this->items->sum('total_amount');
        $this->subtotal_amount = $subtotal;
        
        // Calculate tax (12% VAT for Philippines)
        $this->tax_amount = $subtotal * 0.12;
        
        // Final amount
        $this->final_amount = $subtotal + $this->tax_amount + $this->shipping_amount - $this->discount_amount;
        
        $this->save();
    }

    /**
     * Get formatted total amount.
     */
    public function getFormattedTotalAmountAttribute(): string
    {
        return '₱' . number_format($this->total_amount, 2);
    }

    /**
     * Get formatted final amount.
     */
    public function getFormattedFinalAmountAttribute(): string
    {
        return '₱' . number_format($this->final_amount, 2);
    }

    /**
     * Get formatted subtotal amount.
     */
    public function getFormattedSubtotalAmountAttribute(): string
    {
        return '₱' . number_format($this->subtotal_amount, 2);
    }

    /**
     * Get formatted shipping amount.
     */
    public function getFormattedShippingAmountAttribute(): string
    {
        return '₱' . number_format($this->shipping_amount, 2);
    }

    /**
     * Get formatted tax amount.
     */
    public function getFormattedTaxAmountAttribute(): string
    {
        return '₱' . number_format($this->tax_amount, 2);
    }

    /**
     * Get order status badge color.
     */
    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'confirmed' => 'bg-blue-100 text-blue-800',
            'processing' => 'bg-purple-100 text-purple-800',
            'shipped' => 'bg-indigo-100 text-indigo-800',
            'delivered' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
            'refunded' => 'bg-gray-100 text-gray-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get payment status badge color.
     */
    public function getPaymentStatusBadgeColorAttribute(): string
    {
        return match($this->payment_status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'paid' => 'bg-green-100 text-green-800',
            'failed' => 'bg-red-100 text-red-800',
            'refunded' => 'bg-gray-100 text-gray-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }
}
