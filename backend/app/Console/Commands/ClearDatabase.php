<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ClearDatabase extends Command
{
    protected $signature = 'db:clear {--confirm : Skip confirmation prompt}';
    protected $description = 'Clear all data from the database';

    public function handle()
    {
        if (!$this->option('confirm')) {
            if (!$this->confirm('Are you sure you want to clear ALL data from the database? This cannot be undone!')) {
                $this->info('Operation cancelled.');
                return;
            }
        }

        try {
            $this->info('Starting database cleanup...');
            
            // Get all table names
            $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
            
            $this->info('Found ' . count($tables) . ' tables to clear');
            
            // Disable foreign key constraints temporarily
            DB::statement('PRAGMA foreign_keys = OFF');
            
            $progressBar = $this->output->createProgressBar(count($tables));
            $progressBar->start();
            
            foreach ($tables as $table) {
                $tableName = $table->name;
                
                // Skip Laravel system tables if you want to keep them
                if (in_array($tableName, ['migrations'])) {
                    $this->line("\nSkipping system table: {$tableName}");
                    $progressBar->advance();
                    continue;
                }
                
                // Clear the table
                DB::table($tableName)->delete();
                $this->line("\nCleared table: {$tableName}");
                $progressBar->advance();
            }
            
            $progressBar->finish();
            
            // Re-enable foreign key constraints
            DB::statement('PRAGMA foreign_keys = ON');
            
            // Reset auto-increment counters
            DB::statement("DELETE FROM sqlite_sequence");
            
            $this->info("\nDatabase cleared successfully!");
            $this->info('All auto-increment counters have been reset.');
            
        } catch (\Exception $e) {
            $this->error('Error clearing database: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
