@echo off
REM Database Reset Script for Express Project

echo 🗑️  Clearing Express database...

REM Navigate to backend directory
cd /d "C:\Users\fab\Documents\Express\backend"

REM Method 1: Laravel Fresh Migration (Recommended)
echo 📋 Running fresh migrations...
php artisan migrate:fresh

echo ✅ Database cleared and recreated!

REM Optional: Uncomment to run seeders
REM echo 🌱 Running seeders...
REM php artisan db:seed

echo 🚀 Database is ready for fresh data!
echo 💡 To add test data, run: php artisan db:seed

pause
