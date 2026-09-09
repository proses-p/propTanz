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
    ];

    public function images()
    {
        return $this->hasMany(ApartmentImage::class, 'apartment_id');
    }
}