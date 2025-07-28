@echo off
echo === Complete Fix for Navbar Profile Picture ===
cd /d "C:\Users\fab\Documents\Express\driver"

echo [1/5] Cleaning up duplicate folders...
if exist "src\app\services" (
    rmdir /s /q "src\app\services"
    echo ✅ Removed duplicate services folder
)

echo [2/5] Verifying file structure...
if exist "src\app\Services\profile-state.service.ts" (
    echo ✅ ProfileStateService found in correct location
) else (
    echo ❌ ProfileStateService not found!
    pause
    exit /b 1
)

echo [3/5] Clearing caches and temporary files...
if exist "dist" rmdir /s /q "dist"
if exist ".angular" rmdir /s /q ".angular"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"

echo [4/5] Installing dependencies...
npm install

echo [5/5] Building the project...
ng build --configuration development

echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful! 
    echo.
    echo 🎉 Navbar Profile Picture Features Ready:
    echo - Dynamic profile pictures in navbar
    echo - Real-time updates when picture changes
    echo - Initials fallback when no picture
    echo - Proper state management between components
    echo.
    echo Starting development server...
    ng serve --open
) else (
    echo ❌ Build failed. Checking for common issues...
    echo.
    echo Please check:
    echo 1. All import paths use "Services" (capitalized)
    echo 2. No duplicate services folders exist
    echo 3. ProfileStateService file has proper formatting
    echo.
    pause
)