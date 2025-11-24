<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Observation extends Model
{
        public function categories()
        {
            return $this->belongsToMany(Category::class, 'category_observation', 'observation_id', 'category_id');
        }
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isSubmitted(): bool
    {
        return $this->status === 'submitted';
    }
}
