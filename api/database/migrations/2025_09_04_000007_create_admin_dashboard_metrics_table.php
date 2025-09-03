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
        Schema::create('admin_dashboard_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('metric_key')->unique(); // active_users, pending_approvals, total_revenue, etc.
            $table->text('metric_value'); // JSON encoded value
            $table->string('metric_type')->default('counter'); // counter, percentage, currency, array
            $table->string('category')->default('general'); // users, products, finance, content, etc.
            $table->timestamp('calculated_at');
            $table->timestamp('expires_at')->nullable(); // When metric should be recalculated
            $table->json('metadata')->nullable(); // Additional context, trends, etc.
            $table->timestamps();
            
            $table->index(['metric_key', 'expires_at']);
            $table->index(['category', 'calculated_at']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_dashboard_metrics');
    }
};


