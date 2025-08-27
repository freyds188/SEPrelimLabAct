<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->enum('type', ['photo_essay', 'oral_history', 'timeline', 'map'])->default('photo_essay')->after('title');
            $table->json('blocks')->nullable()->after('content');
            $table->json('language_tags')->nullable()->after('tags');
            $table->timestamp('scheduled_at')->nullable()->after('published_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->dropColumn(['type', 'blocks', 'language_tags', 'scheduled_at']);
        });
    }
};
