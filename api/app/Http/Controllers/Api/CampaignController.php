<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Campaign::with(['donations']);

        if ($request->boolean('active')) {
            $query->active();
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        $campaigns = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $campaigns->items(),
            'meta' => [
                'current_page' => $campaigns->currentPage(),
                'last_page' => $campaigns->lastPage(),
                'per_page' => $campaigns->perPage(),
                'total' => $campaigns->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $campaign = Campaign::create($request->all());

        return response()->json([
            'message' => 'Campaign created successfully',
            'data' => $campaign->load(['donations']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Campaign $campaign): JsonResponse
    {
        $campaign->load(['donations']);
        $campaign->incrementViews();

        return response()->json([
            'data' => $campaign,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Campaign $campaign): JsonResponse
    {
        $campaign->update($request->all());

        return response()->json([
            'message' => 'Campaign updated successfully',
            'data' => $campaign->fresh()->load(['donations']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Campaign $campaign): JsonResponse
    {
        $campaign->delete();

        return response()->json([
            'message' => 'Campaign deleted successfully',
        ]);
    }

    /**
     * Get featured campaigns.
     */
    public function featured(): JsonResponse
    {
        $campaigns = Campaign::featured()
            ->active()
            ->with(['donations'])
            ->take(6)
            ->get();

        return response()->json([
            'data' => $campaigns,
        ]);
    }
}
