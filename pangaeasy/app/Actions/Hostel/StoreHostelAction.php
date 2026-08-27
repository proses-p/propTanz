<?php

namespace App\Actions\Hostel;

use App\Enums\HostelStatus;
use App\Models\Hostel;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StoreHostelAction
{
    public function execute(User $landlord, array $data): Hostel
    {
        return DB::transaction(function () use ($landlord, $data) {

            // Separate images from hostel data
            $images = $data['images'] ?? [];

            unset($data['images']);

            // Create hostel
            $hostel = Hostel::create([
                ...$data,
                'landlord_id' => $landlord->id,
                'status' => HostelStatus::PENDING->value,
            ]);

            // Store multiple images
            foreach ($images as $image) {

                $path = $image->store('hostels', 'public');

                $hostel->images()->create([
                    'image_path' => $path,
                ]);
            }

            // Load images relationship
            return $hostel->load('images');
        });
    }
}
