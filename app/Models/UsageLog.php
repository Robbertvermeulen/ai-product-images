<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsageLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'user_id',
        'action_type',
        'resource_type',
        'resource_id',
        'metadata',
        'credits_used',
        'cost',
    ];

    protected $casts = [
        'metadata' => 'array',
        'credits_used' => 'decimal:2',
        'cost' => 'decimal:4',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function logImageGeneration(
        string $organizationId,
        int $userId,
        string $imageId,
        ?float $cost = null,
    ): self {
        return static::create([
            'organization_id' => $organizationId,
            'user_id' => $userId,
            'action_type' => 'image_generation',
            'resource_type' => 'generated_image',
            'resource_id' => $imageId,
            'credits_used' => 1,
            'cost' => $cost,
        ]);
    }

    public static function logProductScrape(
        string $organizationId,
        int $userId,
        string $productId,
        ?float $cost = null,
    ): self {
        return static::create([
            'organization_id' => $organizationId,
            'user_id' => $userId,
            'action_type' => 'product_scrape',
            'resource_type' => 'product',
            'resource_id' => $productId,
            'credits_used' => 0.5,
            'cost' => $cost,
        ]);
    }
}
