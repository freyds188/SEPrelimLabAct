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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('type')->default('info'); // info, warning, success, error
            $table->enum('status', ['draft', 'scheduled', 'active', 'inactive', 'archived'])->default('draft');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->json('target_audience')->nullable(); // all, users, weavers, admins, specific_roles
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('created_by')->constrained('admin_users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('admin_users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->boolean('requires_approval')->default(false);
            $table->json('metadata')->nullable(); // Additional settings, styling, etc.
            $table->timestamps();
            
            $table->index(['status', 'scheduled_at']);
            $table->index(['type', 'priority']);
            $table->index(['target_audience', 'status']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};


