<?php
/**
 * Nuclear database fix - delete database file and recreate everything
 * Run this from the Laravel project root: php nuclear_database_fix.php
 */

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

try {
    echo "🚀 Starting nuclear database fix...\n\n";
    
    // Step 1: Get database path
    $databasePath = database_path('database.sqlite');
    echo "1️⃣ Database location: {$databasePath}\n";
    
    // Step 2: Delete the entire database file
    if (file_exists($databasePath)) {
        echo "2️⃣ Deleting existing database file...\n";
        unlink($databasePath);
        echo "   ✅ Database file deleted\n";
    } else {
        echo "2️⃣ No existing database file found\n";
    }
    
    // Step 3: Create new empty database file
    echo "\n3️⃣ Creating new database file...\n";
    touch($databasePath);
    echo "   ✅ New database file created\n";
    
    // Step 4: Run fresh migrations
    echo "\n4️⃣ Running fresh migrations...\n";
    Artisan::call('migrate', ['--force' => true]);
    echo Artisan::output();
    
    // Step 5: Verify tables were created
    echo "\n5️⃣ Verifying database structure...\n";
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
        echo "\n🎉 Nuclear fix completed successfully!\n";
        echo "✅ All required tables are now present\n";
        echo "✅ Database is completely fresh and ready to use\n";
        echo "✅ You can now register/login users and create rides\n";
    } else {
        echo "\n❌ Some tables are still missing. Check the migration output above.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Nuclear fix failed: " . $e->getMessage() . "\n";
    echo "You may need to check your database configuration.\n";
}
