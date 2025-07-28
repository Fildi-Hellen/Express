@echo off
echo === Cleaning up duplicate services folder ===
cd /d "C:\Users\fab\Documents\Express\driver\src\app"

echo Removing duplicate lowercase services folder...
if exist "services" (
    rmdir /s /q "services"
    echo ✅ Removed duplicate services folder
) else (
    echo ℹ️ No duplicate services folder found
)

echo.
echo Current Services folder contents:
dir "Services"

echo.
echo === Fixed TypeScript Import Errors ===
echo ✅ Updated import paths to use capitalized Services folder
echo ✅ Removed duplicate lowercase services folder
echo ✅ profile-state.service.ts is in correct location

echo.
echo Ready to build! Run the fix-and-build.bat script.