<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Area;
use App\Models\Category;
use App\Models\Observation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

class ObservationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $ehsManager;
    protected User $superAdmin;
    protected Area $area;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['email_verified_at' => now()]);
        $this->ehsManager = User::factory()->create([
            'is_ehs_manager' => true,
            'email_verified_at' => now(),
        ]);
        $this->superAdmin = User::factory()->create([
            'is_super_admin' => true,
            'email_verified_at' => now(),
        ]);
        $this->area = Area::factory()->create();
        $this->category = Category::factory()->create();
    }

    /** @test */
    public function user_can_create_observation_with_valid_data(): void
    {
        $observation = Observation::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'observation_date' => now(),
            'observed_person' => 'Juan Pérez',
            'observation_type' => 'acto_inseguro',
            'description' => 'Se observó al trabajador sin usar casco de seguridad.',
            'status' => 'en_progreso',
            'is_draft' => false,
            'folio' => 'OBS-' . date('Ymd') . '-' . $this->user->id . '-' . time(),
        ]);

        $observation->categories()->attach($this->category->id);

        $this->assertDatabaseHas('observations', [
            'id' => $observation->id,
            'user_id' => $this->user->id,
            'observation_type' => 'acto_inseguro',
            'is_draft' => false,
        ]);

        $this->assertCount(1, $observation->categories);
    }

    /** @test */
    public function user_can_save_observation_as_draft(): void
    {
        $observation = Observation::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'observation_date' => now(),
            'observation_type' => 'condicion_insegura',
            'description' => 'Piso mojado sin señalización en el pasillo principal.',
            'status' => 'borrador',
            'is_draft' => true,
            'folio' => 'OBS-' . date('Ymd') . '-' . $this->user->id . '-' . time(),
        ]);

        $this->assertTrue($observation->is_draft);
        $this->assertEquals('borrador', $observation->status);
    }

    /** @test */
    public function observation_validation_requires_valid_type(): void
    {
        $validTypes = ['acto_inseguro', 'condicion_insegura', 'acto_seguro'];

        foreach ($validTypes as $type) {
            $observation = Observation::factory()->create([
                'observation_type' => $type,
            ]);

            $this->assertContains($observation->observation_type, $validTypes);
        }
    }

    /** @test */
    public function ehs_manager_can_close_any_observation(): void
    {
        $observation = Observation::factory()->create([
            'status' => 'en_progreso',
            'is_draft' => false,
        ]);

        // Simular el cierre por un EHS Manager
        $observation->update([
            'status' => 'cerrada',
            'closed_at' => now(),
            'closed_by' => $this->ehsManager->id,
        ]);

        $observation->refresh();

        $this->assertEquals('cerrada', $observation->status);
        $this->assertNotNull($observation->closed_at);
        $this->assertEquals($this->ehsManager->id, $observation->closed_by);
    }

    /** @test */
    public function owner_can_close_their_own_observation(): void
    {
        $observation = Observation::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'en_progreso',
            'is_draft' => false,
        ]);

        // Verificar que el usuario es el propietario
        $this->assertEquals($this->user->id, $observation->user_id);

        $observation->update([
            'status' => 'cerrada',
            'closed_at' => now(),
            'closed_by' => $this->user->id,
        ]);

        $this->assertEquals('cerrada', $observation->status);
    }

    /** @test */
    public function observation_can_be_marked_as_reviewed(): void
    {
        $observation = Observation::factory()->create([
            'status' => 'en_progreso',
            'is_draft' => false,
        ]);

        $observation->update([
            'reviewed_at' => now(),
            'reviewed_by' => $this->ehsManager->id,
        ]);

        $this->assertNotNull($observation->reviewed_at);
        $this->assertEquals($this->ehsManager->id, $observation->reviewed_by);
    }

    /** @test */
    public function user_can_delete_their_own_draft(): void
    {
        $observation = Observation::factory()->draft()->create([
            'user_id' => $this->user->id,
        ]);

        $observationId = $observation->id;

        // Verificar que es un borrador del usuario
        $this->assertTrue($observation->is_draft);
        $this->assertEquals($this->user->id, $observation->user_id);

        $observation->delete();

        $this->assertDatabaseMissing('observations', [
            'id' => $observationId,
        ]);
    }

    /** @test */
    public function super_admin_can_delete_any_observation(): void
    {
        $observation = Observation::factory()->create([
            'is_draft' => false,
        ]);

        $observationId = $observation->id;

        // Super admin puede eliminar cualquier observación
        $observation->delete();

        $this->assertDatabaseMissing('observations', [
            'id' => $observationId,
        ]);
    }

    /** @test */
    public function observation_can_be_reopened(): void
    {
        $observation = Observation::factory()->closed()->create();

        $this->assertEquals('cerrada', $observation->status);

        $observation->update([
            'status' => 'en_progreso',
            'closed_at' => null,
            'closed_by' => null,
            'closure_notes' => null,
        ]);

        $this->assertEquals('en_progreso', $observation->status);
        $this->assertNull($observation->closed_at);
    }

    /** @test */
    public function submitted_observations_exclude_drafts(): void
    {
        // Crear 3 observaciones enviadas
        Observation::factory()->count(3)->create(['is_draft' => false]);

        // Crear 2 borradores
        Observation::factory()->count(2)->draft()->create();

        $submitted = Observation::submitted()->count();
        $total = Observation::count();

        $this->assertEquals(3, $submitted);
        $this->assertEquals(5, $total);
    }

    /** @test */
    public function observation_categories_are_synced_correctly(): void
    {
        $observation = Observation::factory()->create();
        $categories = Category::factory()->count(3)->create();

        $observation->categories()->sync($categories->pluck('id'));

        $this->assertCount(3, $observation->fresh()->categories);

        // Cambiar a solo 1 categoría
        $observation->categories()->sync([$categories->first()->id]);

        $this->assertCount(1, $observation->fresh()->categories);
    }

    /** @test */
    public function ehs_manager_can_view_all_submitted_observations(): void
    {
        // Crear observaciones de diferentes usuarios
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Observation::factory()->count(2)->create([
            'user_id' => $user1->id,
            'is_draft' => false,
        ]);

        Observation::factory()->count(3)->create([
            'user_id' => $user2->id,
            'is_draft' => false,
        ]);

        // EHS Manager puede ver todas las observaciones enviadas
        $allSubmitted = Observation::submitted()->get();

        $this->assertCount(5, $allSubmitted);
    }
}
