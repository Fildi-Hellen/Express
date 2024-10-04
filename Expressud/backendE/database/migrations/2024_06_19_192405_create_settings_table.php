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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('storeName');
            $table->string('address');
            $table->string('contactEmail');
            $table->string('contactPhone');
            $table->string('businessHours');
            $table->string('holidaySchedule');
            $table->string('paymentOptions');
            $table->string('shippingOptions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
