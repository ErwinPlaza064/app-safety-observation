<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $user = User::findOrFail($request->route('id'));

        if (!hash_equals(sha1($user->getEmailForVerification()), (string) $request->route('hash'))) {
            return redirect()->route('login')->withErrors([
                'email' => 'El enlace de verificación no es válido.',
            ]);
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('status', 'Tu correo ya ha sido verificado. Puedes iniciar sesión.');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect()->route('login')->with('status', 'Tu correo ha sido verificado exitosamente. Ahora puedes iniciar sesión.');
    }
}
