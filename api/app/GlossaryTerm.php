<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlossaryTerm extends Model
{
    use HasFactory;

    protected $fillable = [
        'term',
        'definition',
        'category',
        'examples',
        'related_terms',
        'image',
        'is_featured',
        'views_count',
        'status',
    ];

    protected $casts = [
        'examples' => 'array',
        'related_terms' => 'array',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the media for the glossary term.
     */
    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Scope a query to only include published terms.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope a query to only include featured terms.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to search terms.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('term', 'like', "%{$search}%")
                    ->orWhere('definition', 'like', "%{$search}%");
    }

    /**
     * Increment views count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Check if term is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }
}
