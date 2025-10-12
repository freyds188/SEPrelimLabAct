<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'weaver_id',
        'seller_id',
        'name',
        'slug',
        'description',
        'price',
        'stock_quantity',
        'category',
        'tribe',
        'technique',
        'tags',
        'images',
        'main_image',
        'specifications',
        'care_instructions',
        'dimensions',
        'material',
        'color',
        'weight_grams',
        'status',
        'verification_status',
        'rejected_reason',
        'reviewed_by',
        'reviewed_at',
        'verified_by',
        'verified_at',
        'is_featured',
        'is_handmade',
        'origin_region',
        'views_count',
        'sales_count',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'tags' => 'array',
        'images' => 'array',
        'specifications' => 'array',
        'care_instructions' => 'array',
        'dimensions' => 'array',
        'is_featured' => 'boolean',
        'is_handmade' => 'boolean',
        'rating' => 'decimal:2',
    ];

    // Ensure computed accessors are included in API responses
    protected $appends = [
        'formatted_price',
        'stock_status',
        'main_image_url',
        'image_urls',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /**
     * Get the weaver that owns the product.
     */
    public function weaver()
    {
        return $this->belongsTo(Weaver::class);
    }

    /**
     * Get the seller (user) that created the product.
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the admin who verified the product.
     */
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the orders for the product.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the order items for the product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the media for the product.
     */
    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Scope a query to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where(function($q) {
            $q->where('status', 'active')
              ->orWhere(function($subQ) {
                  $subQ->where('status', 'approved')
                       ->where('verification_status', 'approved');
              });
        });
    }

    /**
     * Scope a query to only include pending products.
     */
    public function scopePending($query)
    {
        return $query->where('verification_status', 'pending');
    }

    /**
     * Scope a query to only include approved products.
     */
    public function scopeApproved($query)
    {
        return $query->where('verification_status', 'approved');
    }

    /**
     * Scope a query to only include rejected products.
     */
    public function scopeRejected($query)
    {
        return $query->where('verification_status', 'rejected');
    }

    /**
     * Scope a query to only include featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include products in stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to filter by tribe.
     */
    public function scopeByTribe($query, $tribe)
    {
        return $query->where('tribe', $tribe);
    }

    /**
     * Scope a query to filter by technique.
     */
    public function scopeByTechnique($query, $technique)
    {
        return $query->where('technique', $technique);
    }

    /**
     * Scope a query to filter by material.
     */
    public function scopeByMaterial($query, $material)
    {
        return $query->where('material', $material);
    }

    /**
     * Scope a query to filter by color.
     */
    public function scopeByColor($query, $color)
    {
        return $query->where('color', $color);
    }

    /**
     * Scope a query to filter by origin region.
     */
    public function scopeByOriginRegion($query, $region)
    {
        return $query->where('origin_region', $region);
    }

    /**
     * Scope a query to filter by price range.
     */
    public function scopeByPriceRange($query, $minPrice, $maxPrice)
    {
        return $query->whereBetween('price', [$minPrice, $maxPrice]);
    }

    /**
     * Scope a query to filter handmade products.
     */
    public function scopeHandmade($query)
    {
        return $query->where('is_handmade', true);
    }

    /**
     * Check if product is in stock.
     */
    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }

    /**
     * Get stock status text.
     */
    public function getStockStatusAttribute(): string
    {
        if ($this->stock_quantity > 10) {
            return 'In Stock';
        } elseif ($this->stock_quantity > 0) {
            return 'Low Stock';
        } else {
            return 'Out of Stock';
        }
    }

    /**
     * Get formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return '₱' . number_format($this->price ?? 0, 2);
    }

    /**
     * Get main image URL.
     */
    public function getMainImageUrlAttribute(): ?string
    {
        if ($this->main_image) {
            // Check if it's already a full URL
            if (filter_var($this->main_image, FILTER_VALIDATE_URL)) {
                return $this->main_image;
            }
            return asset('storage/' . $this->main_image);
        }
        
        // Fallback to first media item
        $firstMedia = $this->media()->first();
        if ($firstMedia) {
            return $firstMedia->getOptimizedUrl('card');
        }
        
        return null;
    }

    /**
     * Get all image URLs.
     */
    public function getImageUrlsAttribute(): array
    {
        $urls = [];
        
        // Add main image
        if ($this->main_image) {
            // Check if it's already a full URL
            if (filter_var($this->main_image, FILTER_VALIDATE_URL)) {
                $urls[] = $this->main_image;
            } else {
                $urls[] = asset('storage/' . $this->main_image);
            }
        }
        
        // Add images from images array
        if ($this->images && is_array($this->images)) {
            foreach ($this->images as $image) {
                if (filter_var($image, FILTER_VALIDATE_URL)) {
                    $urls[] = $image;
                } else {
                    $urls[] = asset('storage/' . $image);
                }
            }
        }
        
        // Add media images
        foreach ($this->media as $media) {
            $urls[] = $media->getOptimizedUrl('full');
        }
        
        return array_unique($urls);
    }

    /**
     * Increment views count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Get route key name for slug-based routing.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
