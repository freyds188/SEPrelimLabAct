<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Story extends Model
{
    use HasFactory;

    protected $fillable = [
        'weaver_id',
        'title',
        'type',
        'content',
        'blocks',
        'slug',
        'featured_image',
        'images',
        'status',
        'is_featured',
        'views_count',
        'likes_count',
        'tags',
        'language_tags',
        'published_at',
        'scheduled_at',
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
        'language_tags' => 'array',
        'blocks' => 'array',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'scheduled_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($story) {
            if (empty($story->slug)) {
                $story->slug = Str::slug($story->title);
            }
        });
    }

    /**
     * Get the weaver that owns the story.
     */
    public function weaver()
    {
        return $this->belongsTo(Weaver::class);
    }

    /**
     * Get the media for the story.
     */
    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Scope a query to only include published stories.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope a query to only include featured stories.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include draft stories.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope a query to only include scheduled stories.
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'draft')
                    ->whereNotNull('scheduled_at')
                    ->where('scheduled_at', '<=', now());
    }

    /**
     * Scope a query by story type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query by language tag.
     */
    public function scopeWithLanguage($query, $language)
    {
        return $query->whereJsonContains('language_tags', $language);
    }

    /**
     * Increment views count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Increment likes count.
     */
    public function incrementLikes(): void
    {
        $this->increment('likes_count');
    }

    /**
     * Check if story is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    /**
     * Check if story is scheduled.
     */
    public function isScheduled(): bool
    {
        return $this->status === 'draft' && $this->scheduled_at && $this->scheduled_at <= now();
    }

    /**
     * Publish the story.
     */
    public function publish(): void
    {
        $this->update([
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Unpublish the story.
     */
    public function unpublish(): void
    {
        $this->update([
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Get the story type options.
     */
    public static function getTypeOptions(): array
    {
        return [
            'photo_essay' => 'Photo Essay',
            'oral_history' => 'Oral History',
            'timeline' => 'Timeline',
            'map' => 'Map',
        ];
    }
}
