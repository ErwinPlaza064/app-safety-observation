<?php

namespace App\Http\Controllers;
use App\Models\Observation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $data = [
            'userStats' => [
                'name' => $user->name,
                'email' => $user->email,
                'employee_number' => $user->employee_number,
                'area' => $user->area,
                'position' => $user->position,
                'is_ehs_manager' => $user->is_ehs_manager,
                'is_super_admin' => $user->is_super_admin,
                'total_observations' => Observation::forUser($user->id)->count(),
                'drafts' => Observation::forUser($user->id)->byStatus('draft')->count(),
                'submitted' => Observation::forUser($user->id)->byStatus('submitted')->count(),
            ],
        ];

        if ($user->is_super_admin) {
            $data['users'] = User::select('id', 'employee_number', 'name', 'email', 'area', 'position', 'is_ehs_manager', 'is_super_admin', 'email_verified_at', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        if ($user->is_ehs_manager || $user->is_super_admin) {
            $data['stats'] = [
                'total_users' => User::count(),
                'verified_users' => User::whereNotNull('email_verified_at')->count(),
                'ehs_managers' => User::where('is_ehs_manager', true)->count(),
                'super_admins' => User::where('is_super_admin', true)->count(),
                'total_observations' => Observation::count(),
                'observations_draft' => Observation::byStatus('draft')->count(),
                'observations_submitted' => Observation::byStatus('submitted')->count(),
                'observations_in_review' => Observation::byStatus('in-review')->count(),
                'observations_resolved' => Observation::byStatus('resolved')->count(),
            ];
        }

        // Enviar áreas activas al dashboard para el formulario
        $data['areas'] = \App\Models\Area::active()->get();
        // Enviar categorías activas al dashboard para el formulario
        $data['categories'] = \App\Models\Category::where('is_active', true)->orderBy('sort_order')->get();
        return Inertia::render('Dashboard', $data);
    }
}
