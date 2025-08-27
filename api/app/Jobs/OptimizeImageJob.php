<?php

namespace App\Jobs;

use App\Models\Media;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class OptimizeImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 minutes
    public $tries = 3;

    protected $media;

    /**
     * Create a new job instance.
     */
    public function __construct(Media $media)
    {
        $this->media = $media;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Check if GD extension is available
            if (!extension_loaded('gd')) {
                $this->media->update([
                    'optimization_status' => Media::STATUS_FAILED,
                ]);
                \Log::warning('Image optimization skipped - GD extension not available', [
                    'media_id' => $this->media->id,
                ]);
                return;
            }

            // Update status to processing
            $this->media->update(['optimization_status' => Media::STATUS_PROCESSING]);

            // Get the original image file
            $originalPath = Storage::disk('public')->path($this->media->path);
            
            if (!file_exists($originalPath)) {
                throw new \Exception('Original image file not found');
            }

            // Load the image
            $image = Image::make($originalPath);

            // Define optimization sizes
            $sizes = [
                Media::SIZE_THUMB => ['width' => 150, 'height' => 150],
                Media::SIZE_CARD => ['width' => 400, 'height' => 300],
                Media::SIZE_FULL => ['width' => 1200, 'height' => 800],
            ];

            $optimizedPaths = [];

            foreach ($sizes as $size => $dimensions) {
                $optimizedPath = $this->createOptimizedImage($image, $size, $dimensions);
                if ($optimizedPath) {
                    $optimizedPaths[$size] = $optimizedPath;
                }
            }

            // Update media record with optimized paths
            $this->media->update([
                'optimized_paths' => $optimizedPaths,
                'optimization_status' => Media::STATUS_COMPLETED,
            ]);

        } catch (\Exception $e) {
            // Update status to failed
            $this->media->update([
                'optimization_status' => Media::STATUS_FAILED,
            ]);

            // Log the error
            \Log::error('Image optimization failed for media ID ' . $this->media->id, [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Create an optimized image for a specific size.
     */
    private function createOptimizedImage($originalImage, string $size, array $dimensions): ?string
    {
        try {
            // Clone the original image to avoid modifying it
            $image = clone $originalImage;

            // Resize image while maintaining aspect ratio
            $image->resize($dimensions['width'], $dimensions['height'], function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize(); // Don't upscale if image is smaller
            });

            // Strip EXIF data for privacy (except for consented fields)
            $this->stripExifData($image);

            // Determine output format and quality
            $format = $this->getOptimalFormat($image);
            $quality = $this->getOptimalQuality($size);

            // Generate optimized filename
            $pathInfo = pathinfo($this->media->path);
            $optimizedFilename = $pathInfo['filename'] . '_' . $size . '.' . $format;
            $optimizedPath = $pathInfo['dirname'] . '/optimized/' . $optimizedFilename;

            // Ensure optimized directory exists
            $optimizedDir = Storage::disk('public')->path(dirname($optimizedPath));
            if (!is_dir($optimizedDir)) {
                mkdir($optimizedDir, 0755, true);
            }

            // Save optimized image
            $image->save(Storage::disk('public')->path($optimizedPath), $quality, $format);

            return $optimizedPath;

        } catch (\Exception $e) {
            \Log::error("Failed to create optimized image for size: $size", [
                'media_id' => $this->media->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Strip EXIF data from image for privacy.
     */
    private function stripExifData($image): void
    {
        // Remove all EXIF data except for consented fields
        $exifData = $this->media->exif_data ?? [];
        
        // Clear all EXIF data
        $image->exif(null);
        
        // If there are consented EXIF fields, we could re-add them here
        // For now, we're stripping all EXIF for privacy
    }

    /**
     * Determine optimal format for the image.
     */
    private function getOptimalFormat($image): string
    {
        $originalFormat = strtolower($image->mime());
        
        // Prefer WebP for better compression, fallback to original format
        if (function_exists('imagewebp')) {
            return 'webp';
        }
        
        // Map common formats
        $formatMap = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
        ];
        
        return $formatMap[$originalFormat] ?? 'jpg';
    }

    /**
     * Determine optimal quality for the image size.
     */
    private function getOptimalQuality(string $size): int
    {
        $qualityMap = [
            Media::SIZE_THUMB => 80,
            Media::SIZE_CARD => 85,
            Media::SIZE_FULL => 90,
        ];
        
        return $qualityMap[$size] ?? 85;
    }

    /**
     * Handle job failure.
     */
    public function failed(\Throwable $exception): void
    {
        $this->media->update(['optimization_status' => Media::STATUS_FAILED]);
        
        \Log::error('Image optimization job failed', [
            'media_id' => $this->media->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
