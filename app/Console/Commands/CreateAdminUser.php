<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:make-admin {--super : Crear como Super Admin con privilegios totales}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crear un usuario administrador (EHS Manager o Super Admin)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isSuperAdmin = $this->option('super');

        $this->info($isSuperAdmin ? '=== Crear Super Administrador ===' : '=== Crear Usuario Administrador EHS ===');
        $this->newLine();

        // Solicitar información
        $name = $this->ask('Nombre completo');
        $employeeNumber = $this->ask('Número de empleado');
        $email = $this->ask('Correo electrónico');
        $area = $this->ask('Área');
        $position = $this->ask('Puesto');
        $password = $this->secret('Contraseña');
        $passwordConfirmation = $this->secret('Confirmar contraseña');

        // Validar datos
        $validator = Validator::make([
            'name' => $name,
            'employee_number' => $employeeNumber,
            'email' => $email,
            'area' => $area,
            'position' => $position,
            'password' => $password,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'employee_number' => ['required', 'string', 'unique:users,employee_number', 'max:50'],
            'email' => ['required', 'string', 'email', 'unique:users,email', 'max:255'],
            'area' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            $this->newLine();
            $this->error('Error de validación:');
            foreach ($validator->errors()->all() as $error) {
                $this->error("  - {$error}");
            }
            return 1;
        }

        // Verificar que las contraseñas coincidan
        if ($password !== $passwordConfirmation) {
            $this->newLine();
            $this->error('Las contraseñas no coinciden.');
            return 1;
        }

        // Confirmar creación
        $this->newLine();

        $tableData = [
            ['Nombre', $name],
            ['Número de empleado', $employeeNumber],
            ['Email', $email],
            ['Área', $area],
            ['Puesto', $position],
            ['EHS Manager', 'Sí'],
        ];

        if ($isSuperAdmin) {
            $tableData[] = ['Super Admin', '⚡ Sí (Privilegios totales)'];
        }

        $this->table(['Campo', 'Valor'], $tableData);

        if (!$this->confirm('¿Crear este usuario administrador?', true)) {
            $this->warn('Operación cancelada.');
            return 0;
        }

        // Crear usuario
        try {
            $userData = [
                'name' => $name,
                'employee_number' => $employeeNumber,
                'email' => $email,
                'area' => $area,
                'position' => $position,
                'password' => Hash::make($password),
                'is_ehs_manager' => true,
                'email_verified_at' => now(),
            ];

            if ($isSuperAdmin) {
                $userData['is_super_admin'] = true;
            }

            $user = User::create($userData);

            $this->newLine();
            $this->info('✓ Usuario administrador creado exitosamente.');
            $this->info("  ID: {$user->id}");
            $this->info("  Email: {$user->email}");
            if ($isSuperAdmin) {
                $this->info("  Tipo: ⚡ Super Administrador");
            }

            return 0;
        } catch (\Exception $e) {
            $this->newLine();
            $this->error('Error al crear el usuario:');
            $this->error("  {$e->getMessage()}");
            return 1;
        }
    }
}
