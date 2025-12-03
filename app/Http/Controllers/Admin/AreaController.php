<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class AreaController extends Controller
{
    /**
     * Almacenar una nueva área
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:areas'],
            'code' => ['nullable', 'string', 'max:20', 'unique:areas'],
            'description' => ['nullable', 'string', 'max:500'],
        ], [
            'name.required' => 'El nombre del área es obligatorio.',
            'name.unique' => 'Ya existe un área con ese nombre.',
            'code.unique' => 'Ya existe un área con ese código.',
        ]);

        Area::create([
            'name' => $validated['name'],
            'code' => $validated['code'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        return Redirect::route('dashboard')->with('success', 'Área creada exitosamente.');
    }

    /**
     * Actualizar un área existente
     */
    public function update(Request $request, Area $area)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('areas')->ignore($area->id)],
            'code' => ['nullable', 'string', 'max:20', Rule::unique('areas')->ignore($area->id)],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ], [
            'name.required' => 'El nombre del área es obligatorio.',
            'name.unique' => 'Ya existe un área con ese nombre.',
            'code.unique' => 'Ya existe un área con ese código.',
        ]);

        $area->update([
            'name' => $validated['name'],
            'code' => $validated['code'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return Redirect::route('dashboard')->with('success', 'Área actualizada exitosamente.');
    }

    /**
     * Alternar estado activo/inactivo del área
     */
    public function toggleStatus(Area $area)
    {
        $area->update([
            'is_active' => !$area->is_active,
        ]);

        $status = $area->is_active ? 'activada' : 'desactivada';

        return Redirect::route('dashboard')->with('success', "Área {$status} exitosamente.");
    }

    /**
     * Eliminar un área
     */
    public function destroy(Area $area)
    {
        // Verificar si hay observaciones asociadas
        if ($area->observations()->count() > 0) {
            return Redirect::route('dashboard')->with('error', 'No se puede eliminar esta área porque tiene observaciones asociadas. Puedes desactivarla en su lugar.');
        }

        $area->delete();

        return Redirect::route('dashboard')->with('success', 'Área eliminada exitosamente.');
    }
}
