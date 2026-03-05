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
        \Log::info('Observation store attempt', [
            'user_id' => Auth::id(),
            'type' => $request->observation_type,
            'has_photos' => $request->hasFile('photos'),
        ]);

        $validated = $request->validate([
            'observation_date' => 'required|date',
            'payroll_number' => 'required_unless:observation_type,condicion_insegura',
            'observed_person' => 'required|string|max:255',
            'plant_id' => 'required|exists:plants,id',
            'area_id' => 'required_unless:observation_type,condicion_insegura|nullable|exists:areas,id',
            'observation_type' => 'required|in:acto_inseguro,condicion_insegura,acto_seguro',
            'company' => 'required_unless:observation_type,condicion_insegura|string|max:50',
            'category_ids' => 'required_unless:observation_type,condicion_insegura|array',
            'category_ids.*' => 'exists:categories,id',
            'description' => 'required|string|min:20',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|mimetypes:image/jpeg,image/png,image/gif|max:2048',
            'is_draft' => 'sometimes|nullable',
        ], [
            'payroll_number.required_unless' => 'El número de nómina es obligatorio para actos.',
            'company.required_unless' => 'La empresa es obligatoria para actos.',
            'payroll_number.digits' => 'El número de nómina debe tener exactamente 5 dígitos',
            'observed_person.required' => 'La persona observada o título es obligatorio',
            'category_ids.required_unless' => 'Debe seleccionar al menos una categoría.',
            'area_id.required_unless' => 'El área es obligatoria para actos.',
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
                'company' => $validated['company'] ?? 'WASION',
                'plant_id' => $validated['plant_id'],
                'area_id' => $validated['area_id'] ?? null,
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
                'company' => $validated['company'] ?? 'WASION',
                'plant_id' => $validated['plant_id'],
                'area_id' => $validated['area_id'] ?? null,
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
        \Log::info('Observation update attempt', [
            'id' => $observation->id,
            'user_id' => Auth::id(),
            'has_photos' => $request->hasFile('photos'),
        ]);

        if ($observation->user_id !== Auth::id() && !Auth::user()->is_super_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'observation_date' => 'required|date',
            'payroll_number' => 'required_unless:observation_type,condicion_insegura',
            'observed_person' => 'required|string|max:255',
            'company' => 'required_unless:observation_type,condicion_insegura|string|max:50',
            'plant_id' => 'required|exists:plants,id',
            'area_id' => 'required_unless:observation_type,condicion_insegura|nullable|exists:areas,id',
            'observation_type' => 'required|in:acto_inseguro,condicion_insegura,acto_seguro',
            'category_ids' => 'required_unless:observation_type,condicion_insegura|array',
            'category_ids.*' => 'exists:categories,id',
            'description' => 'required|string|min:20',
            'is_draft' => 'sometimes|nullable',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|mimetypes:image/jpeg,image/png,image/gif|max:2048',
        ], [
            'payroll_number.required_unless' => 'El número de nómina es obligatorio para actos.',
            'company.required_unless' => 'La empresa es obligatoria para actos.',
            'category_ids.required_unless' => 'Debe seleccionar al menos una categoría.',
            'observed_person.required' => 'El título o persona es obligatorio.',
            'description.min' => 'La descripción debe tener al menos 20 caracteres.',
        ]);

        $observation->update([
            'observation_date' => $validated['observation_date'],
            'payroll_number' => $validated['payroll_number'] ?? null,
            'observed_person' => $validated['observed_person'],
            'company' => $validated['company'] ?? 'WASION',
            'plant_id' => $validated['plant_id'],
            'area_id' => $validated['area_id'] ?? null,
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
        // Si no está autenticado, verificar si el enlace compartido ha expirado (7 días)
        if (!Auth::check()) {
            $expirationDays = 7;
            if ($observation->created_at->addDays($expirationDays)->isPast()) {
                return redirect()->route('login')->with('error', 'El enlace compartido ha expirado por seguridad. Por favor, inicia sesión para ver el reporte.');
            }
        }

        // Si es borrador, solo el dueño o admins pueden verlo (requiere login)
        if ($observation->is_draft) {
            if (!Auth::check()) {
                return redirect()->route('login');
            }

            // Si está logado, usar la política
            $this->authorize('view', $observation);
        }

        $observation->load([
            'user',
            'plant',
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
        $observations = $this->getFilteredQuery()->paginate(20);

        return Inertia::render('Observations/Index', [
            'observations' => $observations,
            'filters' => $request->only(['status', 'observation_type', 'area_id', 'plant_id', 'search']),
            'areas' => Area::active()->get(),
            'plants' => \App\Models\Plant::where('is_active', true)->get(),
        ]);
    }

    public function close(Request $request, Observation $observation)
    {
        $this->authorize('close', $observation);

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

    public function reopen(Observation $observation)
    {
        $this->authorize('reopen', $observation);

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

        $query = Observation::with(['user', 'plant', 'area', 'categories', 'closedByUser'])
            ->submitted();

        // Determinar si puede ver todas las plantas
        $canViewAllPlants = $user->is_super_admin || $user->is_ehs_coordinator;
        $requestPlantId = request('plant_id');

        // Calcular el ID de planta actual
        $currentPlantId = $canViewAllPlants
            ? ($requestPlantId !== null && $requestPlantId !== '' ? $requestPlantId : null)
            : $user->plant_id;

        // Aplicar filtro de planta
        if ($currentPlantId !== null && $currentPlantId !== '') {
            $query->where('observations.plant_id', $currentPlantId);
        }

        // Filtro por área
        $query->when(request('area_id'), function ($q, $areaId) {
            $q->where('observations.area_id', $areaId);
        });

        // Filtro por búsqueda de texto
        $query->when(request('search'), function ($q, $search) {
            $q->where(function ($subQ) use ($search) {
                $subQ->where('observations.folio', 'like', "%{$search}%")
                    ->orWhere('observations.description', 'like', "%{$search}%")
                    ->orWhere('observations.observed_person', 'like', "%{$search}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        });

        // Filtro por estado
        $query->when(request('status'), function ($q, $status) {
            $q->where('observations.status', $status);
        });

        // Filtro por tipo de observación (acto/condición)
        $query->when(request('observation_type'), function ($q, $type) {
            $q->where('observations.observation_type', $type);
        });

        return $query->orderByDesc('observations.observation_date')
            ->orderByDesc('observations.created_at');
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
