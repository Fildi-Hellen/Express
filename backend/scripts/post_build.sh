#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

echo "Running post-build steps..."

# Step 1: Verify successful deployment or configuration (if any)
echo "Verifying Laravel deployment..."
php artisan config:cache
echo "Post-build steps completed successfully."
