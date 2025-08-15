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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('original_name');
            $table->string('mime_type');
            $table->string('extension');
            $table->string('path');
            $table->string('disk')->default('public');
            $table->integer('size'); // File size in bytes
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->json('metadata')->nullable(); // Width, height, etc.
            $table->morphs('mediable'); // Polymorphic relationship
            $table->string('collection')->nullable(); // For organizing media
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->index(['mediable_type', 'mediable_id']);
            $table->index('collection');
            $table->index('mime_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
