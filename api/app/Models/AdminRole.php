<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdminRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'permissions',
        'is_active',
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the admin users that have this role
     */
    public function adminUsers(): HasMany
    {
        return $this->hasMany(AdminUser::class);
    }

    /**
     * Check if the role has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->name === 'super_admin') {
            return true; // Super admin has all permissions
        }

        return in_array($permission, $this->permissions ?? []);
    }

    /**
     * Check if the role has any of the given permissions
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the role has all of the given permissions
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get all available permissions for the system
     */
    public static function getAvailablePermissions(): array
    {
        return [
            // User Management
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
            'users.approve',
            'users.ban',
            'users.unban',
            
            // Product Management
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            'products.approve',
            'products.bulk_upload',
            
            // Content Management
            'stories.view',
            'stories.create',
            'stories.edit',
            'stories.delete',
            'stories.approve',
            'stories.publish',
            
            'campaigns.view',
            'campaigns.create',
            'campaigns.edit',
            'campaigns.delete',
            'campaigns.approve',
            
            'glossary.view',
            'glossary.create',
            'glossary.edit',
            'glossary.delete',
            
            // Financial Management
            'orders.view',
            'orders.edit',
            'orders.process',
            'orders.refund',
            
            'payouts.view',
            'payouts.process',
            'payouts.approve',
            
            'donations.view',
            'donations.process',
            
            // System Management
            'announcements.create',
            'announcements.edit',
            'announcements.delete',
            'announcements.publish',
            
            'reports.generate',
            'reports.export',
            
            'settings.view',
            'settings.edit',
            
            // Admin Management
            'admin_users.view',
            'admin_users.create',
            'admin_users.edit',
            'admin_users.delete',
            'admin_roles.view',
            'admin_roles.create',
            'admin_roles.edit',
            'admin_roles.delete',
        ];
    }

    /**
     * Scope to get only active roles
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}


