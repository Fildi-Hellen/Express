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
        // Check if messages table exists, if not create it
        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('sender_id');
                $table->unsignedBigInteger('recipient_id');
                $table->text('content');
                $table->enum('sender_type', ['user', 'driver'])->default('user');
                $table->boolean('is_read')->default(false);
                $table->timestamps();

                // Indexes for better performance
                $table->index(['sender_id', 'recipient_id']);
                $table->index(['recipient_id', 'sender_id']);
                $table->index(['sender_type']);
                $table->index(['is_read']);
                $table->index(['created_at']);
            });
        } else {
            // If table exists, ensure all columns exist
            Schema::table('messages', function (Blueprint $table) {
                if (!Schema::hasColumn('messages', 'sender_type')) {
                    $table->enum('sender_type', ['user', 'driver'])->default('user')->after('content');
                }
                if (!Schema::hasColumn('messages', 'is_read')) {
                    $table->boolean('is_read')->default(false)->after('sender_type');
                }
            });

            // Add indexes if they don't exist
            try {
                Schema::table('messages', function (Blueprint $table) {
                    $table->index(['sender_id', 'recipient_id']);
                    $table->index(['recipient_id', 'sender_id']);
                    $table->index(['sender_type']);
                    $table->index(['is_read']);
                    $table->index(['created_at']);
                });
            } catch (\Exception $e) {
                // Indexes might already exist, that's fine
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
