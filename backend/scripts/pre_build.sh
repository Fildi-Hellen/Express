#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

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

echo "Loaded environment variables:"
env | grep DB_

echo "Setting up Laravel environment..."
cp "$CODEBUILD_SRC_DIR/backend/.env.example" "$CODEBUILD_SRC_DIR/backend/.env"
printf '%s\n' "DB_CONNECTION=mysql" >> "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_HOST=.*|DB_HOST=\"$DB_HOST\"|" "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_DATABASE=.*|DB_DATABASE=\"$DB_DATABASE\"|" "$CODEBUILD_SRC_DIR/backend/.env"
sed -i "s|DB_USERNAME=.*|DB_USERNAME=\"$DB_USERNAME\"|" "$CODEBUILD_SRC_DIR/backend/.env"
printf '%s\n' "DB_PASSWORD=\"$DB_PASSWORD\"" >> "$CODEBUILD_SRC_DIR/backend/.env"
echo "Laravel environment file configured."

echo "Installing PHP dependencies..."
cd "$CODEBUILD_SRC_DIR/backend"
rm -rf vendor
composer install --no-dev --optimize-autoloader
