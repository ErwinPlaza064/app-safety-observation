<?php

namespace Database\Factories;

use App\Models\Observation;
use App\Models\User;
use App\Models\Area;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Observation>
 */
class ObservationFactory extends Factory
{
    protected $model = Observation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'area_id' => Area::factory(),
            'observation_date' => fake()->dateTimeBetween('-1 month', 'now'),
            'observed_person' => fake()->optional(0.7)->name(),
            'observation_type' => fake()->randomElement([
                'acto_inseguro',
                'condicion_insegura',
                'acto_seguro'
            ]),
            'description' => fake()->paragraph(3),
            'status' => 'en_progreso',
            'is_draft' => false,
            'folio' => 'OBS-' . fake()->unique()->numerify('######'),
        ];
    }

    /**
     * Indicate that the observation is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_draft' => true,
            'status' => 'borrador',
        ]);
    }

    /**
     * Indicate that the observation is closed.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cerrada',
            'closed_at' => now(),
            'closed_by' => User::factory(),
        ]);
    }

    /**
     * Indicate that the observation has been reviewed.
     */
    public function reviewed(): static
    {
        return $this->state(fn (array $attributes) => [
            'reviewed_at' => now(),
            'reviewed_by' => User::factory(),
        ]);
    }

    /**
     * Create an unsafe act observation.
     */
    public function unsafeAct(): static
    {
        return $this->state(fn (array $attributes) => [
            'observation_type' => 'acto_inseguro',
        ]);
    }

    /**
     * Create an unsafe condition observation.
     */
    public function unsafeCondition(): static
    {
        return $this->state(fn (array $attributes) => [
            'observation_type' => 'condicion_insegura',
        ]);
    }

    /**
     * Create a safe act observation.
     */
    public function safeAct(): static
    {
        return $this->state(fn (array $attributes) => [
            'observation_type' => 'acto_seguro',
        ]);
    }
}
