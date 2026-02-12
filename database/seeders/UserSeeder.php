<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- USUARIO EMPLEADO (PARA PRUEBAS) ---
        $employeeExists = User::where('email', 'employee@wasion.com')->exists();

        if (!$employeeExists) {
            User::create([
                'employee_number' => 'EMP-001',
                'name' => 'Empleado de Prueba',
                'email' => 'employee@wasion.com',
                'password' => Hash::make('password'),
                'area' => 'Producción',
                'position' => 'Operador',
                'is_ehs_manager' => false,
                'is_super_admin' => false,
                'email_verified_at' => now(),
            ]);

            $this->command->info('Usuario Empleado creado exitosamente: employee@wasion.com');
        }
    }
}
