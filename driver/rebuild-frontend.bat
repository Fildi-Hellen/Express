@echo off
echo === Rebuilding Driver Frontend ===
cd /d "C:\Users\fab\Documents\Express\driver"

echo [1/3] Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
) else (
    echo Node modules already exist, skipping install
)

echo [2/3] Building Angular application...
npm run build

echo [3/3] Starting development server...
echo.
echo ✅ Frontend changes made:
echo - Updated getProfilePictureUrl() to check profile_picture_url first
echo - Updated loadDriverProfile() to store profile_picture_url
echo - Updated uploadProfilePicture() to handle response correctly
echo - Updated removeProfilePicture() to clear both fields
echo - Updated HTML template condition for Remove button
echo.
echo 🔗 After server starts, test:
echo - Upload a new profile picture
echo - Check that it displays immediately
echo - Refresh page and verify it persists
echo.

ng serve --open