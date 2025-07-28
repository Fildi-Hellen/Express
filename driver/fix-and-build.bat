@echo off
echo === Fixing TypeScript Errors and Building ===
cd /d "C:\Users\fab\Documents\Express\driver"

echo [1/4] Checking if the profile service file is correct...
type "src\app\services\profile-state.service.ts"

echo.
echo [2/4] Clearing any cached builds...
if exist "dist" rmdir /s /q "dist"
if exist ".angular" rmdir /s /q ".angular"

echo [3/4] Installing dependencies...
npm install

echo [4/4] Building the project...
ng build

echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful! Starting development server...
    ng serve --open
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
)