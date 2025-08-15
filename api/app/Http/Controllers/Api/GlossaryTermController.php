<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GlossaryTerm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlossaryTermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = GlossaryTerm::query();

        if ($request->boolean('published')) {
            $query->published();
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $terms = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $terms->items(),
            'meta' => [
                'current_page' => $terms->currentPage(),
                'last_page' => $terms->lastPage(),
                'per_page' => $terms->perPage(),
                'total' => $terms->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $term = GlossaryTerm::create($request->all());

        return response()->json([
            'message' => 'Glossary term created successfully',
            'data' => $term,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(GlossaryTerm $glossaryTerm): JsonResponse
    {
        $glossaryTerm->incrementViews();

        return response()->json([
            'data' => $glossaryTerm,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GlossaryTerm $glossaryTerm): JsonResponse
    {
        $glossaryTerm->update($request->all());

        return response()->json([
            'message' => 'Glossary term updated successfully',
            'data' => $glossaryTerm->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GlossaryTerm $glossaryTerm): JsonResponse
    {
        $glossaryTerm->delete();

        return response()->json([
            'message' => 'Glossary term deleted successfully',
        ]);
    }

    /**
     * Get featured glossary terms.
     */
    public function featured(): JsonResponse
    {
        $terms = GlossaryTerm::featured()
            ->published()
            ->take(10)
            ->get();

        return response()->json([
            'data' => $terms,
        ]);
    }

    /**
     * Search glossary terms.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        
        if (!$query) {
            return response()->json([
                'data' => [],
                'message' => 'Search query is required',
            ], 400);
        }

        $terms = GlossaryTerm::search($query)
            ->published()
            ->take(10)
            ->get();

        return response()->json([
            'data' => $terms,
        ]);
    }
}
