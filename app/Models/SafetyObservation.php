<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SafetyObservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'observer_name',
        'employee_id',
        'department',
        'position',
        'observation_date',
        'observed_person',
        'area',
        'observation_type',
        'categories',
        'description',
        'photos',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'categories' => 'array',
            'photos' => 'array',
            'observation_date' => 'date',
        ];
    }

    /**
     * Relación con el usuario que creó la observación
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope para obtener observaciones del usuario actual
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Verificar si es borrador
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Verificar si está enviada
     */
    public function isSubmitted(): bool
    {
        return $this->status === 'submitted';
    }
}