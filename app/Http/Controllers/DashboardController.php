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
                ->addSelect([
                    'last_activity' => DB::table('sessions')
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
                    if ($status === 'verified') $query->whereNotNull('email_verified_at')->where('is_suspended', false);
                    elseif ($status === 'pending') $query->whereNull('email_verified_at');
                    elseif ($status === 'suspended') $query->where('is_suspended', true);
                })
                ->orderByDesc('created_at');

            $data['users'] = $usersQuery->paginate(10)->withQueryString();

            $data['filters'] = request()->only(['search', 'area', 'role', 'status']);
            $data['filterAreas'] = User::select('area')->distinct()->whereNotNull('area')->pluck('area');

            // Áreas para el tab de gestión de áreas
            $data['areas'] = Area::withCount('observations')->orderBy('name')->get();
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

            // Notas de cierre para notificaciones locales (badge "Listo")
            $data['employeeNotifications'] = Observation::where('user_id', $user->id)
                ->where('status', 'cerrada')
                ->where('is_draft', false)
                ->with(['area', 'user', 'images', 'categories', 'closedByUser'])
                ->latest('closed_at')
                ->get();

            if (request('filter_status')) {
                $data['filteredReports'] = Observation::where('user_id', $user->id)
                    ->where('is_draft', false)
                    ->where('status', request('filter_status'))
                    ->with(['area', 'user', 'images', 'categories', 'closedByUser'])
                    ->latest()
                    ->get();
            }

            $data['myObservations'] = Observation::where('user_id', $user->id)
                ->where('is_draft', false)
                ->with(['area', 'user', 'images', 'categories', 'closedByUser'])
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

            $data['employeeNotifications'] = [];
            $data['employeeNotificationCount'] = 0;
        }

        // 3. LÓGICA PARA EHS MANAGER (OPTIMIZADO - Sin perder funcionalidad)
        // ==========================================
        if ($user->is_ehs_manager && !$user->is_super_admin) {

            // Verificar si el usuario puede ver todas las plantas
            $canViewAllPlants = $user->email === 'ehsplanta1@wasion.com';

            // Si puede ver todas las plantas, mostrar todas; si no, solo su planta
            if ($canViewAllPlants) {
                $data['areas'] = Area::where('is_active', true)->get();
            } else {
                // Solo mostrar su propia planta
                $userPlant = Area::where('name', $user->area)->first();
                $data['areas'] = $userPlant ? collect([$userPlant]) : collect([]);
            }

            $userPlant = Area::where('name', $user->area)->first();
            $defaultAreaId = $userPlant ? $userPlant->id : null;

            // Si el usuario NO puede ver todas las plantas, forzar su área por defecto
            if (!$canViewAllPlants) {
                $currentAreaId = $defaultAreaId;
            } else {
                $currentAreaId = request()->has('area_id') ? request('area_id') : $defaultAreaId;
            }

            // Configurar relaciones optimizadas (solo campos necesarios)
            $baseRelations = [
                'user:id,name,email,area',
                'area:id,name',
                'closedByUser:id,name',
                'categories:id,name',
                'images:id,observation_id,path'
            ];

            $query = Observation::with($baseRelations)
                ->submitted();

            if (request('search')) {
                $search = request('search');
                $query->where(function ($q) use ($search) {
                    $q->where('folio', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('observed_person', 'like', "%{$search}%")
                        ->orWhere('payroll_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($u) use ($search) {
                            $u->where('name', 'like', "%{$search}%");
                        });
                });
            }

            if ($currentAreaId) {
                $query->where('area_id', $currentAreaId);
            }

            $recentObservations = $query
                ->orderByDesc('created_at')
                ->take(100)
                ->get();

            $applyFilters = function ($q) use ($currentAreaId, $canViewAllPlants, $defaultAreaId) {
                $q->submitted();

                // Si no puede ver todas las plantas, siempre filtrar por su área
                if (!$canViewAllPlants && $defaultAreaId) {
                    $q->where('area_id', $defaultAreaId);
                } elseif ($currentAreaId) {
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
                'EPP (Equipo de Protección Personal)',
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
                    ->whereHas('categories', function ($q) use ($highRiskCategories) {
                        $q->whereIn('name', $highRiskCategories);
                    })
                    ->with($baseRelations)
                    ->latest('observation_date')
                    ->get();
                $highRiskCount = $highRiskList->count();
            }

            $repeatOffendersList = $applyFilters(Observation::query())
                ->select('payroll_number', DB::raw('MAX(observed_person) as observed_person'), DB::raw('count(*) as total'))
                ->whereNotNull('payroll_number')
                ->where('payroll_number', '!=', '')
                ->groupBy('payroll_number')
                ->having('total', '>', 1)
                ->orderByDesc('total')
                ->get();

            $repeatOffendersCount = $repeatOffendersList->count();

            // Calcular índice de participación de empleados
            $totalEmployees = User::where('is_ehs_manager', false)
                ->where('is_super_admin', false)
                ->count();

            // Función auxiliar para obtener reporteros por periodo
            $getReportersByPeriod = function ($days = null) use ($canViewAllPlants, $defaultAreaId, $baseRelations) {
                return User::where('is_ehs_manager', false)
                    ->where('is_super_admin', false)
                    ->whereHas('observations', function ($q) use ($days, $canViewAllPlants, $defaultAreaId) {
                        $q->submitted();
                        if ($days) {
                            $q->where('created_at', '>=', now()->subDays($days));
                        }
                        if (!$canViewAllPlants && $defaultAreaId) {
                            $q->where('area_id', $defaultAreaId);
                        } elseif (request('area_id')) {
                            $q->where('area_id', request('area_id'));
                        }
                    })
                    ->withCount(['observations' => function ($q) use ($days, $canViewAllPlants, $defaultAreaId) {
                        $q->submitted();
                        if ($days) {
                            $q->where('created_at', '>=', now()->subDays($days));
                        }
                        if (!$canViewAllPlants && $defaultAreaId) {
                            $q->where('area_id', $defaultAreaId);
                        } elseif (request('area_id')) {
                            $q->where('area_id', request('area_id'));
                        }
                    }])
                    ->with(['observations' => function ($q) use ($days, $canViewAllPlants, $defaultAreaId, $baseRelations) {
                        $q->submitted()->with($baseRelations);
                        if ($days) {
                            $q->where('created_at', '>=', now()->subDays($days));
                        }
                        if (!$canViewAllPlants && $defaultAreaId) {
                            $q->where('area_id', $defaultAreaId);
                        } elseif (request('area_id')) {
                            $q->where('area_id', request('area_id'));
                        }
                    }])
                    ->get()
                    ->map(function ($employee) {
                        return [
                            'name' => $employee->name,
                            'email' => $employee->email,
                            'area' => $employee->area ?? 'N/A',
                            'count' => $employee->observations_count,
                            'list' => $employee->observations
                        ];
                    });
            };

            $dailyReporters = $getReportersByPeriod(1);
            $weeklyReporters = $getReportersByPeriod(7);
            $monthlyReporters = $getReportersByPeriod(30);

            $employeesWhoReportedCount = $monthlyReporters->count();

            $employeesReportingList = $monthlyReporters;

            $participationRate = $totalEmployees > 0 ? round(($employeesWhoReportedCount / $totalEmployees) * 100) : 0;

            // OPTIMIZACIÓN: Cargar observaciones por planta con relaciones selectivas
            $observationsByPlant = Area::where('is_active', true)
                ->with(['observations' => function ($q) use ($baseRelations) {
                    $q->submitted()->latest()->with($baseRelations);
                }])
                ->withCount(['observations' => function ($q) {
                    $q->submitted();
                }])
                ->get()
                ->map(function ($area) {
                    return [
                        'name' => $area->name,
                        'count' => $area->observations_count,
                        'list' => $area->observations
                    ];
                });

            // OPTIMIZACIÓN: Top categorías con relaciones selectivas
            $topCategories = Category::where('is_active', true)
                ->with(['observations' => function ($q) use ($applyFilters, $baseRelations) {
                    $applyFilters($q)->with($baseRelations)->latest();
                }])
                ->withCount(['observations' => function ($q) use ($applyFilters) {
                    $applyFilters($q);
                }])
                ->orderByDesc('observations_count')
                ->take(5)
                ->get()
                ->map(function ($cat) {
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
                'participation_rate' => $participationRate,
                'employees_reporting' => $employeesWhoReportedCount,
                'employees_reporting_list' => $employeesReportingList,
                'total_employees' => $totalEmployees,
                'participation_daily' => [
                    'count' => $dailyReporters->count(),
                    'rate' => $totalEmployees > 0 ? round(($dailyReporters->count() / $totalEmployees) * 100) : 0,
                    'list' => $dailyReporters
                ],
                'participation_weekly' => [
                    'count' => $weeklyReporters->count(),
                    'rate' => $totalEmployees > 0 ? round(($weeklyReporters->count() / $totalEmployees) * 100) : 0,
                    'list' => $weeklyReporters
                ],
                'participation_monthly' => [
                    'count' => $monthlyReporters->count(),
                    'rate' => $participationRate,
                    'list' => $monthlyReporters
                ],
                'by_plant' => $canViewAllPlants ? $observationsByPlant : [],
                'top_categories' => $topCategories,
                'recent' => $recentObservations,
                // Contador acumulativo para EHS: total reportes (filtrados) + total cerrados (filtrados)
                'event_count' => $totalAll + $closed
            ];

            $data['canViewAllPlants'] = $canViewAllPlants;

            $data['filters'] = request()->only(['search']);
            $data['filters']['area_id'] = $currentAreaId;

            $data['managerPlantName'] = $currentAreaId
                ? Area::find($currentAreaId)->name
                : 'General';
        }
        return Inertia::render('Dashboard', $data);
    }
}
