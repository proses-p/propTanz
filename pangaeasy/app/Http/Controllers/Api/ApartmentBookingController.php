<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApartmentBooking;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApartmentBookingController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        return $this->successResponse(
            ApartmentBooking::with('apartment')->where('user_id', $request->user()->id)->latest()->get(),
            'Apartment bookings retrieved successfully.'
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'apartment_id' => ['required', 'exists:apartment_details,id'],
            'move_in_date' => ['required', 'date', 'after_or_equal:today'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        $booking = ApartmentBooking::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'apartment_id' => $data['apartment_id'],
            ],
            [
                'move_in_date' => $data['move_in_date'],
                'message' => $data['message'] ?? null,
                'status' => 'pending',
            ]
        );

        return $this->successResponse(
            $booking->load('apartment'),
            'Apartment booking request sent successfully.',
            201
        );
    }
}
