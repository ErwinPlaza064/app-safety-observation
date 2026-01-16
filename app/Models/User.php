<?php

namespace App\Models;

use App\Notifications\VerifyEmailNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_number',
        'name',
        'email',
        'password',
        'plant_id',
        'area_id',
        'area', // Mantener temporalmente para compatibilidad si es necesario
        'position',
        'is_ehs_manager',
        'is_ehs_coordinator',
        'is_suspended',
        'suspended_at',
        'suspension_reason',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_ehs_manager' => 'boolean',
            'is_ehs_coordinator' => 'boolean',
            'is_super_admin' => 'boolean',
            'is_suspended' => 'boolean',
            'suspended_at' => 'datetime',
        ];
    }

    /**
     * Check if user is suspended
     */
    public function isSuspended(): bool
    {
        return $this->is_suspended === true;
    }

    /**
     * Check if user is EHS Manager
     */
    public function isEhsManager(): bool
    {
        return $this->is_ehs_manager === true;
    }

    /**
     * Check if user is EHS Coordinator
     */
    public function isEhsCoordinator(): bool
    {
        return $this->is_ehs_coordinator === true;
    }


    public function plant()
    {
        return $this->belongsTo(Plant::class);
    }

    public function areaEntity() // Cambiado nombre para evitar conflicto con el campo string 'area'
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    /**
     * Relación con observaciones de seguridad
     */
    public function observations()
    {
        return $this->hasMany(Observation::class);
    }

    /**
     * Check if user is Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->is_super_admin === true;
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmailNotification);
    }
}
