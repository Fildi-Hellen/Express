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
        if (Schema::hasTable('drivers')) {
            Schema::table('drivers', function (Blueprint $table) {
                if (!Schema::hasColumn('drivers', 'vehicle_model')) {
                    $table->string('vehicle_model')->nullable()->after('vehicle_number');
                }
                if (!Schema::hasColumn('drivers', 'license_plate')) {
                    $table->string('license_plate')->nullable()->after('vehicle_model');
                }
                if (!Schema::hasColumn('drivers', 'rating')) {
                    $table->decimal('rating', 3, 2)->default(5.0)->after('license_plate');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('drivers')) {
            Schema::table('drivers', function (Blueprint $table) {
                $columnsToCheck = ['vehicle_model', 'license_plate', 'rating'];
                $columnsToDrop = [];
                
                foreach ($columnsToCheck as $column) {
                    if (Schema::hasColumn('drivers', $column)) {
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
