<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Story;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Story::with(['weaver', 'weaver.user']);

        if ($request->boolean('published')) {
            $query->published();
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->has('weaver_id')) {
            $query->where('weaver_id', $request->weaver_id);
        }

        $stories = $query->paginate($request->get('per_page', 15));

        return response()->json([
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
        $story = Story::create($request->all());

        return response()->json([
            'message' => 'Story created successfully',
            'data' => $story->load(['weaver', 'weaver.user']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Story $story): JsonResponse
    {
        $story->load(['weaver', 'weaver.user']);
        $story->incrementViews();

        return response()->json([
            'data' => $story,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Story $story): JsonResponse
    {
        $story->update($request->all());

        return response()->json([
            'message' => 'Story updated successfully',
            'data' => $story->fresh()->load(['weaver', 'weaver.user']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Story $story): JsonResponse
    {
        $story->delete();

        return response()->json([
            'message' => 'Story deleted successfully',
        ]);
    }

    /**
     * Get featured stories.
     */
    public function featured(): JsonResponse
    {
        $stories = Story::featured()
            ->published()
            ->with(['weaver', 'weaver.user'])
            ->take(6)
            ->get();

        return response()->json([
            'data' => $stories,
        ]);
    }
}
