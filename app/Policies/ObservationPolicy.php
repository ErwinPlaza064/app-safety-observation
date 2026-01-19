<?php

namespace App\Policies;

use App\Models\Observation;
use App\Models\User;

class ObservationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_ehs_manager || $user->is_super_admin || $user->is_ehs_coordinator;
    }

    public function view(User $user, Observation $observation): bool
    {
        if ($user->id === $observation->user_id) {
            return true;
        }

        return $user->is_ehs_manager || $user->is_super_admin || $user->is_ehs_coordinator;
    }

    public function create(User $user): bool
    {
        // Todos los usuarios autenticados pueden crear observaciones
        return true;
    }

    public function update(User $user, Observation $observation): bool
    {
        if ($observation->isDraft() && $user->id === $observation->user_id) {
            return true;
        }

        return $user->is_ehs_manager || $user->is_super_admin || $user->is_ehs_coordinator;
    }


    public function delete(User $user, Observation $observation): bool
    {
        if ($observation->isDraft() && $user->id === $observation->user_id) {
            return true;
        }

        return $user->is_super_admin;
    }


    public function manage(User $user): bool
    {
        return $user->is_ehs_manager || $user->is_super_admin || $user->is_ehs_coordinator;
    }


    public function close(User $user, Observation $observation): bool
    {
        // El dueño de la observación o un administrador/manager/coordinator pueden cerrarla
        return ($user->id === $observation->user_id || $user->is_ehs_manager || $user->is_super_admin || $user->is_ehs_coordinator)
            && $observation->status === 'en_progreso';
    }


    public function reopen(User $user, Observation $observation): bool
    {
        return ($user->is_ehs_manager || $user->is_super_admin || $user->is_ehs_coordinator)
            && $observation->status === 'cerrada';
    }
}


