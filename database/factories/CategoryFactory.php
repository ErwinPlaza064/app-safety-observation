<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement([
                'EPP',
                'Orden y Limpieza',
                'Manejo de SQP',
                'Trabajos en Altura',
                'Trabajos Eléctricos',
                'Manejo de Cargas',
                'Uso de Herramientas',
                'Señalización',
                'Bloqueo/Etiquetado',
                'Ergonomía',
            ]),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
