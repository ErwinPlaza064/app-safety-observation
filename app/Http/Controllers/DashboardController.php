<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Category;
use App\Models\Observation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request as RequestFacade;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $data = [];

        // 1. LÓGICA PARA SUPER ADMIN
        // ==========================================
        if ($user->is_super_admin) {
            $data['stats'] = [
                'total_users' => User::count(),
                'verified_users' => User::whereNotNull('email_verified_at')->count(),
                'ehs_managers' => User::where('is_ehs_manager', true)->count(),
                'super_admins' => User::where('is_super_admin', true)->count(),
            ];

            $usersQuery = User::query()
                ->addSelect(['last_activity' => DB::table('sessions')
                    ->select('last_activity')
                    ->whereColumn('user_id', 'users.id')
                    ->orderByDesc('last_activity')
                    ->limit(1)
                ])
                ->when(request('search'), function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_number', 'like', "%{$search}%");
                    });
                })
                ->when(request('area'), function ($query, $area) {
                    $query->where('area', $area);
                })
                ->when(request('role'), function ($query, $role) {
                    if ($role === 'admin') $query->where('is_super_admin', true);
                    elseif ($role === 'manager') $query->where('is_ehs_manager', true);
                    elseif ($role === 'employee') $query->where('is_super_admin', false)->where('is_ehs_manager', false);
                })
                ->when(request('status'), function ($query, $status) {
                    if ($status === 'verified') $query->whereNotNull('email_verified_at');
                    elseif ($status === 'pending') $query->whereNull('email_verified_at');
                })
                ->orderByDesc('created_at');

            $data['users'] = $usersQuery->paginate(10)->withQueryString();

            $data['filters'] = request()->only(['search', 'area', 'role', 'status']);
            $data['filterAreas'] = User::select('area')->distinct()->whereNotNull('area')->pluck('area');

        }

        // ==========================================
        // 2. LÓGICA PARA EMPLEADO REGULAR
        // ==========================================
        if (!$user->is_super_admin && !$user->is_ehs_manager) {
            $data['areas'] = Area::where('is_active', true)->get();
            $data['categories'] = Category::where('is_active', true)->get();

            $data['userStats'] = [
                'in_progress' => Observation::where('user_id', $user->id)->where('status', 'en_progreso')->count(),
                'completed'   => Observation::where('user_id', $user->id)->where('status', 'cerrada')->count(),
                'total'       => Observation::where('user_id', $user->id)->where('is_draft', false)->count(),
            ];

            if (request('filter_status')) {
                $data['filteredReports'] = Observation::where('user_id', $user->id)
                    ->where('is_draft', false)
                    ->where('status', request('filter_status'))
                    ->with(['area', 'user'])
                    ->latest()
                    ->get();
            }

            $data['myObservations'] = Observation::where('user_id', $user->id)
                                        ->where('is_draft', false)
                                        ->with(['area', 'user', 'images', 'categories', 'reviewedByUser'])
                                        ->latest('observation_date')
                                        ->take(10)
                                        ->get();

            $draft = Observation::where('user_id', $user->id)
                        ->where('is_draft', true)
                        ->latest()
                        ->first();

            if ($draft) {
                $draft->load(['categories', 'images']);
            }

            $data['savedDraft'] = $draft;

            // Notificaciones para empleado: observaciones revisadas por EHS que puede cerrar
            $reviewedNotifications = Observation::where('user_id', $user->id)
                ->where('is_draft', false)
                ->where('status', 'en_progreso')
                ->whereNotNull('reviewed_at')
                ->with(['area', 'reviewedByUser'])
                ->latest('reviewed_at')
                ->get();

            $data['employeeNotifications'] = $reviewedNotifications;
            $data['employeeNotificationCount'] = $reviewedNotifications->count();
        }

        // 3. LÓGICA PARA EHS MANAGER (OPTIMIZADO - Sin perder funcionalidad)
        // ==========================================
        if ($user->is_ehs_manager && !$user->is_super_admin) {

            $data['areas'] = Area::where('is_active', true)->get();

            $userPlant = Area::where('name', $user->area)->first();
            $defaultAreaId = $userPlant ? $userPlant->id : null;

            $currentAreaId = request()->has('area_id') ? request('area_id') : $defaultAreaId;

            // Configurar relaciones optimizadas (solo campos necesarios)
            $baseRelations = [
                'user:id,name,email,area',
                'area:id,name'
            ];

            $query = Observation::with(array_merge($baseRelations, ['categories:id,name', 'images:id,observation_id,path']))
                ->submitted();

            if (request('search')) {
                $search = request('search');
                $query->where(function($q) use ($search) {
                    $q->where('folio', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('observed_person', 'like', "%{$search}%")
                    ->orWhereHas('user', function($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%");
                    });
                });
            }

            if ($currentAreaId) {
                $query->where('area_id', $currentAreaId);
            }

            if (request('status')) {
                $query->where('status', request('status'));
            }

            $recentObservations = $query
                ->orderByDesc('created_at')
                ->take(20)
                ->get();

            $applyFilters = function($q) use ($currentAreaId) {
                $q->submitted();

                if ($currentAreaId) {
                    $q->where('area_id', $currentAreaId);
                }

                return $q;
            };

            // OPTIMIZACIÓN: Cargar todas las observaciones filtradas UNA SOLA VEZ
            $allFilteredObservations = $applyFilters(Observation::query())
                ->with($baseRelations)
                ->latest('created_at')
                ->get();

            // Usar la colección cargada para todas las estadísticas
            $totalMonthList = $allFilteredObservations;
            $totalMonth = $totalMonthList->count();

            $openList = $allFilteredObservations
                ->where('status', 'en_progreso')
                ->sortByDesc('observation_date')
                ->values();
            $open = $openList->count();

            $closedList = $allFilteredObservations
                ->where('status', 'cerrada')
                ->sortByDesc('closed_at')
                ->values();
            $closed = $closedList->count();

            $totalAll = $allFilteredObservations->count();
            $closedRate = $totalAll > 0 ? round(($closed / $totalAll) * 100) : 0;

            $highRiskCategories = [
                'Manejo de SQP',
                'Ingesta de sustancias',
                'Trabajos Eléctricos',
                'Mal uso de herramientas'
            ];

            // High risk: solo hacer consulta adicional si hay observaciones abiertas
            $highRiskList = collect();
            $highRiskCount = 0;

            if ($open > 0) {
                $highRiskList = $applyFilters(Observation::query())
                    ->where('status', 'en_progreso')
                    ->whereHas('categories', function($q) use ($highRiskCategories) {
                        $q->whereIn('name', $highRiskCategories);
                    })
                    ->with($baseRelations)
                    ->latest('observation_date')
                    ->get();
                $highRiskCount = $highRiskList->count();
            }

            $repeatOffendersList = $applyFilters(Observation::query())
                ->select('observed_person', DB::raw('count(*) as total'))
                ->groupBy('observed_person')
                ->having('total', '>', 1)
                ->orderByDesc('total')
                ->get();

            $repeatOffendersCount = $repeatOffendersList->count();

            // OPTIMIZACIÓN: Cargar observaciones por planta con relaciones selectivas
            $observationsByPlant = Area::where('is_active', true)
            ->with(['observations' => function($q) use ($baseRelations) {
                $q->submitted()->latest()->with($baseRelations);
            }])
            ->withCount(['observations' => function($q) {
                $q->submitted();
            }])
            ->get()
            ->map(function($area){
                return [
                    'name' => $area->name,
                    'count' => $area->observations_count,
                    'list' => $area->observations
                ];
            });

        // OPTIMIZACIÓN: Top categorías con relaciones selectivas
        $topCategories = Category::where('is_active', true)
            ->with(['observations' => function($q) use ($applyFilters, $baseRelations) {
                $applyFilters($q)->with($baseRelations)->latest();
            }])
            ->withCount(['observations' => function($q) use ($applyFilters) {
                $applyFilters($q);
            }])
            ->orderByDesc('observations_count')
            ->take(5)
            ->get()
            ->map(function($cat){
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'count' => $cat->observations_count,
                    'list' => $cat->observations
                ];
            });


            $data['ehsStats'] = [
                'total_month' => $totalMonth,
                'total_month_list' => $totalMonthList,
                'open' => $open,
                'open_list' => $openList,
                'closed_rate' => $closedRate,
                'closed_list' => $closedList,
                'high_risk' => $highRiskCount,
                'high_risk_list' => $highRiskList,
                'recidivism' => $repeatOffendersCount,
                'recidivism_list' => $repeatOffendersList,
                'by_plant' => $observationsByPlant,
                'top_categories' => $topCategories,
                'recent' => $recentObservations
            ];

            $data['filters'] = request()->only(['search', 'status']);
            $data['filters']['area_id'] = $currentAreaId;

            $data['managerPlantName'] = $currentAreaId
                ? Area::find($currentAreaId)->name
                : 'General';
        }
        return Inertia::render('Dashboard', $data);
    }
}
