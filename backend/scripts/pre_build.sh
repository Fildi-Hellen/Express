#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

# Step 1: Test database connectivity
echo "Testing database connectivity..."
yum install -y nmap-ncat

if nc -zv "$DB_HOST" "$DB_PORT"; then
  echo "Successfully connected to the database at $DB_HOST:$DB_PORT."
else
  echo "Failed to connect to the database at $DB_HOST:$DB_PORT."
  exit 1
fi

# Step 2: Display the current .env file
if [ -f "$CODEBUILD_SRC_DIR/backend/.env" ]; then
  echo "Current .env file:"
  cat "$CODEBUILD_SRC_DIR/backend/.env"
else
  echo ".env file not found!"
fi

# Step 3: Clear and Cache Laravel settings
echo "Clearing Laravel caches..."
php artisan cache:clear
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
echo "Laravel caches cleared."

# Step 4: Run Laravel database migrations
echo "Running database migrations..."
php artisan migrate --force
echo "Database migrations completed successfully."
