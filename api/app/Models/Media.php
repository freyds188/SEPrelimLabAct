<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'original_name',
        'mime_type',
        'extension',
        'path',
        'disk',
        'size',
        'alt_text',
        'caption',
        'metadata',
        'mediable_type',
        'mediable_id',
        'collection',
        'order',
        'optimized_paths', // New field for storing optimized image paths
        'exif_data', // New field for storing EXIF data
        'optimization_status', // New field for tracking optimization status
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
        'order' => 'integer',
        'optimized_paths' => 'array',
        'exif_data' => 'array',
    ];

    protected $appends = [
        'url'
    ];

    // Optimization status constants
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';

    // Image size constants
    const SIZE_THUMB = 'thumb';
    const SIZE_CARD = 'card';
    const SIZE_FULL = 'full';

    /**
     * Get the owning mediable model.
     */
    public function mediable()
    {
        return $this->morphTo();
    }

    /**
     * Scope a query to filter by collection.
     */
    public function scopeCollection($query, $collection)
    {
        return $query->where('collection', $collection);
    }

    /**
     * Scope a query to filter by mime type.
     */
    public function scopeByMimeType($query, $mimeType)
    {
        return $query->where('mime_type', $mimeType);
    }

    /**
     * Scope a query to filter by optimization status.
     */
    public function scopeByOptimizationStatus($query, $status)
    {
        return $query->where('optimization_status', $status);
    }

    /**
     * Get the full URL to the media file.
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }

    /**
     * Get the URL for a specific optimized size.
     */
    public function getOptimizedUrl($size = self::SIZE_FULL): string
    {
        if (!$this->optimized_paths || !isset($this->optimized_paths[$size])) {
            return $this->url; // Fallback to original
        }
        
        return asset('storage/' . $this->optimized_paths[$size]);
    }

    /**
     * Check if media is an image.
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if media is a video.
     */
    public function isVideo(): bool
    {
        return str_starts_with($this->mime_type, 'video/');
    }

    /**
     * Check if optimization is completed.
     */
    public function isOptimized(): bool
    {
        return $this->optimization_status === self::STATUS_COMPLETED;
    }

    /**
     * Get file size in human readable format.
     */
    public function getHumanSizeAttribute(): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $size = $this->size;
        $unit = 0;

        while ($size >= 1024 && $unit < count($units) - 1) {
            $size /= 1024;
            $unit++;
        }

        return round($size, 2) . ' ' . $units[$unit];
    }

    /**
     * Get image dimensions from metadata.
     */
    public function getDimensions(): ?array
    {
        if (!$this->metadata || !isset($this->metadata['width']) || !isset($this->metadata['height'])) {
            return null;
        }

        return [
            'width' => $this->metadata['width'],
            'height' => $this->metadata['height']
        ];
    }

    /**
     * Get optimized image dimensions for a specific size.
     */
    public function getOptimizedDimensions($size = self::SIZE_FULL): ?array
    {
        if (!$this->optimized_paths || !isset($this->optimized_paths[$size])) {
            return $this->getDimensions();
        }

        // This would typically be stored in metadata, but for now return null
        // In a full implementation, you'd store optimized dimensions in metadata
        return null;
    }
}
