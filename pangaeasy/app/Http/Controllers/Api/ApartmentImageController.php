<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApartmentDetails;
use App\Models\ApartmentImage;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApartmentImageController extends Controller
{
    use ApiResponse;

    public function index(ApartmentDetails $apartment): JsonResponse
    {
        return $this->successResponse(
            $apartment->images()->latest()->get(),
            'Apartment images retrieved successfully.'
        );
    }

    public function store(Request $request, ApartmentDetails $apartment): JsonResponse
    {
        $request->validate([
            'image_1' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
            'image_2' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
            'image_3' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
            'image_4' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
            'image_5' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
            'video' => ['nullable', 'file', 'mimes:mp4,mov,avi,webm', 'max:102400'],
        ]);

        $data = ['apartment_id' => $apartment->id];
        foreach (['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'video'] as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('apartments', 'public');
            }
        }

        $images = ApartmentImage::create($data);

        return $this->successResponse($images, 'Apartment images uploaded successfully.', 201);
    }

    public function destroy(ApartmentDetails $apartment, ApartmentImage $image): JsonResponse
    {
        abort_unless($image->apartment_id === $apartment->id, 404);

        foreach (['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'video'] as $field) {
            if ($image->$field) {
                Storage::disk('public')->delete($image->$field);
            }
        }

        $image->delete();

        return $this->successResponse(null, 'Apartment images deleted successfully.');
    }
}