#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

echo "Running post-build steps..."

# Step 1: Display the current .env file
echo "Current .env file:"
cat "$CODEBUILD_SRC_DIR/backend/.env"

# Step 2: Clear and Cache Laravel settings
echo "Clearing Laravel caches..."
php artisan cache:clear
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
echo "Laravel caches cleared."

# Step 3: Run Laravel database migrations
echo "Running database migrations..."
php artisan migrate --force
echo "Database migrations completed successfully."
