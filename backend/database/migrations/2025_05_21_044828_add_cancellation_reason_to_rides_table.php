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
        if (Schema::hasTable('rides')) {
            Schema::table('rides', function (Blueprint $table) {
                if (!Schema::hasColumn('rides', 'cancellation_reason')) {
                    $table->text('cancellation_reason')->nullable()->after('status');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('rides') && Schema::hasColumn('rides', 'cancellation_reason')) {
            Schema::table('rides', function (Blueprint $table) {
                $table->dropColumn('cancellation_reason');
            });
        }
    }
};
