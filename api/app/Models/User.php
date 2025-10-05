<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        'banned_at',
        'ban_reason',
        'banned_until',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'banned_at' => 'datetime',
        'banned_until' => 'datetime',
    ];

    /**
     * Get the weaver profile associated with the user.
     */
    public function weaver()
    {
        return $this->hasOne(Weaver::class);
    }

    /**
     * Get the orders for the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the donations made by the user.
     */
    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    /**
     * Get the admin user record for this user.
     */
    public function adminUser()
    {
        return $this->hasOne(AdminUser::class);
    }

    /**
     * Check if user is a weaver.
     */
    public function isWeaver(): bool
    {
        return $this->weaver()->exists();
    }

    /**
     * Check if user is banned.
     */
    public function isBanned(): bool
    {
        // User is not banned if they are active and have no ban record
        if ($this->is_active && !$this->banned_at) {
            return false;
        }

        // User is banned if they are inactive OR have a ban record
        if (!$this->is_active || $this->banned_at) {
            // Check if it's a temporary ban that has expired
            if ($this->banned_until && $this->banned_until->isPast()) {
                return false;
            }
            return true;
        }

        return false;
    }

    /**
     * Hash the password when setting it.
     */
    public function setPasswordAttribute($value)
    {
        // Only hash if it's not already hashed (check if it starts with $2y$)
        if (!empty($value) && !str_starts_with($value, '$2y$')) {
            $this->attributes['password'] = Hash::make($value);
        } else {
            $this->attributes['password'] = $value;
        }
    }
}
