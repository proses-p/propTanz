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
        'user_id',
        'status',
        'rejected_reason',
        'reviewed_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'reviewed_at' => 'datetime',
    ];

    public function images()
    {
        return $this->hasMany(ApartmentImage::class, 'apartment_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}