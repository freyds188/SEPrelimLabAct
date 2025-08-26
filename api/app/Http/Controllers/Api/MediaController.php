<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Jobs\OptimizeImageJob;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class MediaController extends Controller
{
    /**
     * Display a listing of media files.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Media::query();

        // Filter by collection
        if ($request->has('collection')) {
            $query->collection($request->collection);
        }

        // Filter by mime type
        if ($request->has('mime_type')) {
            $query->byMimeType($request->mime_type);
        }

        // Filter by optimization status
        if ($request->has('optimization_status')) {
            $query->byOptimizationStatus($request->optimization_status);
        }

        // Filter by mediable
        if ($request->has('mediable_type') && $request->has('mediable_id')) {
            $query->where('mediable_type', $request->mediable_type)
                  ->where('mediable_id', $request->mediable_id);
        }

        $media = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $media->items(),
            'pagination' => [
                'current_page' => $media->currentPage(),
                'last_page' => $media->lastPage(),
                'per_page' => $media->perPage(),
                'total' => $media->total(),
            ]
        ]);
    }

    /**
     * Store a newly uploaded media file.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpeg,jpg,png,gif,webp|max:10240', // 10MB max
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:1000',
            'collection' => 'nullable|string|max:100',
            'mediable_type' => 'nullable|string',
            'mediable_id' => 'nullable|integer',
            'preserve_exif' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $mimeType = $file->getMimeType();
            $size = $file->getSize();

            // Generate unique filename
            $filename = Str::uuid() . '.' . $extension;
            
            // Store file in public disk
            $path = $file->storeAs('uploads/' . date('Y/m'), $filename, 'public');

            // Get image dimensions and basic metadata
            $metadata = [];
            $exifData = [];
            
            if (str_starts_with($mimeType, 'image/')) {
                $image = Image::make($file);
                $metadata = [
                    'width' => $image->width(),
                    'height' => $image->height(),
                    'format' => $image->mime(),
                ];

                // Extract EXIF data if requested
                if ($request->boolean('preserve_exif')) {
                    $exifData = $this->extractExifData($image);
                }
            }

            // Create media record
            $media = Media::create([
                'filename' => $filename,
                'original_name' => $originalName,
                'mime_type' => $mimeType,
                'extension' => $extension,
                'path' => $path,
                'disk' => 'public',
                'size' => $size,
                'alt_text' => $request->alt_text,
                'caption' => $request->caption,
                'metadata' => $metadata,
                'exif_data' => $exifData,
                'mediable_type' => $request->mediable_type,
                'mediable_id' => $request->mediable_id,
                'collection' => $request->collection,
                'optimization_status' => Media::STATUS_PENDING,
            ]);

            // Queue image optimization job
            if (str_starts_with($mimeType, 'image/')) {
                OptimizeImageJob::dispatch($media);
            }

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'data' => $media->fresh()
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get upload URL for direct upload (alternative to multipart upload).
     */
    public function getUploadUrl(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'filename' => 'required|string|max:255',
            'mime_type' => 'required|string|max:100',
            'size' => 'required|integer|max:10485760', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate signed URL for direct upload
        $filename = Str::uuid() . '.' . pathinfo($request->filename, PATHINFO_EXTENSION);
        $path = 'uploads/' . date('Y/m') . '/' . $filename;

        // For now, return the upload endpoint
        // In production, you might want to use S3 signed URLs
        $uploadUrl = route('api.v1.media.store');

        return response()->json([
            'success' => true,
            'data' => [
                'upload_url' => $uploadUrl,
                'filename' => $filename,
                'path' => $path,
                'headers' => [
                    'Content-Type' => $request->mime_type,
                ]
            ]
        ]);
    }

    /**
     * Show the specified media file.
     */
    public function show(Media $media): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $media
        ]);
    }

    /**
     * Remove the specified media file.
     */
    public function destroy(Media $media): JsonResponse
    {
        try {
            // Delete optimized files
            if ($media->optimized_paths) {
                foreach ($media->optimized_paths as $path) {
                    Storage::disk('public')->delete($path);
                }
            }

            // Delete original file
            Storage::disk('public')->delete($media->path);

            // Delete media record
            $media->delete();

            return response()->json([
                'success' => true,
                'message' => 'Media deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retry optimization for a media file.
     */
    public function retryOptimization(Media $media): JsonResponse
    {
        if (!$media->isImage()) {
            return response()->json([
                'success' => false,
                'message' => 'Only images can be optimized'
            ], 400);
        }

        $media->update(['optimization_status' => Media::STATUS_PENDING]);
        OptimizeImageJob::dispatch($media);

        return response()->json([
            'success' => true,
            'message' => 'Optimization queued for retry'
        ]);
    }

    /**
     * Extract EXIF data from image while preserving only consented fields.
     */
    private function extractExifData($image): array
    {
        $exif = $image->exif();
        
        if (!$exif) {
            return [];
        }

        // Only preserve safe EXIF fields
        $safeFields = [
            'Make', 'Model', 'Software', 'DateTime', 'DateTimeOriginal',
            'Artist', 'Copyright', 'ImageDescription'
        ];

        $safeExif = [];
        foreach ($safeFields as $field) {
            if (isset($exif[$field])) {
                $safeExif[$field] = $exif[$field];
            }
        }

        return $safeExif;
    }
}
