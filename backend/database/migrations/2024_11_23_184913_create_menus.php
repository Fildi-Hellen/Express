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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('availability');
            $table->string('category');
            $table->string('establishmentName');
            $table->string('image')->nullable();

            // Fields for specific categories
            $table->string('cookTime')->nullable(); // For restaurant
            $table->date('expirationDate')->nullable(); // For pharmacy
            $table->date('manufacturingDate')->nullable(); // For pharmacy
            $table->string('location')->nullable(); // For real estate
            $table->decimal('size', 10, 2)->nullable(); // For real estate
            $table->decimal('acres', 10, 2)->nullable(); // For real estate

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
