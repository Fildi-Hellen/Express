#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

echo "Testing database connectivity..."
yum install -y nmap-ncat

if nc -zv "$DB_HOST" "$DB_PORT"; then
  echo "Successfully connected to the database at $DB_HOST:$DB_PORT."
else
  echo "Failed to connect to the database at $DB_HOST:$DB_PORT."
  exit 1
fi

echo "Current .env file:"
cat "$CODEBUILD_SRC_DIR/backend/.env"

echo "Clearing Laravel caches..."
php artisan cache:clear
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
echo "Laravel caches cleared."

echo "Running database migrations..."
php artisan migrate --force
echo "Database migrations completed successfully."
