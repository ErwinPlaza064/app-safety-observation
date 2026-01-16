<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class PlantController extends Controller
{
    /**
     * Almacenar una nueva planta
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:plants'],
            'is_active' => ['boolean'],
        ], [
            'name.required' => 'El nombre de la planta es obligatorio.',
            'name.unique' => 'Ya existe una planta con ese nombre.',
        ]);

        Plant::create([
            'name' => $validated['name'],
            'is_active' => true,
        ]);

        return Redirect::route('dashboard')->with('success', 'Planta creada exitosamente.');
    }

    /**
     * Actualizar una planta existente
     */
    public function update(Request $request, Plant $plant)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('plants')->ignore($plant->id)],
            'is_active' => ['boolean'],
        ], [
            'name.required' => 'El nombre de la planta es obligatorio.',
            'name.unique' => 'Ya existe una planta con ese nombre.',
        ]);

        $plant->update([
            'name' => $validated['name'],
            'is_active' => $request->boolean('is_active', $plant->is_active),
        ]);

        return Redirect::route('dashboard')->with('success', 'Planta actualizada exitosamente.');
    }

    /**
     * Alternar estado de la planta
     */
    public function toggleStatus(Plant $plant)
    {
        $plant->update([
            'is_active' => !$plant->is_active,
        ]);

        $status = $plant->is_active ? 'activada' : 'desactivada';

        return Redirect::route('dashboard')->with('success', "Planta {$status} exitosamente.");
    }

    /**
     * Eliminar una planta
     */
    public function destroy(Plant $plant)
    {
        // Verificar si hay áreas, usuarios u observaciones asociadas
        if ($plant->users()->count() > 0 || $plant->observations()->count() > 0) {
            return Redirect::route('dashboard')->with('error', 'No se puede eliminar esta planta porque tiene registros asociados. Puedes desactivarla en su lugar.');
        }

        $plant->delete();

        return Redirect::route('dashboard')->with('success', 'Planta eliminada exitosamente.');
    }
}
