<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Weaver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'bio',
        'location',
        'phone',
        'email',
        'profile_image',
        'skills',
        'specialties',
        'experience_years',
        'story',
        'rating',
        'total_orders',
        'is_featured',
        'is_verified',
        'status',
    ];

    protected $casts = [
        'skills' => 'array',
        'specialties' => 'array',
        'rating' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_verified' => 'boolean',
    ];

    /**
     * Get the user that owns the weaver profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the products for the weaver.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the orders for the weaver.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the payouts for the weaver.
     */
    public function payouts()
    {
        return $this->hasMany(Payout::class);
    }

    /**
     * Get the stories for the weaver.
     */
    public function stories()
    {
        return $this->hasMany(Story::class);
    }

    /**
     * Get the media for the weaver.
     */
    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Scope a query to only include active weavers.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include featured weavers.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include verified weavers.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }
}
