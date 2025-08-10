<?php
/**
 * Complete database reset and fix script
 * Run this from the Laravel project root: php complete_database_fix.php
 */

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

try {
    echo "🔧 Starting complete database fix...\n\n";
    
    // Step 1: Drop all tables except migrations
    echo "1️⃣ Dropping all existing tables (except migrations)...\n";
    $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    
    DB::statement('PRAGMA foreign_keys = OFF');
    
    foreach ($tables as $table) {
        $tableName = $table->name;
        if ($tableName !== 'migrations') {
            echo "   Dropping table: {$tableName}\n";
            DB::statement("DROP TABLE IF EXISTS {$tableName}");
        }
    }
    
    DB::statement('PRAGMA foreign_keys = ON');
    
    // Step 2: Reset migrations table
    echo "\n2️⃣ Resetting migrations table...\n";
    DB::table('migrations')->delete();
    
    // Step 3: Run fresh migrations
    echo "\n3️⃣ Running fresh migrations...\n";
    Artisan::call('migrate', ['--force' => true]);
    echo Artisan::output();
    
    // Step 4: Verify tables were created
    echo "\n4️⃣ Verifying database structure...\n";
    $requiredTables = [
        'users',
        'personal_access_tokens', 
        'rides',
        'drivers'
    ];
    
    $allTablesExist = true;
    foreach ($requiredTables as $table) {
        if (Schema::hasTable($table)) {
            echo "   ✅ {$table}\n";
        } else {
            echo "   ❌ {$table}\n";
            $allTablesExist = false;
        }
    }
    
    if ($allTablesExist) {
        echo "\n🎉 Database completely fixed and ready to use!\n";
        echo "✅ All required tables are now present\n";
        echo "✅ You can now login and create rides\n";
    } else {
        echo "\n❌ Some tables are still missing. Manual intervention may be required.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nTrying alternative approach...\n";
    
    try {
        // Alternative: Complete fresh migration
        echo "🔄 Running complete database reset...\n";
        Artisan::call('migrate:fresh', ['--force' => true]);
        echo Artisan::output();
        echo "✅ Alternative fix completed!\n";
    } catch (Exception $e2) {
        echo "❌ Alternative fix also failed: " . $e2->getMessage() . "\n";
        echo "Please try running manually: php artisan migrate:fresh --force\n";
    }
}
