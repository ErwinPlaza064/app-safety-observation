<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Area;
use App\Models\Category;
use App\Models\Observation;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ObservationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function observation_belongs_to_a_user(): void
    {
        $user = User::factory()->create();
        $observation = Observation::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $observation->user);
        $this->assertEquals($user->id, $observation->user->id);
    }

    /** @test */
    public function observation_belongs_to_an_area(): void
    {
        $area = Area::factory()->create();
        $observation = Observation::factory()->create(['area_id' => $area->id]);

        $this->assertInstanceOf(Area::class, $observation->area);
        $this->assertEquals($area->id, $observation->area->id);
    }

    /** @test */
    public function observation_can_have_multiple_categories(): void
    {
        $observation = Observation::factory()->create();
        $categories = Category::factory()->count(3)->create();

        $observation->categories()->attach($categories->pluck('id'));

        $this->assertCount(3, $observation->categories);
    }

    /** @test */
    public function observation_can_be_a_draft(): void
    {
        $observation = Observation::factory()->draft()->create();

        $this->assertTrue($observation->is_draft);
        $this->assertEquals('borrador', $observation->status);
    }

    /** @test */
    public function observation_can_be_closed(): void
    {
        $observation = Observation::factory()->closed()->create();

        $this->assertEquals('cerrada', $observation->status);
        $this->assertNotNull($observation->closed_at);
        $this->assertNotNull($observation->closed_by);
    }

    /** @test */
    public function submitted_scope_excludes_drafts(): void
    {
        // Crear 3 observaciones enviadas y 2 borradores
        Observation::factory()->count(3)->create(['is_draft' => false]);
        Observation::factory()->count(2)->draft()->create();

        $submittedObservations = Observation::submitted()->get();

        $this->assertCount(3, $submittedObservations);
    }

    /** @test */
    public function observation_has_valid_types(): void
    {
        $unsafeAct = Observation::factory()->unsafeAct()->create();
        $unsafeCondition = Observation::factory()->unsafeCondition()->create();
        $safeAct = Observation::factory()->safeAct()->create();

        $this->assertEquals('acto_inseguro', $unsafeAct->observation_type);
        $this->assertEquals('condicion_insegura', $unsafeCondition->observation_type);
        $this->assertEquals('acto_seguro', $safeAct->observation_type);
    }

    /** @test */
    public function observation_date_is_cast_to_date(): void
    {
        $observation = Observation::factory()->create([
            'observation_date' => '2025-12-03'
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $observation->observation_date);
    }

    /** @test */
    public function observation_can_track_who_closed_it(): void
    {
        $manager = User::factory()->create(['is_ehs_manager' => true]);
        $observation = Observation::factory()->create();

        $observation->update([
            'status' => 'cerrada',
            'closed_at' => now(),
            'closed_by' => $manager->id,
        ]);

        $this->assertInstanceOf(User::class, $observation->closedByUser);
        $this->assertEquals($manager->id, $observation->closedByUser->id);
    }

    /** @test */
    public function observation_can_track_who_reviewed_it(): void
    {
        $manager = User::factory()->create(['is_ehs_manager' => true]);
        $observation = Observation::factory()->create();

        $observation->update([
            'reviewed_at' => now(),
            'reviewed_by' => $manager->id,
        ]);

        $this->assertInstanceOf(User::class, $observation->reviewedByUser);
        $this->assertEquals($manager->id, $observation->reviewedByUser->id);
    }

    /** @test */
    public function observation_folio_is_unique(): void
    {
        $observation1 = Observation::factory()->create(['folio' => 'OBS-000001']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        Observation::factory()->create(['folio' => 'OBS-000001']);
    }
}
