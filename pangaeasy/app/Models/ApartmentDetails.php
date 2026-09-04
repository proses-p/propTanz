<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartmentDetail extends Model
{
    use HasFactory;

    protected $table = 'apartment_details';
    protected $primaryKey = 'apartment_id';

    protected $fillable = [
        'name',
        'description',//hapa ita include street ,town,address
        'apartment_images_id',
        
    ];

    public function images()
    {
        return $this->belongsTo(
            ApartmentImage::class,
            'apartment_images_id',
            'images_id'
        );
    }
}