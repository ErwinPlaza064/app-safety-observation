<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuarios administradores
        $this->call([
            AdminUserSeeder::class,
            SuperAdminSeeder::class,
        ]);
    }
}
