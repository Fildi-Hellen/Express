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
echo "Current .env file:"
cat "$CODEBUILD_SRC_DIR/backend/.env"

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

# Step 5: Fetch environment variables from AWS Parameter Store
echo "Fetching environment variables from AWS Parameter Store..."
export DB_HOST=$(aws ssm get-parameter --name "/expressuddb/db_host" --query Parameter.Value --output text)
echo "DB_HOST: $DB_HOST"

export DB_DATABASE=$(aws ssm get-parameter --name "/expressuddb/db_name" --query Parameter.Value --output text)
echo "DB_DATABASE: $DB_DATABASE"

export DB_USERNAME=$(aws ssm get-parameter --name "/expressuddb/db_user" --query Parameter.Value --output text)
echo "DB_USERNAME: $DB_USERNAME"

export DB_PASSWORD=$(aws ssm get-parameter --name "/expressuddb/db_password" --with-decryption --query Parameter.Value --output text)
echo "DB_PASSWORD retrieved successfully"

export DB_PORT=3306
echo "DB_PORT: $DB_PORT"

# Step 6: Set up Laravel environment
echo "Setting up Laravel environment..."
cp "$CODEBUILD_SRC_DIR/backend/.env.example" "$CODEBUILD_SRC_DIR/backend/.env"
printf '%s\n' "DB_CONNECTION=mysql" >> "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_HOST=.*|DB_HOST=\"$DB_HOST\"|" "$CODEBUILD_SRC_DIR/backend/.
