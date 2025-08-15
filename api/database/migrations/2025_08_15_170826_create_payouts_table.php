<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weaver_id')->constrained()->onDelete('cascade');
            $table->string('payout_number')->unique();
            $table->decimal('amount', 10, 2);
            $table->decimal('fee_amount', 10, 2)->default(0.00);
            $table->decimal('net_amount', 10, 2);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->string('payment_method'); // bank_transfer, paypal, etc.
            $table->json('payment_details'); // Account details, etc.
            $table->text('notes')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('transaction_id')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamps();
            
            $table->index(['weaver_id', 'status']);
            $table->index('payout_number');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
