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
                if (!Schema::hasColumn('rides', 'pickup_location')) {
                    $table->string('pickup_location')->after('driver_id');
                }
                if (!Schema::hasColumn('rides', 'destination')) {
                    $table->string('destination')->after('pickup_location');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('rides')) {
            Schema::table('rides', function (Blueprint $table) {
                $columnsToCheck = ['pickup_location', 'destination'];
                $columnsToDrop = [];
                
                foreach ($columnsToCheck as $column) {
                    if (Schema::hasColumn('rides', $column)) {
                        $columnsToDrop[] = $column;
                    }
                }
                
                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }
};
