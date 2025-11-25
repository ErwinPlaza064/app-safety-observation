<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Category;
use App\Models\Observation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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

            $data['users'] = User::all();
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
        }

        return Inertia::render('Dashboard', $data);
    }
}
