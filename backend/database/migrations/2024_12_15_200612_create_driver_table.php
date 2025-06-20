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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');

            
            // New fields
            $table->string('phone')->nullable();
            $table->string('vehicle_type')->nullable(); // For ride booking
            $table->string('vehicle_number')->nullable();
            $table->string('account_name')->nullable(); // For payouts
            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('payout_method')->nullable();

            $table->boolean('is_available')->default(false);
              $table->boolean('is_available_for_ride')->default(true);
            $table->timestamps();
        });
    }

    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
