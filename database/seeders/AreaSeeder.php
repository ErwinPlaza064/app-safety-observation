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
        $areas = [
            'Planta 1',
            'Planta 3',
            'Planta 5',
            'Planta 7',
        ];

        foreach ($areas as $areaName) {
            Area::firstOrCreate(
                ['name' => $areaName],
                ['is_active' => true]
            );
        }
    }
}
