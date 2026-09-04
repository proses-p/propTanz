<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApartmentDetails;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApartmentController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->successResponse(
            ApartmentDetails::with('images')->latest()->paginate(10),
            'Apartments retrieved successfully.'
        );
    }

    public function store(Request $request): JsonResponse
    {
        $apartment = ApartmentDetails::create($this->validatedData($request));

        return $this->successResponse(
            $apartment->load('images'),
            'Apartment created successfully.',
            201
        );
    }

    public function show(ApartmentDetails $apartment): JsonResponse
    {
        return $this->successResponse(
            $apartment->load('images'),
            'Apartment retrieved successfully.'
        );
    }

    public function update(Request $request, ApartmentDetails $apartment): JsonResponse
    {
        $apartment->update($this->validatedData($request));

        return $this->successResponse(
            $apartment->fresh('images'),
            'Apartment updated successfully.'
        );
    }

    public function destroy(ApartmentDetails $apartment): JsonResponse
    {
        $apartment->delete();

        return $this->successResponse(null, 'Apartment deleted successfully.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:150'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'street' => ['required', 'string', 'max:100'],
            'town' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:255'],
        ]);
    }
}