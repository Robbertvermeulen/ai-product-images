<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'organization_id',
        'source_url',
        'name',
        'description',
        'original_images',
        'scraped_data',
        'product_analysis',
        'status',
    ];

    protected $casts = [
        'original_images' => 'array',
        'scraped_data' => 'array',
        'product_analysis' => 'array',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function studioSessions(): HasMany
    {
        return $this->hasMany(StudioSession::class);
    }

    public function generatedImages(): HasMany
    {
        return $this->hasMany(GeneratedImage::class);
    }

    public function productImages(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function getImageCount(): int
    {
        return count($this->original_images ?? []);
    }

    public function hasAnalysis(): bool
    {
        return !empty($this->product_analysis);
    }

    public function isReady(): bool
    {
        return $this->status === 'ready' && $this->hasAnalysis();
    }
}
