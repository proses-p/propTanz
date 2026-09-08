<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApartmentBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'apartment_id',
        'move_in_date',
        'message',
        'status',
    ];

    protected $casts = [
        'move_in_date' => 'date:Y-m-d',
    ];

    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentDetails::class, 'apartment_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
