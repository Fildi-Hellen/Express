@echo off
REM Complete Database Reset and Test Data Creation

echo 🚀 EXPRESS PROJECT - COMPLETE DATABASE RESET
echo ===============================================
echo.

cd /d "C:\Users\fab\Documents\Express\backend"

echo 🗑️ Step 1: Clearing database...
php artisan migrate:fresh

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Migration failed. Trying manual reset...
    del database\database.sqlite 2>nul
    type nul > database\database.sqlite
    php artisan migrate
)

echo.
echo 🌱 Step 2: Creating test data...
php artisan db:seed --class=TestDataSeeder

echo.
echo ✅ RESET COMPLETE!
echo ===============================================
echo 🔑 LOGIN CREDENTIALS:
echo.
echo 👨‍💼 DRIVERS:
echo - Email: driver1@example.com
echo - Email: driver2@example.com  
echo - Email: driver3@example.com
echo - Password: password123
echo.
echo 👥 PASSENGERS:
echo - Email: passenger1@example.com
echo - Password: password123
echo.
echo 🎯 WHAT'S INCLUDED:
echo - 3 drivers with different vehicles
echo - 5 passengers 
echo - Pending rides (unassigned)
echo - Confirmed rides (assigned to drivers)
echo - Completed rides (for history)
echo.
echo 🧪 TEST THE FILTERING:
echo 1. Login as driver1@example.com
echo 2. Go to Trip Management
echo 3. Toggle "Filter for me" to see the difference
echo.
echo 🚀 Ready to test!
echo ===============================================

pause
