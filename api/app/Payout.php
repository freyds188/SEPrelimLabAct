<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    protected $fillable = [
        'weaver_id',
        'payout_number',
        'amount',
        'fee_amount',
        'net_amount',
        'status',
        'payment_method',
        'payment_details',
        'notes',
        'processed_at',
        'completed_at',
        'transaction_id',
        'failure_reason',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee_amount' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'payment_details' => 'array',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the weaver that owns the payout.
     */
    public function weaver()
    {
        return $this->belongsTo(Weaver::class);
    }

    /**
     * Scope a query to only include pending payouts.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include completed payouts.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include failed payouts.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Generate payout number.
     */
    public static function generatePayoutNumber(): string
    {
        return 'PAY-' . date('Ymd') . '-' . strtoupper(uniqid());
    }

    /**
     * Check if payout is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if payout is failed.
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }
}
