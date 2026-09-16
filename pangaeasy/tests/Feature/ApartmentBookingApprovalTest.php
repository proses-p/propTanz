<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\ApartmentBooking;
use App\Models\ApartmentDetails;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApartmentBookingApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_a_booking_and_user_sees_approved_status(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin-booking@example.com',
            'phone' => '0800777888',
            'role' => UserRole::ADMIN->value,
            'status' => 'ACTIVE',
            'password' => Hash::make('password123'),
        ]);

        $user = User::factory()->create([
            'email' => 'tenant-booking@example.com',
            'phone' => '0800555666',
            'role' => UserRole::USER->value,
            'status' => 'ACTIVE',
            'password' => Hash::make('password123'),
        ]);

        $apartment = ApartmentDetails::create([
            'name' => 'Maple Villa',
            'description' => 'A spacious apartment for tenants.',
            'street' => 'Main Street',
            'town' => 'Kampala',
            'address' => 'Plot 12, Kampala',
            'status' => 'Approved',
        ]);

        $booking = ApartmentBooking::create([
            'user_id' => $user->id,
            'apartment_id' => $apartment->id,
            'move_in_date' => now()->addDays(10)->toDateString(),
            'message' => 'I would like to move in soon.',
            'status' => 'pending',
        ]);

        $adminToken = $admin->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->patchJson('/api/v1/apartment-bookings/'.$booking->id.'/approve');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('apartment_bookings', [
            'id' => $booking->id,
            'status' => 'approved',
        ]);
    }
}
