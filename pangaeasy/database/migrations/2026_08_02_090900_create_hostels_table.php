<?php

use App\Enums\HostelStatus;
use App\Enums\HostelType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hostels', function (Blueprint $table) {
            $table->id();
            $table->string('hostel_name');
            $table->text('description');
            $table->string('region');
            $table->string('district');
            $table->string('ward');
            $table->string('street');
            $table->string('landmark')->nullable();
            $table->enum('hostel_type', HostelType::values());
            $table->enum('status', HostelStatus::values()
            )->default(HostelStatus::PENDING->value);
            $table->text('rejected_reason')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hostels');
    }
};
