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

        if (!$user->is_super_admin && !$user->is_ehs_manager) {

            $data['areas'] = Area::where('is_active', true)->get();
            $data['categories'] = Category::where('is_active', true)->get();

            $data['userStats'] = [
                'in_progress' => Observation::where('user_id', $user->id)
                                    ->where('status', 'en_progreso')
                                    ->count(),
                'completed'   => Observation::where('user_id', $user->id)
                                    ->where('status', 'cerrada')
                                    ->count(),
                'total'       => Observation::where('user_id', $user->id)
                                    ->where('is_draft', false)
                                    ->count(),
            ];

            $data['myObservations'] = Observation::where('user_id', $user->id)
                                        ->where('is_draft', false)
                                        ->with('area','user', 'images', 'categories')
                                        ->latest()
                                        ->take(5)
                                        ->get();

            $draft = Observation::where('user_id', $user->id)
                        ->where('is_draft', true)
                        ->latest()
                        ->first();

            if ($draft) {
                $draft->load(['categories', 'images']);
            }

            $data['savedDraft'] = $draft;
        }

        if ($user->is_ehs_manager && !$user->is_super_admin) {
            $totalMonth = Observation::whereMonth('observation_date', now()->month)
                            ->whereYear('observation_date', now()->year)
                            ->submitted()
                            ->count();

            $open = Observation::submitted()->where('status', 'en_progreso')->count();

            $closed = Observation::submitted()->where('status', 'cerrada')->count();
            $totalAll = Observation::submitted()->count();
            $closedRate = $totalAll > 0 ? round(($closed / $totalAll) * 100) : 0;

            $highRisk = Observation::submitted()
                            ->where('status', 'en_progreso')
                            ->whereHas('categories', function($q) {
                                $q->whereIn('categories.id', [8, 9]);
                            })->count();

            $repeatOffenders = Observation::submitted()
                                ->select('observed_person')
                                ->groupBy('observed_person')
                                ->havingRaw('COUNT(*) > 1')
                                ->get()
                                ->count();


            $observationsByPlant = Area::withCount(['observations' => function($q){
                $q->submitted();
            }])->get()->map(function($area){
                return ['name' => $area->name, 'count' => $area->observations_count];
            });

            $topCategories = Category::withCount(['observations' => function($q){
                $q->submitted();
            }])->orderByDesc('observations_count')->take(5)->get();

            $recentObservations = Observation::with(['user', 'area', 'categories', 'images'])
                                    ->submitted()
                                    ->latest('observation_date')
                                    ->take(10)
                                    ->get();

            $data['ehsStats'] = [
                'total_month' => $totalMonth,
                'open' => $open,
                'high_risk' => $highRisk,
                'closed_rate' => $closedRate,
                'recidivism' => $repeatOffenders,
                'by_plant' => $observationsByPlant,
                'top_categories' => $topCategories,
                'recent' => $recentObservations
            ];
        }

        return Inertia::render('Dashboard', $data);
    }
}
