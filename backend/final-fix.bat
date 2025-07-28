@echo off
echo === Final Fix for Profile Picture URLs ===
cd /d "C:\Users\fab\Documents\Express\backend"

echo [1/4] Clearing all Laravel caches...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo [2/4] Verifying storage setup...
php artisan storage:link

echo [3/4] Testing routes are registered...
echo Looking for file routes:
php artisan route:list | findstr "files"

echo [4/4] Starting Laravel server...
echo.
echo ✅ Changes made:
echo - Fixed JSON escaped slashes in all controller responses
echo - Added JSON_UNESCAPED_SLASHES flag to all API responses
echo - Enhanced error handling in FileController
echo.
echo 🔗 Test URLs after server starts:
echo - Upload test: Upload a new profile picture
echo - Profile test: http://localhost:8000/api/drivers/7/profile
echo - Direct image: http://localhost:8000/api/files/profile-pictures/driver_7_1753710175.png
echo.
echo 📋 Open test page: test-profile-urls.html
echo.

php artisan serve --host=127.0.0.1 --port=8000