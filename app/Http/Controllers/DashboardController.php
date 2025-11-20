<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Datos base para todos
        $data = [
            'userStats' => [
                'name' => $user->name,
                'email' => $user->email,
                'employee_number' => $user->employee_number,
                'area' => $user->area,
                'position' => $user->position,
                'is_ehs_manager' => $user->is_ehs_manager,
                'is_super_admin' => $user->is_super_admin,
            ],
        ];

        // Si es Super Admin, agregar listado de usuarios
        if ($user->is_super_admin) {
            $data['users'] = User::select('id', 'employee_number', 'name', 'email', 'area', 'position', 'is_ehs_manager', 'is_super_admin', 'email_verified_at', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        // Si es EHS Manager o Super Admin, agregar estadísticas
        if ($user->is_ehs_manager || $user->is_super_admin) {
            $data['stats'] = [
                'total_users' => User::count(),
                'verified_users' => User::whereNotNull('email_verified_at')->count(),
                'ehs_managers' => User::where('is_ehs_manager', true)->count(),
                'super_admins' => User::where('is_super_admin', true)->count(),
            ];
        }

        return Inertia::render('Dashboard', $data);
    }
}
