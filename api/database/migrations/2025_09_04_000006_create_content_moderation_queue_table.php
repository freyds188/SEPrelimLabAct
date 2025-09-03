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
        Schema::create('content_moderation_queue', function (Blueprint $table) {
            $table->id();
            $table->string('content_type'); // story, campaign, product, comment, etc.
            $table->unsignedBigInteger('content_id');
            $table->foreignId('submitted_by')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected', 'requires_changes'])->default('pending');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->text('submission_notes')->nullable(); // Notes from submitter
            $table->text('moderation_notes')->nullable(); // Notes from moderators
            $table->foreignId('assigned_to')->nullable()->constrained('admin_users')->onDelete('set null');
            $table->foreignId('reviewed_by')->nullable()->constrained('admin_users')->onDelete('set null');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->json('flags')->nullable(); // Automated flags (spam, inappropriate, etc.)
            $table->integer('review_count')->default(0); // Number of times reviewed
            $table->timestamp('due_date')->nullable(); // When review should be completed
            $table->timestamps();
            
            $table->index(['content_type', 'content_id']);
            $table->index(['status', 'priority']);
            $table->index(['assigned_to', 'status']);
            $table->index(['due_date', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_moderation_queue');
    }
};


