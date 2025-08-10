<?php
/**
 * Script to clear all data from the database
 * Run this from the Laravel project root: php clear_database.php
 */

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    echo "Starting database cleanup...\n";
    
    // Get all table names
    $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    
    echo "Found " . count($tables) . " tables to clear:\n";
    
    // Disable foreign key constraints temporarily
    DB::statement('PRAGMA foreign_keys = OFF');
    
    foreach ($tables as $table) {
        $tableName = $table->name;
        echo "Clearing table: {$tableName}\n";
        
        // Skip Laravel system tables if you want to keep them
        if (in_array($tableName, ['migrations'])) {
            echo "Skipping system table: {$tableName}\n";
            continue;
        }
        
        // Clear the table data but keep structure
        DB::table($tableName)->delete();
    }
    
    // Re-enable foreign key constraints
    DB::statement('PRAGMA foreign_keys = ON');
    
    echo "Database cleared successfully!\n";
    
} catch (Exception $e) {
    echo "Error clearing database: " . $e->getMessage() . "\n";
}
