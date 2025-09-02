<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudioSession extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'product_id',
        'user_id',
        'status',
        'session_data',
        'expires_at',
    ];

    protected $casts = [
        'session_data' => 'array',
        'expires_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function generatedImages(): HasMany
    {
        return $this->hasMany(GeneratedImage::class, 'session_id');
    }

    public function isActive(): bool
    {
        return $this->status === 'active' &&
               ($this->expires_at === null || $this->expires_at->isFuture());
    }

    public function markCompleted(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function extendSession(int $hours = 24): void
    {
        $this->update([
            'expires_at' => now()->addHours($hours),
        ]);
    }
}
