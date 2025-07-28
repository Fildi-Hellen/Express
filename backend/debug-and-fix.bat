@echo off
echo === Laravel File Upload Debug & Fix ===
cd /d "C:\Users\fab\Documents\Express\backend"

echo.
echo [1/6] Clearing all caches...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo.
echo [2/6] Checking file existence...
if exist "storage\app\public\profile_pictures\driver_7_1753608290.png" (
    echo ✅ File exists in storage
) else (
    echo ❌ File NOT found in storage
    echo Available files:
    dir "storage\app\public\profile_pictures"
)

echo.
echo [3/6] Checking storage symlink...
if exist "public\storage" (
    echo ✅ Storage symlink exists
    php artisan storage:link
) else (
    echo ❌ Creating storage symlink...
    php artisan storage:link
)

echo.
echo [4/6] Listing relevant routes...
echo Looking for file serving routes:
php artisan route:list | findstr /C:"files" /C:"debug" /C:"test-route"

echo.
echo [5/6] Testing server connectivity...
echo Starting server test in background...
start /min php artisan serve --host=127.0.0.1 --port=8000

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo Testing basic connectivity:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8000/api/test-route

echo.
echo [6/6] Instructions:
echo 1. Open debug-routes.html in your browser to test step by step
echo 2. Check the Laravel logs: storage\logs\laravel.log
echo 3. If 404 persists, check if routes are cached
echo.
echo Debug URLs to test manually:
echo - http://localhost:8000/api/test-route
echo - http://localhost:8000/api/debug/storage  
echo - http://localhost:8000/api/files/profile-pictures/driver_7_1753608290.png
echo.

pause