<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminAuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_user_id',
        'action',
        'resource_type',
        'resource_id',
        'old_values',
        'new_values',
        'description',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'metadata' => 'array',
    ];

    /**
     * Get the admin user who performed the action
     */
    public function adminUser(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class);
    }

    /**
     * Get the user who performed the action (through admin user)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_user_id', 'id');
    }

    /**
     * Scope to get logs by action type
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope to get logs by resource type
     */
    public function scopeByResourceType($query, string $resourceType)
    {
        return $query->where('resource_type', $resourceType);
    }

    /**
     * Scope to get logs by admin user
     */
    public function scopeByAdminUser($query, int $adminUserId)
    {
        return $query->where('admin_user_id', $adminUserId);
    }

    /**
     * Scope to get logs within a date range
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope to get logs for a specific resource
     */
    public function scopeForResource($query, string $resourceType, int $resourceId)
    {
        return $query->where('resource_type', $resourceType)
                    ->where('resource_id', $resourceId);
    }

    /**
     * Get a human-readable description of the changes
     */
    public function getChangeDescription(): string
    {
        if (empty($this->old_values) && empty($this->new_values)) {
            return $this->description ?? "Action: {$this->action}";
        }

        if (empty($this->old_values)) {
            return "Created new {$this->resource_type}";
        }

        if (empty($this->new_values)) {
            return "Deleted {$this->resource_type}";
        }

        $changes = [];
        foreach ($this->new_values as $field => $newValue) {
            $oldValue = $this->old_values[$field] ?? null;
            if ($oldValue !== $newValue) {
                $changes[] = "Changed {$field} from '{$oldValue}' to '{$newValue}'";
            }
        }

        return implode(', ', $changes);
    }

    /**
     * Check if the log contains sensitive information
     */
    public function containsSensitiveData(): bool
    {
        $sensitiveFields = ['password', 'email', 'phone', 'address', 'payment_details'];
        
        foreach ($sensitiveFields as $field) {
            if (isset($this->old_values[$field]) || isset($this->new_values[$field])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get a sanitized version of the log for display
     */
    public function getSanitizedValues(): array
    {
        $sensitiveFields = ['password', 'email', 'phone', 'address', 'payment_details'];
        
        $sanitized = [
            'old_values' => $this->old_values ?? [],
            'new_values' => $this->new_values ?? [],
        ];

        foreach ($sensitiveFields as $field) {
            if (isset($sanitized['old_values'][$field])) {
                $sanitized['old_values'][$field] = '[REDACTED]';
            }
            if (isset($sanitized['new_values'][$field])) {
                $sanitized['new_values'][$field] = '[REDACTED]';
            }
        }

        return $sanitized;
    }

    /**
     * Get the formatted timestamp
     */
    public function getFormattedTimestamp(): string
    {
        return $this->created_at->format('M d, Y H:i:s');
    }

    /**
     * Get the admin user's name
     */
    public function getAdminUserName(): string
    {
        return $this->adminUser?->user?->name ?? 'Unknown Admin';
    }

    /**
     * Get the admin user's role
     */
    public function getAdminUserRole(): string
    {
        return $this->adminUser?->role?->display_name ?? 'Unknown Role';
    }
}


