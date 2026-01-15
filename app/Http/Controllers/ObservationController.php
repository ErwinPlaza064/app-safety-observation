<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Observation;
use App\Models\Area;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Exports\ObservationsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ObservationController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'observation_date' => 'required|date',
            'payroll_number' => 'required_unless:observation_type,condicion_insegura',
            'observed_person' => 'required|string|max:255',
            'area_id' => 'required|exists:areas,id',
            'observation_type' => 'required|in:acto_inseguro,condicion_insegura,acto_seguro',
            'category_ids' => 'required_unless:observation_type,condicion_insegura|array',
            'category_ids.*' => 'exists:categories,id',
            'description' => 'required|string|min:20',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_draft' => 'sometimes|nullable',
        ], [
            'payroll_number.required_unless' => 'El número de nómina es obligatorio para actos.',
            'payroll_number.digits' => 'El número de nómina debe tener exactamente 5 dígitos',
            'observed_person.required' => 'La persona observada o título es obligatorio',
            'category_ids.required_unless' => 'Debe seleccionar al menos una categoría.',
        ]);

        $user = Auth::user();
        $observation = Observation::where('user_id', $user->id)
            ->where('is_draft', true)
            ->first();

        if ($observation) {
            $observation->update([
                'observation_date' => $validated['observation_date'],
                'payroll_number' => $validated['payroll_number'] ?? null,
                'observed_person' => $validated['observed_person'],
                'area_id' => $validated['area_id'],
                'observation_type' => $validated['observation_type'],
                'description' => $validated['description'],
                'status' => $request->boolean('is_draft') ? 'borrador' : 'en_progreso',
                'is_draft' => $request->boolean('is_draft'),
            ]);
        } else {
            $folio = 'OBS-' . date('Ymd') . '-' . $user->id . '-' . time();

            $observation = Observation::create([
                'user_id' => $user->id,
                'observation_date' => $validated['observation_date'],
                'payroll_number' => $validated['payroll_number'] ?? null,
                'observed_person' => $validated['observed_person'],
                'area_id' => $validated['area_id'],
                'observation_type' => $validated['observation_type'],
                'description' => $validated['description'],
                'status' => $request->boolean('is_draft') ? 'borrador' : 'en_progreso',
                'is_draft' => $request->boolean('is_draft'),
                'folio' => $folio,
            ]);
        }

        if (isset($validated['category_ids'])) {
            $observation->categories()->sync($validated['category_ids']);
        } else {
            $observation->categories()->detach();
        }

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

        return redirect()->back()->with(
            'success',
            $request->boolean('is_draft')
                ? 'Borrador guardado exitosamente'
                : 'Observación enviada exitosamente'
        );
    }

    public function update(Request $request, Observation $observation)
    {
        if ($observation->user_id !== Auth::id() && !Auth::user()->is_super_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'observation_date' => 'required|date',
            'payroll_number' => 'required_unless:observation_type,condicion_insegura',
            'observed_person' => 'required|string|max:255',
            'area_id' => 'required|exists:areas,id',
            'observation_type' => 'required|in:acto_inseguro,condicion_insegura,acto_seguro',
            'category_ids' => 'required_unless:observation_type,condicion_insegura|array',
            'category_ids.*' => 'exists:categories,id',
            'description' => 'required|string|min:20',
            'is_draft' => 'sometimes|nullable',
            'photos' => 'nullable|array|max:5',
        ], [
            'payroll_number.required_unless' => 'El número de nómina es obligatorio para actos.',
            'category_ids.required_unless' => 'Debe seleccionar al menos una categoría.',
            'observed_person.required' => 'El título o persona es obligatorio.',
            'description.min' => 'La descripción debe tener al menos 20 caracteres.',
        ]);

        $observation->update([
            'observation_date' => $validated['observation_date'],
            'payroll_number' => $validated['payroll_number'] ?? null,
            'observed_person' => $validated['observed_person'],
            'area_id' => $validated['area_id'],
            'observation_type' => $validated['observation_type'],
            'description' => $validated['description'],
            'status' => $request->boolean('is_draft') ? 'borrador' : 'en_progreso',
            'is_draft' => $request->boolean('is_draft'),
        ]);

        if (isset($validated['category_ids'])) {
            $observation->categories()->sync($validated['category_ids']);
        } else {
            $observation->categories()->detach();
        }

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $photo) {
                $path = $photo->store('observations/' . $observation->id, 'public');

                $nextOrder = $observation->images()->max('sort_order') + 1;

                $observation->images()->create([
                    'path' => $path,
                    'original_name' => $photo->getClientOriginalName(),
                    'size' => $photo->getSize(),
                    'sort_order' => $nextOrder + $index,
                ]);
            }
        }

        return redirect()->back()->with(
            'success',
            $request->boolean('is_draft')
                ? 'Borrador actualizado exitosamente'
                : 'Observación actualizada y enviada'
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
        $query = Observation::with(['user', 'area', 'categories', 'closedByUser'])
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
        if (Auth::user()->is_ehs_manager || $observation->user_id === Auth::id()) {
            $validated = $request->validate([
                'closure_notes' => 'required|string|min:10',
                'photos' => 'nullable|array|max:5',
                'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'closure_notes.required' => 'El comentario de cierre es obligatorio',
                'closure_notes.min' => 'El comentario debe tener al menos 10 caracteres',
            ]);

            $observation->update([
                'status' => 'cerrada',
                'closed_at' => now(),
                'closed_by' => Auth::id(),
                'closure_notes' => $validated['closure_notes'],
            ]);

            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $index => $photo) {
                    $path = $photo->store('observations/' . $observation->id . '/closure', 'public');

                    $nextOrder = $observation->images()->max('sort_order') + 1;

                    $observation->images()->create([
                        'path' => $path,
                        'original_name' => $photo->getClientOriginalName(),
                        'size' => $photo->getSize(),
                        'sort_order' => $nextOrder + $index,
                    ]);
                }
            }

            return redirect()->back()->with('success', 'Observación cerrada exitosamente con evidencia');
        }
        abort(403);
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
        $user = Auth::user();

        if ($observation->is_draft && $observation->user_id === $user->id) {
            $observation->delete();
            return redirect()->back()->with('success', 'Borrador eliminado');
        }

        if ($user->is_super_admin) {
            $observation->delete();
            return redirect()->back()->with('success', 'Observación eliminada');
        }

        abort(403, 'No autorizado');
    }


    /**
     * Helper para construir la consulta filtrada según rol y parámetros.
     */
    private function getFilteredQuery()
    {
        $user = Auth::user();

        $query = Observation::with(['user', 'area', 'categories', 'closedByUser'])->submitted();

        if ($user->is_ehs_manager && !$user->is_super_admin) {
            $canViewAllPlants = $user->is_ehs_coordinator || $user->is_super_admin;

            if (!$canViewAllPlants) {
                $managerArea = Area::where('name', $user->area)->first();
                $managerAreaId = $managerArea ? $managerArea->id : null;

                if ($managerAreaId) {
                    $query->where('area_id', $managerAreaId);
                }
            }

            $query->when(request('area_id'), function ($q, $areaId) {
                $q->where('area_id', $areaId);
            });
        } else {
            $query->when(request('area_id'), function ($q, $areaId) {
                $q->where('area_id', $areaId);
            });
        }

        $query->when(request('search'), function ($q, $search) {
            $q->where(function ($subQ) use ($search) {
                $subQ->where('folio', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('observed_person', 'like', "%{$search}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        });

        $query->when(request('status'), function ($q, $status) {
            $q->where('status', $status);
        });

        return $query->latest('observation_date');
    }

    public function exportPdf(Request $request)
    {
        $observations = $this->getFilteredQuery()->get();

        // Calcular estadísticas
        $stats = [
            'total' => $observations->count(),
            'abiertas' => $observations->where('status', 'en_progreso')->count(),
            'cerradas' => $observations->where('status', 'cerrada')->count(),
            'actos_inseguros' => $observations->where('observation_type', 'acto_inseguro')->count(),
            'condiciones_inseguras' => $observations->where('observation_type', 'condicion_insegura')->count(),
            'actos_seguros' => $observations->where('observation_type', 'acto_seguro')->count(),
        ];

        $pdf = Pdf::loadView('exports.observations_pdf', compact('observations', 'stats'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('reporte_seguridad_' . date('Y-m-d') . '.pdf');
    }

    public function exportCsv(Request $request)
    {
        $query = $this->getFilteredQuery();

        return Excel::download(
            new ObservationsExport($query),
            'reporte_seguridad_' . date('Y-m-d') . '.xlsx',
            \Maatwebsite\Excel\Excel::XLSX
        );
    }
}
