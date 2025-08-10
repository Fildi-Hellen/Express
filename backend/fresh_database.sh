#!/bin/bash

# Fresh migration script
# This will completely reset your database

echo "🔄 Starting fresh database migration..."

# Navigate to Laravel directory
cd "$(dirname "$0")"

echo "📦 Dropping all tables..."
php artisan db:wipe --force

echo "🏗️  Running fresh migrations..."
php artisan migrate:fresh

echo "🌱 Seeding database (if you have seeders)..."
php artisan db:seed

echo "✅ Database reset complete!"
echo "🎉 Your database is now clean and ready to use!"
