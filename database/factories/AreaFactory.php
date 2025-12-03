<?php

namespace Database\Factories;

use App\Models\Area;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Area>
 */
class AreaFactory extends Factory
{
    protected $model = Area::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement([
                'Producción',
                'Almacén',
                'Mantenimiento',
                'Oficinas',
                'Laboratorio',
                'Embarques',
                'Calidad',
                'Planta 1',
                'Planta 2',
            ]),
            'code' => fake()->unique()->bothify('AREA-###'),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the area is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
