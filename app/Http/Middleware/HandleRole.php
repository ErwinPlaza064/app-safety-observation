<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $user = $request->user();

        // Verificar cada rol permitido
        foreach ($roles as $role) {
            if ($role === 'super_admin' && $user->is_super_admin) {
                return $next($request);
            }
            if ($role === 'ehs_manager' && $user->is_ehs_manager) {
                return $next($request);
            }
            if ($role === 'ehs_coordinator' && $user->is_ehs_coordinator) {
                return $next($request);
            }
        }

        // Si no tiene ninguno de los roles requeridos
        abort(403, 'No tienes permisos para acceder a esta sección.');
    }
}
