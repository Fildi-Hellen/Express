<?php
/**
 * Script to fix missing database tables
 * Run this from the Laravel project root: php fix_database.php
 */

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

try {
    echo "Checking database structure...\n";
    
    // Check if critical tables exist
    $requiredTables = [
        'users',
        'personal_access_tokens',
        'rides',
        'drivers'
    ];
    
    $missingTables = [];
    
    foreach ($requiredTables as $table) {
        if (!Schema::hasTable($table)) {
            $missingTables[] = $table;
            echo "❌ Missing table: {$table}\n";
        } else {
            echo "✅ Table exists: {$table}\n";
        }
    }
    
    if (empty($missingTables)) {
        echo "✅ All required tables exist!\n";
    } else {
        echo "\n🔧 Running migrations to fix missing tables...\n";
        
        // Run migrations
        Artisan::call('migrate', ['--force' => true]);
        echo Artisan::output();
        
        echo "\n✅ Database structure fixed!\n";
    }
    
    echo "\n🎉 Database is ready to use!\n";
    
} catch (Exception $e) {
    echo "❌ Error fixing database: " . $e->getMessage() . "\n";
    echo "Try running: php artisan migrate --force\n";
}
