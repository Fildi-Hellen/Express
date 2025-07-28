@echo off
echo Checking Laravel routes...
cd /d "C:\Users\fab\Documents\Express\backend"

echo Listing all registered routes:
php artisan route:list | findstr "files"

echo.
echo Testing if route is accessible:
curl -I http://localhost:8000/api/files/profile-pictures/driver_7_1753608290.png

echo.
echo Testing debug endpoint:
curl -I http://localhost:8000/api/debug/storage

pause