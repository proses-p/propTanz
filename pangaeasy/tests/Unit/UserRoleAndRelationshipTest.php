<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use App\Models\Hostel;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PHPUnit\Framework\TestCase;

class UserRoleAndRelationshipTest extends TestCase
{
    public function test_user_role_values_are_defined_consistently(): void
    {
        $this->assertSame('ADMIN', UserRole::ADMIN->value);
        $this->assertSame('USER', UserRole::USER->value);
        $this->assertSame('LANDLORD', UserRole::LANDLORD->value);
    }

    public function test_user_and_hostel_relationships_are_defined(): void
    {
        $user = new User();
        $hostel = new Hostel();

        $this->assertInstanceOf(HasMany::class, $user->hostels());
        $this->assertInstanceOf(BelongsTo::class, $hostel->landlord());
        $this->assertSame('landlord_id', $hostel->landlord()->getForeignKeyName());
    }
}
