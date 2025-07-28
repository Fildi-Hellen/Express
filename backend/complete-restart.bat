@echo off
echo Comprehensive Laravel server restart with storage fix...
cd /d "C:\Users\fab\Documents\Express\backend"

echo Step 1: Clearing Laravel caches...
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo Step 2: Fixing storage symlink...
if exist "public\storage" (
    echo Removing existing storage symlink...
    rmdir /s /q "public\storage" 2>nul
)

echo Creating storage directories...
if not exist "storage\app\public" mkdir "storage\app\public"
if not exist "storage\app\public\profile_pictures" mkdir "storage\app\public\profile_pictures"

echo Creating storage symlink...
php artisan storage:link

echo Step 3: Verifying file structure...
echo Checking storage files:
dir "storage\app\public\profile_pictures"
echo.
echo Checking public symlink:
dir "public\storage\profile_pictures" 2>nul || echo "Symlink not working properly"
echo.

echo Step 4: Starting Laravel development server...
echo Server will be available at: http://localhost:8000
echo Debug storage endpoint: http://localhost:8000/api/debug/storage
echo Test profile picture: http://localhost:8000/api/files/profile-pictures/driver_7_1753608290.png
echo.

php artisan serve --host=127.0.0.1 --port=8000