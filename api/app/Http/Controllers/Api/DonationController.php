<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    /**
     * Store a newly created donation.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'campaign_id' => 'required|integer|exists:campaigns,id',
                'amount' => 'required|numeric|min:50',
                'donor_name' => 'nullable|string|max:255',
                'donor_email' => 'nullable|email|max:255',
                'is_anonymous' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Start database transaction
            DB::beginTransaction();

            try {
                // Create the donation
                $donation = Donation::create([
                    'campaign_id' => $request->campaign_id,
                    'user_id' => null, // No user authentication for now
                    'donor_name' => $request->donor_name ?: 'Anonymous Donor',
                    'donor_email' => $request->donor_email ?: 'anonymous@example.com',
                    'amount' => $request->amount,
                    'status' => 'completed', // Mock success - no real payment
                    'payment_method' => 'mock_payment',
                    'transaction_id' => 'mock_' . uniqid(),
                    'message' => null,
                    'is_anonymous' => $request->boolean('is_anonymous', false),
                    'paid_at' => now(),
                ]);

                // Update the campaign
                $campaign = Campaign::findOrFail($request->campaign_id);
                $campaign->increment('current_amount', $request->amount);
                $campaign->increment('donors_count');

                // Commit the transaction
                DB::commit();

                // Return success response with updated totals
                return response()->json([
                    'success' => true,
                    'message' => 'Donation processed successfully',
                    'data' => [
                        'donation' => $donation,
                        'campaign' => $campaign->fresh(),
                        'totals' => [
                            'total_income' => $campaign->current_amount,
                            'donors_count' => $campaign->donors_count,
                        ],
                    ],
                ], 201);

            } catch (\Exception $e) {
                // Rollback the transaction
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process donation',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display a listing of donations.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Donation::with(['campaign']);

            // Apply filters
            if ($request->has('campaign_id')) {
                $query->where('campaign_id', $request->campaign_id);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('is_anonymous')) {
                $query->where('is_anonymous', $request->boolean('is_anonymous'));
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $donations = $query->paginate($perPage);

            // Transform donations for admin display
            $donations->getCollection()->transform(function ($donation) {
                return [
                    'id' => $donation->id,
                    'donor_name' => $donation->is_anonymous ? 'Anonymous' : $donation->donor_name,
                    'donor_email' => $donation->is_anonymous ? 'Hidden' : $donation->donor_email,
                    'amount' => $donation->amount,
                    'status' => $donation->status,
                    'is_anonymous' => $donation->is_anonymous,
                    'campaign_title' => $donation->campaign->title ?? 'Unknown Campaign',
                    'created_at' => $donation->created_at,
                    'paid_at' => $donation->paid_at,
                    'payment_method' => $donation->payment_method,
                    'transaction_id' => $donation->transaction_id,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $donations,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve donations',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display the specified donation.
     */
    public function show(Donation $donation): JsonResponse
    {
        try {
            $donation->load(['campaign']);

            return response()->json([
                'success' => true,
                'data' => $donation,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve donation',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
