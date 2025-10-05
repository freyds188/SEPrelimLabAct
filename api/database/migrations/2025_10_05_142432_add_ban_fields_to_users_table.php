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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('email_verified_at');
            $table->timestamp('banned_at')->nullable()->after('is_active');
            $table->text('ban_reason')->nullable()->after('banned_at');
            $table->timestamp('banned_until')->nullable()->after('ban_reason');
            
            $table->index(['is_active', 'banned_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'banned_at']);
            $table->dropColumn(['is_active', 'banned_at', 'ban_reason', 'banned_until']);
        });
    }
};
