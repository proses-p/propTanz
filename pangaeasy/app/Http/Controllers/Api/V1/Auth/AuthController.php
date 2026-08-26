<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Actions\Auth\LoginUserAction;
use App\Actions\Auth\LogoutUserAction;
use App\Actions\Auth\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(
        RegisterRequest $request, RegisterUserAction $registerUserAction
    ): JsonResponse {
        $user = $registerUserAction->execute(
            $request->validated()
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Registration successful.', 201);
    }

    public function login(
        LoginRequest $request, LoginUserAction $loginUserAction
    ): JsonResponse {
        try {
            $data = $loginUserAction->execute(
                $request->validated()
            );
        } catch (AuthenticationException $exception) {
            return $this->errorResponse(
                'Invalid credentials.',
                ['email' => ['Invalid credentials.']],
                401
            );
        }

        return $this->successResponse([
            'user' => new UserResource($data['user']),
            'token' => $data['token'],
        ], 'Login successful.');
    }

    public function logout(Request $request,
        LogoutUserAction $logoutUserAction
    ): JsonResponse {
        $logoutUserAction->execute($request->user());

        return $this->successResponse(null, 'Logout successful.');
    }
}
