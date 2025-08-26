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
        Schema::table('media', function (Blueprint $table) {
            $table->json('optimized_paths')->nullable()->after('metadata');
            $table->json('exif_data')->nullable()->after('optimized_paths');
            $table->enum('optimization_status', ['pending', 'processing', 'completed', 'failed'])
                  ->default('pending')
                  ->after('exif_data');
            
            $table->index('optimization_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropIndex(['optimization_status']);
            $table->dropColumn(['optimized_paths', 'exif_data', 'optimization_status']);
        });
    }
};
