<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ShareLink extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'generated_image_id',
        'product_id',
        'created_by',
        'token',
        'short_code',
        'views',
        'expires_at',
        'is_active',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'views' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function ($shareLink) {
            $shareLink->token = $shareLink->token ?? Str::random(32);
            $shareLink->short_code = $shareLink->short_code ?? static::generateUniqueShortCode();
        });
    }

    public function generatedImage(): BelongsTo
    {
        return $this->belongsTo(GeneratedImage::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isValid(): bool
    {
        return $this->is_active &&
               ($this->expires_at === null || $this->expires_at->isFuture());
    }

    public function incrementViews(): void
    {
        $this->increment('views');
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    protected static function generateUniqueShortCode(): string
    {
        do {
            $code = Str::random(8);
        } while (static::where('short_code', $code)->exists());

        return $code;
    }
}
