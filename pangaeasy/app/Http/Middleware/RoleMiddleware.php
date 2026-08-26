<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next,
        ...$roles
    ): Response
    {

        $user = $request->user();
        $normalizedRoles = array_map(function (mixed $role): string {
            return $role instanceof UserRole ? $role->value : (string) $role;
        }, $roles);

        $userRole = $user?->role;
        $normalizedUserRole = $userRole instanceof UserRole ? $userRole->value : (string) $userRole;

        if (! $user || ! in_array($normalizedUserRole, $normalizedRoles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access.',
            ], 403);
        }

        return $next($request);
    }
}
