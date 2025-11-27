<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $managers = [
            [
                'email' => 'ehsplanta1@wasion.com',
                'name' => 'EHS Planta 1',
                'area' => 'Planta 1',
                'position' => 'Ingeniero de Seguridad',
            ],
            [
                'email' => 'ehsplanta3@wasion.com',
                'name' => 'EHS Planta 3',
                'area' => 'Planta 3',
                'position' => 'Ingeniero de Seguridad',
            ],
            [
                'email' => 'ehsplanta5@wasion.com',
                'name' => 'EHS Planta 5',
                'area' => 'Planta 5',
                'position' => 'Ingeniero de Seguridad',
            ],
        ];

        foreach ($managers as $manager) {
            $exists = User::where('email', $manager['email'])->exists();

            if (!$exists) {
                User::create([
                    'employee_number' => 'EHS-' . strtoupper(str_replace(' ', '', $manager['area'])),
                    'name' => $manager['name'],
                    'email' => $manager['email'],
                    'password' => Hash::make('Wasion2025'),
                    'area' => $manager['area'],
                    'position' => $manager['position'],
                    'is_ehs_manager' => true,
                    'email_verified_at' => now(),
                ]);
                $this->command->info("Usuario creado: {$manager['email']}");
            } else {
                $this->command->warn("El usuario {$manager['email']} ya existe.");
            }
        }

    }
}
