<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Hash;

class AdminUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'admin_role_id',
        'admin_id',
        'department',
        'is_active',
        'is_super_admin',
        'last_login_at',
        'password_changed_at',
        'login_history',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_super_admin' => 'boolean',
        'last_login_at' => 'datetime',
        'password_changed_at' => 'datetime',
        'login_history' => 'array',
    ];

    protected $hidden = [
        'login_history',
    ];

    /**
     * Get the user that owns this admin account
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin role for this user
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(AdminRole::class, 'admin_role_id');
    }

    /**
     * Get the audit logs for this admin user
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AdminAuditLog::class);
    }

    /**
     * Get the announcements created by this admin
     */
    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class, 'created_by');
    }

    /**
     * Get the announcements approved by this admin
     */
    public function approvedAnnouncements(): HasMany
    {
        return $this->hasMany(Announcement::class, 'approved_by');
    }

    /**
     * Get the ban history records created by this admin
     */
    public function banHistory(): HasMany
    {
        return $this->hasMany(BanHistory::class, 'banned_by');
    }

    /**
     * Get the content moderation assignments for this admin
     */
    public function contentModerationAssignments(): HasMany
    {
        return $this->hasMany(ContentModerationQueue::class, 'assigned_to');
    }

    /**
     * Get the content moderation reviews by this admin
     */
    public function contentModerationReviews(): HasMany
    {
        return $this->hasMany(ContentModerationQueue::class, 'reviewed_by');
    }

    /**
     * Check if the admin user has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->is_super_admin) {
            return true; // Super admin has all permissions
        }

        return $this->role?->hasPermission($permission) ?? false;
    }

    /**
     * Check if the admin user has any of the given permissions
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
     * Check if the admin user has all of the given permissions
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
     * Check if the admin user can manage other admin users
     */
    public function canManageAdmins(): bool
    {
        return $this->hasAnyPermission([
            'admin_users.view',
            'admin_users.create',
            'admin_users.edit',
            'admin_users.delete',
        ]);
    }

    /**
     * Check if the admin user can manage roles
     */
    public function canManageRoles(): bool
    {
        return $this->hasAnyPermission([
            'admin_roles.view',
            'admin_roles.create',
            'admin_roles.edit',
            'admin_roles.delete',
        ]);
    }

    /**
     * Record a login attempt
     */
    public function recordLogin(string $ipAddress, string $userAgent): void
    {
        $this->update([
            'last_login_at' => now(),
            'login_history' => array_merge(
                $this->login_history ?? [],
                [
                    [
                        'timestamp' => now()->toISOString(),
                        'ip_address' => $ipAddress,
                        'user_agent' => $userAgent,
                        'success' => true,
                    ]
                ]
            )
        ]);
    }

    /**
     * Record a failed login attempt
     */
    public function recordFailedLogin(string $ipAddress, string $userAgent): void
    {
        $this->update([
            'login_history' => array_merge(
                $this->login_history ?? [],
                [
                    [
                        'timestamp' => now()->toISOString(),
                        'ip_address' => $ipAddress,
                        'user_agent' => $userAgent,
                        'success' => false,
                    ]
                ]
            )
        ]);
    }

    /**
     * Generate a unique admin ID
     */
    public static function generateAdminId(): string
    {
        do {
            $adminId = 'ADM' . strtoupper(substr(md5(uniqid()), 0, 8));
        } while (static::where('admin_id', $adminId)->exists());

        return $adminId;
    }

    /**
     * Scope to get only active admin users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get admin users by department
     */
    public function scopeByDepartment($query, string $department)
    {
        return $query->where('department', $department);
    }

    /**
     * Scope to get super admins
     */
    public function scopeSuperAdmins($query)
    {
        return $query->where('is_super_admin', true);
    }
}


