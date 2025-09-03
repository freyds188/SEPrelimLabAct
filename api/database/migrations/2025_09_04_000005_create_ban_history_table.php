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
        Schema::create('ban_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('banned_by')->constrained('admin_users')->onDelete('cascade');
            $table->enum('action', ['banned', 'unbanned', 'suspended', 'warned'])->default('banned');
            $table->text('reason');
            $table->text('evidence')->nullable(); // Screenshots, reports, etc.
            $table->enum('duration', ['temporary', 'permanent'])->default('temporary');
            $table->timestamp('banned_until')->nullable(); // For temporary bans
            $table->json('restrictions')->nullable(); // Specific restrictions applied
            $table->boolean('is_active')->default(true); // For temporary bans
            $table->text('admin_notes')->nullable(); // Internal admin notes
            $table->timestamps();
            
            $table->index(['user_id', 'is_active']);
            $table->index(['banned_by', 'created_at']);
            $table->index(['action', 'created_at']);
            $table->index('banned_until');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ban_history');
    }
};


