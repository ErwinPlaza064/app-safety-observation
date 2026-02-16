<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar áreas que fueron creadas erróneamente con nombres de plantas
        // Ya que las áreas ahora son globales e independientes de las plantas.
        \App\Models\Area::where('name', 'like', 'Planta%')
            ->delete();

        $this->command->info('Áreas duplicadas (Plantas) eliminadas de la tabla de áreas.');
    }
}
