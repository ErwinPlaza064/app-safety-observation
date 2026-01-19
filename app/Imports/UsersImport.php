<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UsersImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Si el usuario ya existe por email o número de empleado, no lo duplicamos
        $existingUser = User::where('email', $row['email'])
            ->orWhere('employee_number', $row['no_empleado'])
            ->first();

        if ($existingUser) {
            return null;
        }

        $plant = \App\Models\Plant::where('name', $row['planta'])->first();
        $area = \App\Models\Area::where('name', $row['area'])->first();

        return new User([
            'name'              => $row['nombre'],
            'email'             => $row['email'],
            'employee_number'   => $row['no_empleado'],
            'plant_id'          => $plant ? $plant->id : null,
            'area_id'           => $area ? $area->id : null,
            'area'              => $row['area'], // Legacy
            'position'          => $row['puesto'],
            'password'          => Hash::make($row['password'] ?? 'Wasion2025*'),
            'email_verified_at' => null,
            'is_ehs_manager'    => strtolower($row['es_gerente_ehs'] ?? '') === 'si',
            'is_ehs_coordinator' => strtolower($row['es_coordinador_ehs'] ?? '') === 'si',
        ]);
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'no_empleado' => 'required|max:50',
            'planta' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'puesto' => 'required|string|max:255',
        ];
    }
}
