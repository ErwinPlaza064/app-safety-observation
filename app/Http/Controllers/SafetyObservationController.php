<?php

namespace App\Http\Controllers;

use App\Models\SafetyObservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SafetyObservationController extends Controller
{
    /**
     * Guardar borrador de observación
     */
    public function saveDraft(Request $request)
    {
        $validated = $request->validate([
            'observer_name' => 'required|string|max:255',
            'employee_id' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'observation_date' => 'required|date',
            'observed_person' => 'nullable|string|max:255',
            'area' => 'required|string|max:255',
            'observation_type' => 'nullable|in:unsafe-act,unsafe-condition,safe-act',
            'categories' => 'nullable|array',
            'description' => 'nullable|string',
            'photos' => 'nullable|array',
            'photos.*' => 'image|max:10240', // 10MB max
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'draft';

        // Manejar fotos si existen
        if ($request->hasFile('photos')) {
            $photoPaths = [];
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('safety-observations', 'public');
                $photoPaths[] = $path;
            }
            $validated['photos'] = $photoPaths;
        }

        $observation = SafetyObservation::create($validated);

        return back()->with('success', 'Borrador guardado exitosamente.');
    }

    /**
     * Enviar observación
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'observer_name' => 'required|string|max:255',
            'employee_id' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'observation_date' => 'required|date',
            'observed_person' => 'nullable|string|max:255',
            'area' => 'required|string|max:255',
            'observation_type' => 'required|in:unsafe-act,unsafe-condition,safe-act',
            'categories' => 'required|array|min:1',
            'description' => 'required|string|min:10',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|max:10240',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'submitted';

        // Manejar fotos si existen
        if ($request->hasFile('photos')) {
            $photoPaths = [];
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('safety-observations', 'public');
                $photoPaths[] = $path;
            }
            $validated['photos'] = $photoPaths;
        }

        $observation = SafetyObservation::create($validated);

        return back()->with('success', 'Observación enviada exitosamente.');
    }

    /**
     * Listar observaciones del usuario
     */
    public function index(Request $request)
    {
        $observations = SafetyObservation::forUser($request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('SafetyObservations/Index', [
            'observations' => $observations,
        ]);
    }

    /**
     * Ver una observación específica
     */
    public function show(SafetyObservation $observation)
    {
        // Verificar que el usuario puede ver esta observación
        if ($observation->user_id !== auth()->id() && !auth()->user()->isEhsManager()) {
            abort(403);
        }

        return Inertia::render('SafetyObservations/Show', [
            'observation' => $observation->load('user'),
        ]);
    }

    /**
     * Eliminar observación (solo borradores)
     */
    public function destroy(SafetyObservation $observation)
    {
        // Solo el propietario puede eliminar y solo si es borrador
        if ($observation->user_id !== auth()->id() || !$observation->isDraft()) {
            abort(403);
        }

        // Eliminar fotos asociadas
        if ($observation->photos) {
            foreach ($observation->photos as $photo) {
                Storage::disk('public')->delete($photo);
            }
        }

        $observation->delete();

        return back()->with('success', 'Observación eliminada exitosamente.');
    }

    /**
     * Para EHS Managers - Ver todas las observaciones
     */
    public function ehsIndex(Request $request)
    {
        if (!$request->user()->isEhsManager()) {
            abort(403);
        }

        $observations = SafetyObservation::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('EHS/Observations', [
            'observations' => $observations,
        ]);
    }
}