<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Weaver\StoreWeaverRequest;
use App\Http\Requests\Weaver\UpdateWeaverRequest;
use App\Models\Weaver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeaverController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Weaver::with(['user', 'products']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Filter by verified
        if ($request->boolean('verified')) {
            $query->verified();
        }

        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Search by name or bio
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%");
            });
        }

        $weavers = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $weavers->items(),
            'meta' => [
                'current_page' => $weavers->currentPage(),
                'last_page' => $weavers->lastPage(),
                'per_page' => $weavers->perPage(),
                'total' => $weavers->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWeaverRequest $request): JsonResponse
    {
        $weaver = Weaver::create($request->validated());

        return response()->json([
            'message' => 'Weaver created successfully',
            'data' => $weaver->load('user'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Weaver $weaver): JsonResponse
    {
        $weaver->load(['user', 'products', 'stories']);

        return response()->json([
            'data' => $weaver,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWeaverRequest $request, Weaver $weaver): JsonResponse
    {
        $weaver->update($request->validated());

        return response()->json([
            'message' => 'Weaver updated successfully',
            'data' => $weaver->fresh()->load('user'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Weaver $weaver): JsonResponse
    {
        $weaver->delete();

        return response()->json([
            'message' => 'Weaver deleted successfully',
        ]);
    }

    /**
     * Get featured weavers.
     */
    public function featured(): JsonResponse
    {
        $weavers = Weaver::featured()
            ->verified()
            ->with(['user', 'products'])
            ->take(6)
            ->get();

        return response()->json([
            'data' => $weavers,
        ]);
    }
}
