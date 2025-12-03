<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Area;
use App\Models\Observation;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AreaTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function area_can_have_multiple_observations(): void
    {
        $area = Area::factory()->create();
        Observation::factory()->count(3)->create(['area_id' => $area->id]);

        $this->assertCount(3, $area->observations);
    }

    /** @test */
    public function active_scope_returns_only_active_areas(): void
    {
        Area::factory()->count(3)->create(['is_active' => true]);
        Area::factory()->count(2)->inactive()->create();

        $activeAreas = Area::active()->get();

        $this->assertCount(3, $activeAreas);
    }

    /** @test */
    public function area_is_active_is_cast_to_boolean(): void
    {
        $area = Area::factory()->create(['is_active' => 1]);

        $this->assertTrue($area->is_active);
        $this->assertIsBool($area->is_active);
    }

    /** @test */
    public function area_can_be_created_with_code(): void
    {
        $area = Area::factory()->create([
            'name' => 'Producción',
            'code' => 'PROD-001',
            'description' => 'Área de producción principal',
        ]);

        $this->assertEquals('PROD-001', $area->code);
        $this->assertEquals('Producción', $area->name);
    }
}
