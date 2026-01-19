<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Area;
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
        return Inertia::render('Auth/Register', [
            'areas' => Area::active()->orderBy('name')->get(['id', 'name'])
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        Log::info('Iniciando registro de usuario', ['email' => $request->email]);

        // Buscar el nombre del área si se envió un ID
        $areaName = $request->area;
        $areaId = null;

        if (is_numeric($request->area)) {
            $area = Area::find($request->area);
            if ($area) {
                $areaName = $area->name;
                $areaId = $area->id;
            }
        }

        $user = User::create([
            'employee_number' => $request->employee_number,
            'name' => $request->name,
            'email' => $request->email,
            'area_id' => $areaId,
            'area' => $areaName,
            'position' => $request->position,
            'password' => Hash::make($request->password),
        ]);

        Log::info('Usuario creado', ['user_id' => $user->id]);

        // Disparar el evento de registro (estándar de Laravel)
        event(new Registered($user));

        // Enviar correo de verificación manualmente para asegurar entrega inmediata 
        // (especialmente útil si no hay worker de colas corriendo)
        try {
            $user->sendEmailVerificationNotification();
            Log::info('Correo de verificación enviado manualmente', ['user_id' => $user->id]);
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de verificación manual', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
        }

        return redirect()->route('login')->with('status', 'Te hemos enviado un enlace de verificación a tu correo electrónico. Por favor, verifica tu cuenta antes de iniciar sesión.');
    }
}
