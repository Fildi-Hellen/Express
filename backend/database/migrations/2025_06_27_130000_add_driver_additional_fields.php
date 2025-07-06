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
        Schema::table('drivers', function (Blueprint $table) {
            $table->string('vehicle_model')->nullable()->after('vehicle_number');
            $table->string('license_plate')->nullable()->after('vehicle_model');
            $table->decimal('rating', 3, 2)->default(5.0)->after('license_plate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn(['vehicle_model', 'license_plate', 'rating']);
        });
    }
};
