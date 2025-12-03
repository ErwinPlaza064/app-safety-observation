<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Observation;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_have_multiple_observations(): void
    {
        $user = User::factory()->create();
        Observation::factory()->count(5)->create(['user_id' => $user->id]);

        $this->assertCount(5, $user->observations);
    }

    /** @test */
    public function user_can_be_ehs_manager(): void
    {
        $manager = User::factory()->create(['is_ehs_manager' => true]);
        $employee = User::factory()->create(['is_ehs_manager' => false]);

        $this->assertTrue($manager->isEhsManager());
        $this->assertFalse($employee->isEhsManager());
    }

    /** @test */
    public function user_can_be_suspended(): void
    {
        $suspendedUser = User::factory()->create([
            'is_suspended' => true,
            'suspended_at' => now(),
            'suspension_reason' => 'Violación de políticas',
        ]);

        $activeUser = User::factory()->create(['is_suspended' => false]);

        $this->assertTrue($suspendedUser->isSuspended());
        $this->assertFalse($activeUser->isSuspended());
    }

    /** @test */
    public function user_can_be_super_admin(): void
    {
        $admin = User::factory()->create(['is_super_admin' => true]);
        $regularUser = User::factory()->create(['is_super_admin' => false]);

        $this->assertTrue($admin->isSuperAdmin());
        $this->assertFalse($regularUser->isSuperAdmin());
    }

    /** @test */
    public function user_password_is_hashed(): void
    {
        $user = User::factory()->create(['password' => 'plain_password']);

        $this->assertNotEquals('plain_password', $user->password);
        $this->assertTrue(\Hash::check('plain_password', $user->password));
    }

    /** @test */
    public function user_email_verified_at_is_cast_to_datetime(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->email_verified_at);
    }

    /** @test */
    public function unverified_user_has_null_email_verified_at(): void
    {
        $user = User::factory()->unverified()->create();

        $this->assertNull($user->email_verified_at);
    }
}
