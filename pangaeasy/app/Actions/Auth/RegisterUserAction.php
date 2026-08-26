<?php

namespace App\Actions\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function execute(array $data): User
    {
        $role = $data['role'] ?? UserRole::USER->value;

        if ($role === UserRole::ADMIN->value) {
            $role = UserRole::USER->value;
        }

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => Hash::make($data['password']),
            'role' => $role,
            'status' => 'ACTIVE',
        ]);
    }
}
