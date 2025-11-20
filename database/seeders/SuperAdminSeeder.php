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
        // Verificar si ya existe un usuario super admin
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
    }
}
