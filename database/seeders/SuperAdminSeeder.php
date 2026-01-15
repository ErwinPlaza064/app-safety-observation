<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminExists = User::where('email', 'superadmin@wasion.com')->exists();

        if (!$superAdminExists) {
            User::create([
                'employee_number' => 'SUPERADMIN001',
                'name' => 'Super Administrador',
                'email' => 'superadmin@wasion.com',
                'password' => Hash::make('SuperAdmin@2025'),
                'area' => 'Tecnologías de la Información',
                'position' => 'Super Administrador',
                'is_ehs_manager' => true,
                'is_super_admin' => true,
                'email_verified_at' => now(),
            ]);

            $this->command->info('Usuario Super Admin creado exitosamente');
            $this->command->info('Email: superadmin@wasion.com');
            $this->command->info('Password: SuperAdmin@2025');
        } else {
            $this->command->warn('El usuario Super Admin ya existe, saltando creación...');
        }

        // --- COORDINADOR EHS (VISTA GLOBAL) ---
        $coordinatorExists = User::where('email', 'ehsmanager@wasion.com')->exists();

        if (!$coordinatorExists) {
            User::create([
                'employee_number' => 'EHS-COORD',
                'name' => 'Coordinador EHS',
                'email' => 'ehsmanager@wasion.com',
                'password' => Hash::make('Wasion2025*'),
                'area' => 'Planta 1',
                'position' => 'Coordinador',
                'is_ehs_manager' => true,
                'is_ehs_coordinator' => true,
                'email_verified_at' => now(),
            ]);

            $this->command->info('Usuario Coordinador EHS creado exitosamente');
        } else {
            // Asegurar que si existe tenga los permisos correctos
            User::where('email', 'ehsmanager@wasion.com')->update([
                'is_ehs_manager' => true,
                'is_ehs_coordinator' => true
            ]);
            $this->command->warn('El usuario Coordinador ya existe, permisos actualizados...');
        }
    }
}
