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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('slug')->unique();
            $table->string('featured_image')->nullable();
            $table->json('images')->nullable(); // Array of image URLs
            $table->decimal('goal_amount', 12, 2);
            $table->decimal('current_amount', 12, 2)->default(0.00);
            $table->integer('donors_count')->default(0);
            $table->enum('status', ['draft', 'active', 'paused', 'completed', 'cancelled'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->json('tags')->nullable(); // Array of tags
            $table->integer('views_count')->default(0);
            $table->timestamps();
            
            $table->index(['status', 'is_featured']);
            $table->index('slug');
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
