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
        
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('establishment_name');
            $table->string('establishment_type');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('email')->unique();
            $table->string('password');
            $table->integer('number_of_stores');
            $table->string('location');
            $table->boolean('promocode')->default(false);
            $table->boolean('accept_updates')->default(false);
            $table->boolean('accept_privacy_policy');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
