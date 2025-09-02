<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'owner_id',
        'subscription_tier',
        'usage_count',
        'usage_limit',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'usage_count' => 'integer',
        'usage_limit' => 'integer',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(UsageLog::class);
    }

    public function canGenerateImages(): bool
    {
        if (!config('features.usage_limits') || !config('features.enforce_usage_limits')) {
            return true;
        }

        return $this->usage_limit === null || $this->usage_count < $this->usage_limit;
    }

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}
