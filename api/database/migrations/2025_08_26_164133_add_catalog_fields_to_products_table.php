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
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->unique()->after('name');
            $table->string('tribe')->nullable()->after('category');
            $table->string('technique')->nullable()->after('tribe');
            $table->json('care_instructions')->nullable()->after('specifications');
            $table->json('dimensions')->nullable()->after('care_instructions');
            $table->string('material')->nullable()->after('dimensions');
            $table->string('color')->nullable()->after('material');
            $table->integer('weight_grams')->nullable()->after('color');
            $table->boolean('is_handmade')->default(true)->after('is_featured');
            $table->string('origin_region')->nullable()->after('is_handmade');
            
            // Add indexes for better performance
            $table->index(['tribe', 'status']);
            $table->index(['technique', 'status']);
            $table->index(['price', 'status']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['tribe', 'status']);
            $table->dropIndex(['technique', 'status']);
            $table->dropIndex(['price', 'status']);
            $table->dropIndex(['slug']);
            
            $table->dropColumn([
                'slug', 'tribe', 'technique', 'care_instructions', 
                'dimensions', 'material', 'color', 'weight_grams', 
                'is_handmade', 'origin_region'
            ]);
        });
    }
};
