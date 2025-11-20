<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
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
        $user = User::create([
            'employee_number' => $request->employee_number,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'area' => $request->area,
            'position' => $request->position,
        ]);

        event(new Registered($user));

        // No login automático - requiere verificación de email
        return redirect()->route('login')->with('status', 'Te hemos enviado un enlace de verificación a tu correo electrónico. Por favor, verifica tu cuenta antes de iniciar sesión.');
    }
}
