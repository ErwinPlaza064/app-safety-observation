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
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('areas'),
            ],
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        Area::create($validated);

        return redirect()->back()->with('success', 'Área creada exitosamente');
    }

    /**
     * Actualizar un área existente
     */
    public function update(Request $request, Area $area)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('areas')->ignore($area->id),
            ],
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $area->update([
            'name' => $validated['name'],
            'code' => $validated['code'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->back()->with('success', 'Área actualizada exitosamente');
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
        if ($area->users()->count() > 0 || $area->observations()->count() > 0) {
            return Redirect::route('dashboard')->with('error', 'No se puede eliminar esta área porque tiene registros asociados (usuarios u observaciones). Puedes desactivarla en su lugar.');
        }

        $area->delete();

        return Redirect::route('dashboard')->with('success', 'Área eliminada exitosamente.');
    }
}
