<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeneratedImage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'session_id',
        'product_id',
        'user_id',
        'preset_type',
        'prompt',
        'negative_prompt',
        'chat_history',
        'image_url',
        'storage_path',
        'generation_params',
        'metadata',
        'status',
        'generation_time_ms',
        'cost',
    ];

    protected $casts = [
        'chat_history' => 'array',
        'generation_params' => 'array',
        'metadata' => 'array',
        'cost' => 'decimal:4',
        'generation_time_ms' => 'integer',
    ];

    public function studioSession(): BelongsTo
    {
        return $this->belongsTo(StudioSession::class, 'session_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shareLinks(): HasMany
    {
        return $this->hasMany(ShareLink::class);
    }

    public function isProcessing(): bool
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function markAsProcessing(): void
    {
        $this->update(['status' => 'processing']);
    }

    public function markAsCompleted(string $imageUrl, ?string $storagePath = null, ?int $generationTime = null): void
    {
        $this->update([
            'status' => 'completed',
            'image_url' => $imageUrl,
            'storage_path' => $storagePath,
            'generation_time_ms' => $generationTime,
        ]);
    }

    public function markAsFailed(?string $reason = null): void
    {
        $metadata = $this->metadata ?? [];
        if ($reason) {
            $metadata['failure_reason'] = $reason;
        }

        $this->update([
            'status' => 'failed',
            'metadata' => $metadata,
        ]);
    }
}
