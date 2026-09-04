<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApartmentImage extends Model
{
    use HasFactory;
    // use SoftDeletes; // Ikiwa umetumia softDeletes()

    protected $table = 'apartment_images';
    public $timestamps = true; //  timestamps

    protected $fillable = [
        'image_1',
        'image_2',
        'image_3',
        'image_4',
        'image_5',
        'video',
        'apartment_id',
    ];

    protected $casts = [
        'apartment_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        // 'deleted_at' => 'datetime', // Ikiwa umetumia softDeletes()
    ];

    // Relationships
    public function apartment()
    {
        return $this->belongsTo(ApartmentDetails::class, 'apartment_id');
    }

    // Accessors
    public function getImageUrlsAttribute()
    {
        $images = [];
        for ($i = 1; $i <= 5; $i++) {
            $field = "image_{$i}";
            $images[$field] = $this->$field ? asset('storage/' . $this->$field) : null;
        }
        return $images;
    }

    public function getFirstImageAttribute()
    {
        for ($i = 1; $i <= 5; $i++) {
            $field = "image_{$i}";
            if ($this->$field) {
                return asset('storage/' . $this->$field);
            }
        }
        return null;
    }

    public function getImagesCountAttribute()
    {
        $count = 0;
        for ($i = 1; $i <= 5; $i++) {
            $field = "image_{$i}";
            if ($this->$field) {
                $count++;
            }
        }
        return $count;
    }
}