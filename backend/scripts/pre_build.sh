#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

# Step 1: Fetch environment variables from AWS Parameter Store
echo "Fetching environment variables from AWS Parameter Store..."
export DB_HOST=$(aws ssm get-parameter --name "/expressuddb/db_host" --query Parameter.Value --output text)
export DB_PORT=$(aws ssm get-parameter --name "/expressuddb/db_port" --query Parameter.Value --output text)
export DB_DATABASE=$(aws ssm get-parameter --name "/expressuddb/db_name" --query Parameter.Value --output text)
export DB_USERNAME=$(aws ssm get-parameter --name "/expressuddb/db_user" --query Parameter.Value --output text)
export DB_PASSWORD=$(aws ssm get-parameter --name "/expressuddb/db_password" --with-decryption --query Parameter.Value --output text)

echo "Environment variables loaded successfully."

# Step 2: Test database connectivity
echo "Testing database connectivity..."
yum install -y nmap-ncat
if nc -zv "$DB_HOST" "$DB_PORT"; then
  echo "Successfully connected to the database at $DB_HOST:$DB_PORT."
else
  echo "Failed to connect to the database at $DB_HOST:$DB_PORT."
  exit 1
fi

# Step 3: Configure Laravel environment
echo "Setting up Laravel environment..."
cp "$CODEBUILD_SRC_DIR/backend/.env.example" "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|g" "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_PORT=.*|DB_PORT=$DB_PORT|g" "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|g" "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_USERNAME=.*|DB_USERNAME=$DB_USERNAME|g" "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|g" "$CODEBUILD_SRC_DIR/backend/.env"

echo ".env file updated successfully."

# Step 4: Install dependencies
echo "Installing PHP dependencies..."
cd "$CODEBUILD_SRC_DIR/backend"
composer install --no-dev --optimize-autoloader
