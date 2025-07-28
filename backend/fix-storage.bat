@echo off
echo Fixing Laravel storage symlink issue...
cd /d "C:\Users\fab\Documents\Express\backend"

echo Current directory: %CD%

echo Checking existing storage link...
if exist "public\storage" (
    echo Removing existing storage link...
    rmdir /s /q "public\storage"
)

echo Creating storage directories if they don't exist...
if not exist "storage\app\public" mkdir "storage\app\public"
if not exist "storage\app\public\profile_pictures" mkdir "storage\app\public\profile_pictures"

echo Creating new storage symlink...
mklink /D "public\storage" "..\storage\app\public"

echo Verifying symlink...
if exist "public\storage" (
    echo ✅ Storage symlink created successfully
    dir "public\storage"
) else (
    echo ❌ Failed to create storage symlink
)

echo Clearing Laravel cache...
php artisan config:clear
php artisan cache:clear

echo Done!
pause