<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        Log::info('Iniciando registro de usuario', ['email' => $request->email]);

        $user = User::create([
            'employee_number' => $request->employee_number,
            'name' => $request->name,
            'email' => $request->email,
            'area' => $request->area,
            'position' => $request->position,
            'password' => Hash::make($request->password),
        ]);

        Log::info('Usuario creado', ['user_id' => $user->id]);

        // Enviar correo de verificación directamente
        try {
            $user->sendEmailVerificationNotification();
            Log::info('Correo de verificación enviado correctamente', ['user_id' => $user->id, 'email' => $user->email]);
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de verificación', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        return redirect()->route('login')->with('status', 'Te hemos enviado un enlace de verificación a tu correo electrónico. Por favor, verifica tu cuenta antes de iniciar sesión.');
    }
}
