<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Observation extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'plant_id',
        'area_id',
        'observation_date',
        'payroll_number',
        'observed_person',
        'company',
        'observation_type',
        'description',
        'status',
        'is_draft',
        'folio',
        'closed_at',
        'closed_by',
        'closure_notes',
        'share_token',
        'share_expires_at',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    protected $casts = [
        'observation_date' => 'date',
        'is_draft' => 'boolean',
        'closed_at' => 'datetime',
        'share_expires_at' => 'datetime',
    ];

    /**
     * Genera un token único para compartir y establece la expiración en 7 días.
     */
    public function generateShareToken(): string
    {
        $this->share_token = bin2hex(random_bytes(32));
        $this->share_expires_at = now()->addDays(7);
        $this->save();

        return $this->share_token;
    }

    /**
     * Verifica si el enlace compartido ha expirado.
     */
    public function isShareExpired(): bool
    {
        // Si nunca se ha compartido (no tiene token), permitir acceso
        // para mantener compatibilidad con enlaces antiguos basados en UUID
        if (!$this->share_token && !$this->share_expires_at) {
            return false;
        }

        if (!$this->share_expires_at) {
            return true;
        }

        return $this->share_expires_at->isPast();
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plant()
    {
        return $this->belongsTo(Plant::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_observation');
    }

    public function images()
    {

        return $this->hasMany(ObservationImage::class);
    }

    public function closedByUser()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('is_draft', false);
    }
}
