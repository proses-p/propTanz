<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hostel extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'landlord_id',
        'hostel_name',
        'description',
        'region',
        'district',
        'ward',
        'street',
        'landmark',
        'hostel_type',
        'status',
        'rejection_reason',
    ];

    public function landlord()
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }
}
