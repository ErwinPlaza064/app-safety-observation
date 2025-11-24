<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            'Planta 1', 'Planta 2', 'Planta 3', 'Planta 4', 'Planta 5',
            'Planta 6', 'Planta 7', 'Almacén', 'Oficinas', 'Comedor', 'Estacionamiento'
        ];

        foreach ($areas as $area) {
            DB::table('areas')->insert([
                'name' => $area,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
