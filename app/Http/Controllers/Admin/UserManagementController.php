<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserManagementController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'employee_number' => ['required', 'string', 'max:50', 'unique:users'],
            'plant_id' => ['required', 'exists:plants,id'],
            'area_id' => ['required', 'exists:areas,id'],
            'position' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
            'is_ehs_manager' => ['boolean'],
            'is_ehs_coordinator' => ['boolean'],
        ]);

        $areaName = \App\Models\Area::find($validated['area_id'])->name;

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'employee_number' => $validated['employee_number'],
            'plant_id' => $validated['plant_id'],
            'area_id' => $validated['area_id'],
            'area' => $areaName, // Mantener por compatibilidad legacy
            'position' => $validated['position'],
            'password' => Hash::make($validated['password']),
            'is_ehs_manager' => $request->boolean('is_ehs_manager'),
            'is_ehs_coordinator' => $request->boolean('is_ehs_coordinator'),
            'email_verified_at' => now(),
        ]);

        return Redirect::route('dashboard')->with('success', 'Usuario creado y verificado exitosamente.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'employee_number' => ['required', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'plant_id' => ['required', 'exists:plants,id'],
            'area_id' => ['required', 'exists:areas,id'],
            'position' => ['required', 'string', 'max:255'],
            'is_ehs_manager' => ['boolean'],
            'is_ehs_coordinator' => ['boolean'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $areaName = \App\Models\Area::find($validated['area_id'])->name;

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'employee_number' => $validated['employee_number'],
            'plant_id' => $validated['plant_id'],
            'area_id' => $validated['area_id'],
            'area' => $areaName, // Mantener legacy
            'position' => $validated['position'],
            'is_ehs_manager' => $request->boolean('is_ehs_manager'),
            'is_ehs_coordinator' => $request->boolean('is_ehs_coordinator'),
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return Redirect::route('dashboard')->with('success', 'Usuario actualizado exitosamente');
    }

    public function resendVerification(User $user)
    {
        if ($user->hasVerifiedEmail()) {
            return back()->with('error', 'El usuario ya verificó su correo.');
        }

        $user->sendEmailVerificationNotification();

        return back()->with('success', 'Correo de verificación reenviado exitosamente.');
    }

    /**
     * Verificar manualmente un usuario (sin necesidad de código)
     */
    public function manualVerify(User $user)
    {
        if ($user->hasVerifiedEmail()) {
            return back()->with('error', 'El usuario ya está verificado.');
        }

        $user->markEmailAsVerified();

        return back()->with('success', 'Usuario verificado manualmente exitosamente.');
    }

    /**
     * Suspender o reactivar un usuario
     */
    public function toggleSuspension(Request $request, User $user)
    {
        // No permitir auto-suspensión
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'No puedes suspender tu propia cuenta.');
        }

        // No permitir suspender a otros super admins
        if ($user->is_super_admin && !$user->is_suspended) {
            return back()->with('error', 'No puedes suspender a otro Super Admin.');
        }

        if ($user->is_suspended) {
            // Reactivar usuario
            $user->update([
                'is_suspended' => false,
                'suspended_at' => null,
                'suspension_reason' => null,
            ]);

            return back()->with('success', 'Usuario reactivado exitosamente.');
        } else {
            // Suspender usuario
            $request->validate([
                'reason' => ['nullable', 'string', 'max:255'],
            ]);

            $user->update([
                'is_suspended' => true,
                'suspended_at' => now(),
                'suspension_reason' => $request->input('reason', 'Suspendido por administrador'),
            ]);

            return back()->with('success', 'Usuario suspendido exitosamente.');
        }
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return Redirect::route('dashboard')->with('error', 'No puedes eliminar tu propia cuenta');
        }

        $user->delete();

        return Redirect::route('dashboard')->with('success', 'Usuario eliminado exitosamente');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            Excel::import(new UsersImport, $request->file('file'));
            return back()->with('success', 'Usuarios importados exitosamente.');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];
            foreach ($failures as $failure) {
                $errors[] = "Fila {$failure->row()}: " . implode(', ', $failure->errors());
            }
            return back()->with('error', 'Error de validación en el archivo: ' . implode(' | ', array_slice($errors, 0, 3)));
        } catch (\Exception $e) {
            return back()->with('error', 'Error al importar archivo: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="formato_importacion_usuarios.csv"',
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            // Añadir BOM para que Excel detecte UTF-8 correctamente
            fputs($file, $bom = (chr(0xEF) . chr(0xBB) . chr(0xBF)));

            // Encabezados
            fputcsv($file, [
                'nombre',
                'email',
                'no_empleado',
                'planta',
                'area',
                'puesto',
                'password',
                'es_gerente_ehs',
                'es_coordinador_ehs'
            ]);

            // Ejemplo
            fputcsv($file, [
                'Juan Perez',
                'juan.perez@wasion.com',
                '12345',
                'Planta 1',
                'Mantenimiento',
                'Operador',
                'Wasion2025*',
                'No',
                'No'
            ]);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
