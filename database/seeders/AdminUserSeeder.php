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
        // Verificar si ya existe un usuario EHS Manager
        $ehsManagerExists = User::where('email', 'ehsmanager@wasion.com')->exists();

        if (!$ehsManagerExists) {
            User::create([
                'employee_number' => 'EHSMANAGER001',
                'name' => 'EHS Manager',
                'email' => 'ehsmanager@wasion.com',
                'password' => Hash::make('EhsManager@2025'),
                'area' => 'Seguridad e Higiene',
                'position' => 'Manager EHS',
                'is_ehs_manager' => true,
                'email_verified_at' => now(),
            ]);

            $this->command->info('Usuario EHS Manager creado exitosamente');
            $this->command->info('Email: ehsmanager@wasion.com');
            $this->command->info('Password: EhsManager@2025');
        } else {
            $this->command->warn('El usuario EHS Manager ya existe, saltando creación...');
        }
    }
}
