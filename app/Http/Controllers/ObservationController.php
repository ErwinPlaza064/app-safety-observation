<?php

namespace App\Http\Controllers;
use App\Models\Observation;
use App\Models\Area;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ObservationController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'observation_date' => 'required|date',
            'observed_person' => 'nullable|string|max:255',
            'area_id' => 'required|exists:areas,id',
            'observation_type' => 'required|in:acto_inseguro,condicion_insegura,acto_seguro',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            'description' => 'required|string|min:20',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240',
            'is_draft' => 'boolean',
        ]);


        // Generar folio único: OBS-{año}{mes}{id_usuario}-{timestamp}
        $folio = 'OBS-' . date('Ymd') . '-' . auth()->id() . '-' . time();

        $observation = Observation::create([
            'user_id' => auth()->id(),
            'observation_date' => $validated['observation_date'],
            'observed_person' => $validated['observed_person'],
            'area_id' => $validated['area_id'],
            'observation_type' => $validated['observation_type'],
            'description' => $validated['description'],
            'status' => $request->boolean('is_draft') ? 'borrador' : 'en_progreso',
            'is_draft' => $request->boolean('is_draft'),
            'folio' => $folio,
        ]);


        $observation->categories()->attach(array_unique($validated['category_ids']));


        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $photo) {
                $path = $photo->store('observations/' . $observation->id, 'public');

                $observation->images()->create([
                    'path' => $path,
                    'original_name' => $photo->getClientOriginalName(),
                    'size' => $photo->getSize(),
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->back()->with('success',
            $request->boolean('is_draft')
                ? 'Borrador guardado exitosamente'
                : 'Observación enviada exitosamente'
        );
    }


    public function draft(Request $request)
    {
        return $this->store($request->merge(['is_draft' => true]));
    }


    public function show(Observation $observation)
    {

        $observation->load([
            'user',
            'area',
            'categories',
            'images',
            'closedByUser'
        ]);

        return Inertia::render('Observations/Show', [
            'observation' => $observation
        ]);
    }


    public function index(Request $request)
    {
        $query = Observation::with(['user', 'area', 'categories'])
            ->submitted()
            ->latest('observation_date');


        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('observation_type')) {
            $query->where('observation_type', $request->observation_type);
        }

        if ($request->filled('area_id')) {
            $query->where('area_id', $request->area_id);
        }

        $observations = $query->paginate(20);

        return Inertia::render('Observations/Index', [
            'observations' => $observations,
            'filters' => $request->only(['status', 'observation_type', 'area_id']),
            'areas' => Area::active()->get(),
        ]);
    }


    public function close(Request $request, Observation $observation)
    {
        $this->authorize('manage', Observation::class);

        $validated = $request->validate([
            'closure_notes' => 'nullable|string|max:1000',
        ]);

        $observation->close(
            $validated['closure_notes'] ?? null,
            auth()->id()
        );

        return redirect()->back()->with('success', 'Observación cerrada exitosamente');
    }


    public function reopen(Observation $observation)
    {
        $this->authorize('manage', Observation::class);

        $observation->update([
            'status' => 'en_progreso',
            'closed_at' => null,
            'closed_by' => null,
            'closure_notes' => null,
        ]);

        return redirect()->back()->with('success', 'Observación reabierta');
    }


    public function destroy(Observation $observation)
    {

        if ($observation->is_draft && $observation->user_id === auth()->id()) {
            $observation->delete();
            return redirect()->back()->with('success', 'Borrador eliminado');
        }


        if (auth()->user()->is_super_admin) {
            $observation->delete();
            return redirect()->back()->with('success', 'Observación eliminada');
        }

        abort(403, 'No autorizado');
    }
}
