<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Hostel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthAndHostelAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_and_landlord_registration_and_admin_creation_protection(): void
    {
        $userResponse = $this->postJson('/api/v1/register', [
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'phone' => '0800123456',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'role' => UserRole::USER->value,
        ]);

        $userResponse->assertStatus(201);
        $userResponse->assertJsonPath('success', true);
        $userResponse->assertJsonPath('data.user.email', 'user@example.com');
        $userResponse->assertJsonPath('data.user.role', UserRole::USER->value);
        $userResponse->assertJsonMissing(['data.user.password']);
        $this->assertNotEmpty($userResponse->json('data.token'));

        $landlordResponse = $this->postJson('/api/v1/register', [
            'name' => 'Hostel Landlord',
            'email' => 'landlord@example.com',
            'phone' => '0800654321',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'role' => UserRole::LANDLORD->value,
        ]);

        $landlordResponse->assertStatus(201);
        $landlordResponse->assertJsonPath('data.user.role', UserRole::LANDLORD->value);

        $adminResponse = $this->postJson('/api/v1/register', [
            'name' => 'Evil Admin',
            'email' => 'admin@example.com',
            'phone' => '0800999988',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'role' => UserRole::ADMIN->value,
        ]);

        $adminResponse->assertStatus(422);
        $adminResponse->assertJsonPath('success', false);
        $adminResponse->assertJsonStructure(['success', 'message', 'errors']);
        $this->assertDatabaseMissing('users', ['email' => 'admin@example.com']);
    }

    public function test_login_logout_and_sanctum_token_management(): void
    {
        $user = User::factory()->create([
            'email' => 'login-user@example.com',
            'phone' => '0800111222',
            'role' => UserRole::USER->value,
            'status' => 'ACTIVE',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'login-user@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.user.id', $user->id);
        $response->assertJsonPath('data.user.role', UserRole::USER->value);
        $response->assertJsonMissing(['data.user.password']);
        $token = $response->json('data.token');
        $this->assertIsString($token);
        $this->assertDatabaseCount('personal_access_tokens', 1);

        $user->refresh();
        $this->assertSame(1, $user->tokens()->count());

        $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/logout');

        $logoutResponse->assertStatus(200);
        $logoutResponse->assertJsonPath('success', true);
        $this->assertSame(0, $user->tokens()->count());

        $invalidResponse = $this->postJson('/api/v1/login', [
            'email' => 'login-user@example.com',
            'password' => 'wrong-password',
        ]);

        $invalidResponse->assertStatus(401);
        $invalidResponse->assertJsonPath('success', false);
        $invalidResponse->assertJsonPath('message', 'Invalid credentials.');
    }

    public function test_admin_and_landlord_route_access_and_restrictions(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'phone' => '0800222333',
            'role' => UserRole::ADMIN->value,
            'status' => 'ACTIVE',
            'password' => Hash::make('password123'),
        ]);

        $landlord = User::factory()->create([
            'email' => 'landlord-route@example.com',
            'phone' => '0800333444',
            'role' => UserRole::LANDLORD->value,
            'status' => 'ACTIVE',
            'password' => Hash::make('password123'),
        ]);

        $user = User::factory()->create([
            'email' => 'user-route@example.com',
            'phone' => '0800444555',
            'role' => UserRole::USER->value,
            'status' => 'ACTIVE',
            'password' => Hash::make('password123'),
        ]);

        $adminToken = $admin->createToken('auth_token')->plainTextToken;
        $landlordToken = $landlord->createToken('auth_token')->plainTextToken;
        $userToken = $user->createToken('auth_token')->plainTextToken;

        $statisticsResponse = $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->getJson('/api/v1/hostels/statistics');
        $statisticsResponse->assertStatus(200)->assertJsonPath('success', true);

        $statisticsResponse = $this->withHeader('Authorization', 'Bearer '.$landlordToken)
            ->getJson('/api/v1/hostels/statistics');
        $statisticsResponse->assertStatus(403);

        $hostelsResponse = $this->withHeader('Authorization', 'Bearer '.$landlordToken)
            ->getJson('/api/v1/hostels');
        $hostelsResponse->assertStatus(200)->assertJsonPath('success', true);

        $userHostelsResponse = $this->withHeader('Authorization', 'Bearer '.$userToken)
            ->getJson('/api/v1/hostels');
        $userHostelsResponse->assertStatus(403);
    }

    public function test_landlord_hostel_ownership_and_crud_flow_with_authenticated_landlord_id_assignment(): void
    {
        $landlord = User::factory()->create([
            'email' => 'owner@example.com',
            'phone' => '0800555666',
            'role' => UserRole::LANDLORD->value,
            'status' => 'ACTIVE',
            'password' => Hash::make('password123'),
        ]);

        $landlordToken = $landlord->createToken('auth_token')->plainTextToken;

        $createResponse = $this->withHeader('Authorization', 'Bearer '.$landlordToken)
            ->postJson('/api/v1/hostels', [
                'hostel_name' => 'Test Hostel',
                'description' => 'A lovely place for students to stay.',
                'region' => 'Central',
                'district' => 'Kampala',
                'ward' => 'Kololo',
                'street' => 'Main Street',
                'hostel_type' => 'MALE',
                'landlord_id' => 999,
            ]);

        $createResponse->assertStatus(201);
        $createResponse->assertJsonPath('success', true);
        $responseHostel = $createResponse->json('data');
        $this->assertSame('Test Hostel', $responseHostel['hostel_name']);
        $this->assertArrayNotHasKey('landlord_id', $responseHostel);

        $hostelId = $responseHostel['id'];
        $hostel = Hostel::findOrFail($hostelId);
        $this->assertSame($landlord->id, $hostel->landlord_id);

        $showResponse = $this->withHeader('Authorization', 'Bearer '.$landlordToken)
            ->getJson('/api/v1/hostels/'.$hostel->id);
        $showResponse->assertStatus(200);

        $otherLandlord = User::factory()->create([
            'email' => 'otherlandlord@example.com',
            'phone' => '0800666777',
            'role' => UserRole::LANDLORD->value,
            'status' => 'ACTIVE',
            'password' => Hash::make('password123'),
        ]);
        $otherToken = $otherLandlord->createToken('auth_token')->plainTextToken;

        $otherResponse = $this->withHeader('Authorization', 'Bearer '.$otherToken)
            ->getJson('/api/v1/hostels/'.$hostel->id);
        $otherResponse->assertStatus(403);

        $updateResponse = $this->withHeader('Authorization', 'Bearer '.$landlordToken)
            ->putJson('/api/v1/hostels/'.$hostel->id, [
                'hostel_name' => 'Updated Hostel',
                'description' => 'A lovely place for students to stay.',
                'region' => 'Central',
                'district' => 'Kampala',
                'ward' => 'Kololo',
                'street' => 'Main Street',
                'hostel_type' => 'MALE',
            ]);
        $updateResponse->assertStatus(200);

        $deleteResponse = $this->withHeader('Authorization', 'Bearer '.$landlordToken)
            ->deleteJson('/api/v1/hostels/'.$hostel->id);
        $deleteResponse->assertStatus(200);
        $this->assertModelMissing($hostel);
    }
}
