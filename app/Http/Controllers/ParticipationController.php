<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Area;
use App\Models\Observation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ParticipationController extends Controller
{
    public function history(Request $request)
    {
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : now()->subMonths(3)->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : now();
        $areaId = $request->input('area_id');
        $search = $request->input('search');

        // Obtener áreas para el filtro
        $areas = Area::active()->get(['id', 'name']);

        // Query principal de empleados (excluyendo managers/admins)
        $query = User::where('is_ehs_manager', false)
            ->where('is_super_admin', false);

        if ($areaId) {
            $query->whereHas('observations', function ($q) use ($areaId) {
                $q->where('area_id', $areaId);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%") // Asumiendo que el email contiene el número de nómina o identificador
                    ->orWhere('employee_number', 'like', "%{$search}%");
            });
        }

        // Obtener la participación agregada por mes en el rango
        $history = $query->withCount(['observations' => function ($q) use ($startDate, $endDate) {
            $q->submitted()->whereBetween('observation_date', [$startDate, $endDate]);
        }])
            ->select('users.id', 'users.name', 'users.email', 'users.employee_number', 'users.area')
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Participation/History', [
            'history' => $history,
            'areas' => $areas,
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'area_id' => $areaId,
                'search' => $search,
            ]
        ]);
    }

    public function observations(Request $request, User $user)
    {
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : now()->subMonths(3)->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : now();

        $observations = Observation::where('user_id', $user->id)
            ->submitted()
            ->whereBetween('observation_date', [$startDate, $endDate])
            ->with(['area', 'user', 'categories', 'images'])
            ->orderBy('observation_date', 'desc')
            ->get();

        return response()->json($observations);
    }
}
