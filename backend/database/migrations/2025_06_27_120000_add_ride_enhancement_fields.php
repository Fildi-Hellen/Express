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
                if (!Schema::hasColumn('rides', 'proposed_price')) {
                    $table->decimal('proposed_price', 10, 2)->nullable()->after('fare');
                }
                if (!Schema::hasColumn('rides', 'price_offer_message')) {
                    $table->string('price_offer_message')->nullable()->after('proposed_price');
                }
                if (!Schema::hasColumn('rides', 'started_at')) {
                    $table->timestamp('started_at')->nullable()->after('created_at');
                }
                if (!Schema::hasColumn('rides', 'completed_at')) {
                    $table->timestamp('completed_at')->nullable()->after('started_at');
                }
                if (!Schema::hasColumn('rides', 'eta')) {
                    $table->string('eta')->nullable()->after('passengers');
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
                $columnsToCheck = ['proposed_price', 'price_offer_message', 'started_at', 'completed_at', 'eta'];
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
