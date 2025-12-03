<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // Verificar si el usuario está suspendido
        if ($user->is_suspended) {
            $reason = $user->suspension_reason;

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $message = 'Tu cuenta ha sido suspendida temporalmente.';
            if ($reason) {
                $message .= " Motivo: {$reason}.";
            }
            $message .= ' Contacta al administrador para más información.';

            return redirect()->route('login')->withErrors([
                'login' => $message,
            ]);
        }

        // Verificar si el usuario ha verificado su email
        if (!$user->hasVerifiedEmail()) {
            Auth::guard('web')->logout();

            return redirect()->route('login')->withErrors([
                'login' => 'Debes verificar tu correo electrónico antes de poder acceder. Revisa tu bandeja de entrada.',
            ]);
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
