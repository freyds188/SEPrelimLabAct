<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Story;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Story::with(['weaver', 'weaver.user', 'media']);

        // Filter by status
        if ($request->has('status')) {
            switch ($request->status) {
                case 'published':
                    $query->published();
                    break;
                case 'draft':
                    $query->draft();
                    break;
                case 'scheduled':
                    $query->scheduled();
                    break;
            }
        } else {
            // Default to published stories for public access
            $query->published();
        }

        // Filter by type
        if ($request->has('type')) {
            $query->ofType($request->type);
        }

        // Filter by language
        if ($request->has('language')) {
            $query->withLanguage($request->language);
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Filter by weaver
        if ($request->has('weaver_id')) {
            $query->where('weaver_id', $request->weaver_id);
        }

        // Search by title or content
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $stories = $query->orderBy('created_at', 'desc')
                        ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $stories->items(),
            'meta' => [
                'current_page' => $stories->currentPage(),
                'last_page' => $stories->lastPage(),
                'per_page' => $stories->perPage(),
                'total' => $stories->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'weaver_id' => 'nullable|exists:weavers,id',
            'title' => 'required|string|max:255',
            'type' => 'required|in:photo_essay,oral_history,timeline,map',
            'content' => 'required|string',
            'blocks' => 'nullable|array',
            'featured_image' => 'nullable|string',
            'images' => 'nullable|array',
            'status' => 'in:draft,published',
            'is_featured' => 'boolean',
            'tags' => 'nullable|array',
            'language_tags' => 'nullable|array',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validatedData = $validator->validated();
        
        // If no weaver_id is provided, use the authenticated user's weaver profile
        if (!isset($validatedData['weaver_id']) || 
            $validatedData['weaver_id'] === null || 
            $validatedData['weaver_id'] === '' || 
            $validatedData['weaver_id'] === false) {
            
            $user = auth()->user();
            $userWeaver = \App\Models\Weaver::where('user_id', $user->id)->first();
            
            if ($userWeaver) {
                $validatedData['weaver_id'] = $userWeaver->id;
            } else {
                // If user doesn't have a weaver profile, create one
                $userWeaver = \App\Models\Weaver::create([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'bio' => 'Weaver profile for ' . $user->name,
                    'location' => 'Philippines',
                    'is_featured' => false,
                    'status' => 'active',
                ]);
                $validatedData['weaver_id'] = $userWeaver->id;
            }
        }
        
        $story = Story::create($validatedData);

        // Handle media attachments
        if ($request->has('media_ids')) {
            $mediaIds = $request->media_ids;
            Media::whereIn('id', $mediaIds)->update([
                'mediable_type' => Story::class,
                'mediable_id' => $story->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Story created successfully',
            'data' => $story->load(['weaver', 'weaver.user', 'media']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Story $story): JsonResponse
    {
        // Only show published stories to public, unless authenticated as the author
        if (!$story->isPublished() && !auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Story not found',
            ], 404);
        }

        $story->load(['weaver', 'weaver.user', 'media']);
        $story->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $story,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Story $story): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'weaver_id' => 'nullable|exists:weavers,id',
            'title' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:photo_essay,oral_history,timeline,map',
            'content' => 'sometimes|required|string',
            'blocks' => 'nullable|array',
            'featured_image' => 'nullable|string',
            'images' => 'nullable|array',
            'status' => 'in:draft,published',
            'is_featured' => 'boolean',
            'tags' => 'nullable|array',
            'language_tags' => 'nullable|array',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validatedData = $validator->validated();
        
        // Remove weaver_id if it's null to avoid database constraint violation
        if (isset($validatedData['weaver_id']) && $validatedData['weaver_id'] === null) {
            unset($validatedData['weaver_id']);
        }
        
        $story->update($validatedData);

        // Handle media attachments
        if ($request->has('media_ids')) {
            // Remove existing media associations
            Media::where('mediable_type', Story::class)
                 ->where('mediable_id', $story->id)
                 ->update([
                     'mediable_type' => null,
                     'mediable_id' => null,
                 ]);

            // Add new media associations
            $mediaIds = $request->media_ids;
            Media::whereIn('id', $mediaIds)->update([
                'mediable_type' => Story::class,
                'mediable_id' => $story->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Story updated successfully',
            'data' => $story->fresh()->load(['weaver', 'weaver.user', 'media']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Story $story): JsonResponse
    {
        // Check if the authenticated user owns this story
        $user = auth()->user();
        if ($story->weaver->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete your own stories',
            ], 403);
        }

        // Remove media associations
        Media::where('mediable_type', Story::class)
             ->where('mediable_id', $story->id)
             ->update([
                 'mediable_type' => null,
                 'mediable_id' => null,
             ]);

        $story->delete();

        return response()->json([
            'success' => true,
            'message' => 'Story deleted successfully',
        ]);
    }

    /**
     * Publish a story.
     */
    public function publish(Story $story): JsonResponse
    {
        $story->publish();

        return response()->json([
            'success' => true,
            'message' => 'Story published successfully',
            'data' => $story->fresh()->load(['weaver', 'weaver.user', 'media']),
        ]);
    }

    /**
     * Unpublish a story.
     */
    public function unpublish(Story $story): JsonResponse
    {
        $story->unpublish();

        return response()->json([
            'success' => true,
            'message' => 'Story unpublished successfully',
            'data' => $story->fresh()->load(['weaver', 'weaver.user', 'media']),
        ]);
    }

    /**
     * Get featured stories.
     */
    public function featured(): JsonResponse
    {
        $stories = Story::featured()
            ->published()
            ->with(['weaver', 'weaver.user', 'media'])
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stories,
        ]);
    }

    /**
     * Get story types.
     */
    public function types(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Story::getTypeOptions(),
        ]);
    }

    /**
     * Get story by slug.
     */
    public function showBySlug(string $slug): JsonResponse
    {
        $story = Story::where('slug', $slug)
                     ->with(['weaver', 'weaver.user', 'media'])
                     ->first();

        if (!$story) {
            return response()->json([
                'success' => false,
                'message' => 'Story not found',
            ], 404);
        }

        // Only show published stories to public
        if (!$story->isPublished() && !auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Story not found',
            ], 404);
        }

        $story->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $story,
        ]);
    }
}
