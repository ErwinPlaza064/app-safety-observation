<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationship with Areas removed

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function observations()
    {
        return $this->hasMany(Observation::class);
    }
}
