@echo off
echo Restarting Laravel development server...
cd /d "C:\Users\fab\Documents\Express\backend"

echo Clearing Laravel cache...
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo Ensuring storage link exists...
php artisan storage:link

echo Starting Laravel development server on port 8000...
php artisan serve --host=127.0.0.1 --port=8000

pause