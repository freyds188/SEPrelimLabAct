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
        Schema::create('glossary_terms', function (Blueprint $table) {
            $table->id();
            $table->string('term')->unique();
            $table->text('definition');
            $table->string('category')->nullable(); // weaving_technique, material, tool, etc.
            $table->json('examples')->nullable(); // Array of example sentences
            $table->json('related_terms')->nullable(); // Array of related term IDs
            $table->string('image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('views_count')->default(0);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();
            
            $table->index(['category', 'status']);
            $table->index('is_featured');
            $table->index('term');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('glossary_terms');
    }
};
