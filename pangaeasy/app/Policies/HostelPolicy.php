<?php

namespace App\Policies;

use App\Models\Hostel;
use App\Models\User;

class HostelPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Hostel $hostel): bool
    {
        return true;
    }

    public function viewStatistics(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return $user->ownerRequests()
            ->where('status', 'approved')
            ->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Hostel $hostel): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return $hostel->landlord_id === $user->id && $user->ownerRequests()
            ->where('status', 'approved')
            ->exists();

    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Hostel $hostel): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return $hostel->landlord_id === $user->id && $user->ownerRequests()
            ->where('status', 'approved')
            ->exists();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Hostel $hostel): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Hostel $hostel): bool
    {
        return false;
    }
}
