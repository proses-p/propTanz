<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOwnerRequestRequest;
use App\Models\OwnerRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerRequestController extends Controller
{
    public function store(StoreOwnerRequestRequest $request): JsonResponse
    {
        $user = $request->user();

        $existingRequest = OwnerRequest::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();
        if ($existingRequest) {
            return response()->json([
                'success' => true,
                'message' => 'You already have an owner request that is pending or approved',
            ], 422);
        }
        $ownerRequest = OwnerRequest::create([
            'user_id' => $user->id,
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'reason' => $request->reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Owner request submitted successfull',
            'data' => $ownerRequest,
        ], 201);
    }

    // for the requests to be seen
    public function index(Request $request): JsonResponse
    {
        $requests = OwnerRequest::with('user')
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Owner requests retrieved successfull',
            'data' => $requests,
        ]);
    }

    // method to approve
    public function approve(OwnerRequest $ownerRequest): JsonResponse
    {
        if ($ownerRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending requests can be approved',
            ], 422);
        }

        $ownerRequest->update([
            'status' => 'approved',
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Owner requestmapproved successfull',
            'data' => $ownerRequest->fresh(),
        ]);
    }

    // method to reject
    public function reject(OwnerRequest $ownerRequest): JsonResponse
    {
        if ($ownerRequest->status !== 'pending') {
            return response()->json([
                'success' => true,
                'message' => 'Only pending request can be rejected',
            ], 422);
        }
        $ownerRequest->update([
            'status' => 'rejected',
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Owner request rejected successfull',
            'data' => $ownerRequest->fresh(),
        ]);
    }

    // my status
    public function myStatus(Request $request)
    {
        $ownerRequest = OwnerRequest::where('user_id', $request->user()->id)
                ->latest()
                ->first();
        return response()->json([
            'success' => true,
            'message' => 'Owner requests retrieved successfull',
            'data' => $ownerRequest,
        ]);
    }
}
