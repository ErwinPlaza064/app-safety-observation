<?php

namespace App\Policies;

use App\Models\Observation;
use App\Models\User;

class ObservationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_ehs_manager || $user->is_super_admin;
    }

    public function view(User $user, Observation $observation): bool
    {
        if ($user->id === $observation->user_id) {
            return true;
        }

        return $user->is_ehs_manager || $user->is_super_admin;
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

        return $user->is_ehs_manager || $user->is_super_admin;
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
        return $user->is_ehs_manager || $user->is_super_admin;
    }


    public function close(User $user, Observation $observation): bool
    {
        return ($user->is_ehs_manager || $user->is_super_admin)
            && $observation->status === 'en_progreso';
    }


    public function reopen(User $user, Observation $observation): bool
    {
        return ($user->is_ehs_manager || $user->is_super_admin)
            && $observation->status === 'cerrada';
    }
}


