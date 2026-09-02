<?php

namespace App\Http\Controllers\Api;

use App\Actions\Hostel\StoreHostelAction;
use App\Enums\HostelStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHostelRequest;
use App\Http\Requests\UpdateHostelRequest;
use App\Http\Resources\HostelResource;
use App\Models\Hostel;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\RejectingHostelRequest;

class HostelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use ApiResponse;

    // public function __construct()
    // {
    //     $this->authorizeResource(Hostel::class, 'hostel');
    // }

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Hostel::class);

        $hostels = Hostel::query()
            // ->when($request->user()?->isLandlord() && ! $request->user()?->isAdmin(), function ($query) use ($request) {
            //     $query->where('landlord_id', $request->user()->id);
            // })
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Hostel retrieved successfull.',
            'data' => $hostels->through(function ($hostel) {
                return new HostelResource($hostel);
            }),
        ]);

        /*return $this->successResponse(
            //$hostels,
            HostelResource::collection($hostels),
            'Hostels retrieved successfull.'
        );
        */
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHostelRequest $request,
        StoreHostelAction $storeHostelAction): JsonResponse
    {
        Gate::authorize('create', Hostel::class);

        $hostel = $storeHostelAction->execute(
            $request->user(),
            $request->validated()
        );

        return $this->successResponse(
            new HostelResource($hostel),
            'Hostel created successfull.', 201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Hostel $hostel): JsonResponse
    {
        Gate::authorize('view', $hostel);
        $hostel->load('images');
        return $this->successResponse(
            new HostelResource($hostel),
            'Hostel retrieved successfull.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHostelRequest $request, Hostel $hostel): JsonResponse
    {
        Gate::authorize('update', $hostel);

        $hostel->update($request->validated());
        return $this->successResponse(
            new HostelResource($hostel->fresh()),
            'Hostel updated successfull.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hostel $hostel): JsonResponse
    {
        Gate::authorize('delete', $hostel);

        $hostel->delete();
        return $this->successResponse(
            null,
            'Hostel deleted successfull.'
        );
    }

    public function statistics(Request $request): JsonResponse
    {
        //Gate::forUser($request->user())->authorize('viewStatistics', Hostel::class);
        $user = $request->user();
        $query = Hostel::query();

        // admin able to see all hostels
        if (!$user->isAdmin()) {
            $query->where('landlord_id', $user->id);
        }

        $statistics = [
            'total' => (clone $query)->count(),
            'approved' => (clone $query)->where('status', 'approved')->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'rejected' => (clone $query)->where('status', 'rejected')->count(),

        ];
        return $this->successResponse($statistics,

         'Statistics retrieved successfully.');
    }

    public function browse(Request $request): JsonResponse {
        $hostels = Hostel::query()
            ->where('status', 'approved')
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Approved hostels retrieved successfull!.',
            'data' => $hostels->through(function ($hostel) {
                return new HostelResource($hostel);
            }),
        ]);
    }

    public function approving(Hostel $hostel): JsonResponse {
        $hostel->update([
            'status' => HostelStatus::APPROVED->value,
            'rejected_reason' => null,
        ]);
        return $this->successResponse(
            new HostelResource($hostel->fresh()),
            'Hostel approved successfully',
        );
    }

    public function rejecting(RejectingHostelRequest $request, Hostel $hostel): JsonResponse {
        $hostel->update([
            'status' => HostelStatus::REJECTED->value,
            'rejected_reason' => $request->validated('rejected_reason'),
        ]);
        return $this->successResponse(
            new HostelResource($hostel->fresh()),
            'Hostel rejected successfull.',
        );
    }
}
