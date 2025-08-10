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
        // Check if drivers table exists before trying to modify it
        if (Schema::hasTable('drivers')) {
            Schema::table('drivers', function (Blueprint $table) {
                if (!Schema::hasColumn('drivers', 'profile_picture')) {
                    $table->string('profile_picture')->nullable()->after('payout_method');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('drivers') && Schema::hasColumn('drivers', 'profile_picture')) {
            Schema::table('drivers', function (Blueprint $table) {
                $table->dropColumn('profile_picture');
            });
        }
    }
};
