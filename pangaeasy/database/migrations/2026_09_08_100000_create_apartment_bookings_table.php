<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('apartment_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('apartment_id')->constrained('apartment_details')->cascadeOnDelete();
            $table->date('move_in_date');
            $table->text('message')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
            $table->unique(['user_id', 'apartment_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('apartment_bookings');
    }
};
