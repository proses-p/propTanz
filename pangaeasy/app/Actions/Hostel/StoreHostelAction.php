<?php

namespace App\Actions\Hostel;

use App\Enums\HostelStatus;
use App\Models\Hostel;
use App\Models\User;

class StoreHostelAction
{
    public function execute(User $landlord, array $data): Hostel
    {
        return Hostel::create([
            ...$data,
            'landlord_id' => $landlord->id,
            'status' => HostelStatus::PENDING->value,
        ]);
    }
}
