@echo off
echo === Building Driver Frontend with Navbar Profile Picture ===
cd /d "C:\Users\fab\Documents\Express\driver"

echo [1/3] Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
) else (
    echo Dependencies already installed
)

echo [2/3] Building the application...
npm run build

echo [3/3] Starting development server...
echo.
echo ✅ Navbar Profile Picture Features Added:
echo - Dynamic profile picture in navbar
echo - Falls back to initials when no image
echo - Real-time updates when profile picture changes
echo - Proper styling and hover effects
echo - Shared state management between components
echo.
echo 🔗 Features to test:
echo 1. Login/register and see initials in navbar
echo 2. Upload profile picture - navbar updates immediately
echo 3. Remove profile picture - navbar shows initials again
echo 4. Navigate between pages - navbar persists profile picture
echo.

ng serve --open