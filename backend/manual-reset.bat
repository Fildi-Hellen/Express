@echo off
REM Manual SQLite Database Reset

echo 🗑️ Manually resetting SQLite database...

cd /d "C:\Users\fab\Documents\Express\backend"

REM Backup current database (optional)
if exist database\database.sqlite (
    copy database\database.sqlite database\database_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sqlite
    echo 📦 Backup created
)

REM Delete current database
del database\database.sqlite 2>nul

REM Create fresh database
type nul > database\database.sqlite

REM Run migrations
echo 📋 Creating fresh tables...
php artisan migrate

echo ✅ Database manually reset complete!
echo 💡 Run 'php artisan db:seed' to add test data

pause
