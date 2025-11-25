<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'employee_number' => ['required', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'area' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'is_ehs_manager' => ['boolean'],
        ]);

        $user->update([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'employee_number' => $validated['employee_number'],
        'area' => $validated['area'],
        'position' => $validated['position'],
        'is_ehs_manager' => $request->boolean('is_ehs_manager'),
        ]);

        return Redirect::route('dashboard')->with('success', 'Usuario actualizado exitosamente');
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return Redirect::route('dashboard')->with('error', 'No puedes eliminar tu propia cuenta');
        }

        $user->delete();

        return Redirect::route('dashboard')->with('success', 'Usuario eliminado exitosamente');
    }
}
