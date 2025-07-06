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
        Schema::table('rides', function (Blueprint $table) {
            $table->decimal('proposed_price', 10, 2)->nullable()->after('fare');
            $table->string('price_offer_message')->nullable()->after('proposed_price');
            $table->timestamp('started_at')->nullable()->after('created_at');
            $table->timestamp('completed_at')->nullable()->after('started_at');
            $table->string('eta')->nullable()->after('passengers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rides', function (Blueprint $table) {
            $table->dropColumn(['proposed_price', 'price_offer_message', 'started_at', 'completed_at', 'eta']);
        });
    }
};
