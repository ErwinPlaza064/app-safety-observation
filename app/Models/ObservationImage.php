<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObservationImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'observation_id',
        'path',
        'original_name',
        'size',
        'sort_order',
    ];

    public function observation()
    {
        return $this->belongsTo(Observation::class);
    }
}
