<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function ownedOrganizations(): HasMany
    {
        return $this->hasMany(Organization::class, 'owner_id');
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function studioSessions(): HasMany
    {
        return $this->hasMany(StudioSession::class);
    }

    public function generatedImages(): HasMany
    {
        return $this->hasMany(GeneratedImage::class);
    }

    public function shareLinks(): HasMany
    {
        return $this->hasMany(ShareLink::class, 'created_by');
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(UsageLog::class);
    }

    public function currentOrganization(): ?Organization
    {
        return $this->organizations()->first() ?? $this->ownedOrganizations()->first();
    }

    public function hasOrganization(): bool
    {
        return $this->organizations()->exists() || $this->ownedOrganizations()->exists();
    }
}
