<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartmentDetails extends Model
{
    use HasFactory;

    protected $table = 'apartment_details';

    protected $fillable = [
        'name',
        'description',
        'street',
        'town',
        'address',
        'status',
        'rejected_reason',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function images()
    {
        return $this->hasMany(ApartmentImage::class, 'apartment_id');
    }
}