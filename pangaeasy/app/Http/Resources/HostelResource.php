<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HostelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hostel_name' => $this->hostel_name,
            'description' => $this->description,
            'region' => $this->region,
            'district' => $this->district,
            'ward' => $this->ward,
            'street' => $this->street,
            'landmark' => $this->landmark,
            'hostel_type' => $this->hostel_type,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
