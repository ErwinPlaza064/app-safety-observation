<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'EPP (Equipo de Protección Personal)',
            'Manejo de SQP',
            'Actividades Ergonómicas',
            'Comportamiento',
            'Manejo de Materiales',
            'Ingesta de sustancias',
            'Orden y Limpieza',
            'Trabajos Eléctricos',
            'Mal uso de herramientas',
            'Otro',
        ];

        foreach ($categories as $i => $cat) {
            DB::table('categories')->insert([
                'name' => $cat,
                'sort_order' => $i + 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
