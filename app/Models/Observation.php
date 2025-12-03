<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Observation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'area_id',
        'observation_date',
        'observed_person',
        'observation_type',
        'description',
        'status',
        'is_draft',
        'folio',
        'closed_at',
        'closed_by',
        'closure_notes',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'observation_date' => 'date',
        'is_draft' => 'boolean',
        'closed_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
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

    public function reviewedByUser()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('is_draft', false);
    }
}
