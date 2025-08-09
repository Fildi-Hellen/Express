#!/bin/bash
set -euo pipefail

cd /var/www/expressud

# Ensure we can write here (CodeDeploy copies as root)
sudo chown -R ubuntu:www-data /var/www/expressud
sudo chmod -R 775 /var/www/expressud

# Make sure storage/cache exist and are writable
mkdir -p storage/logs bootstrap/cache
chmod -R ug+rw storage bootstrap/cache

# Remove any stale compiled caches that may point to /codebuild paths
rm -f bootstrap/cache/*.php || true

# Ensure AWS CLI exists (safety if not installed yet)
if ! command -v aws >/dev/null 2>&1; then
  sudo apt-get update -o Acquire::ForceIPv4=true
  sudo apt-get install -y awscli -o Acquire::ForceIPv4=true
fi

# Build .env from SSM (use tee to avoid redirection perms)
{
  echo "APP_NAME=Expressud"
  echo "APP_ENV=$(aws ssm get-parameter --name /expressud/APP_ENV --with-decryption --query 'Parameter.Value' --output text)"
  echo "APP_DEBUG=$(aws ssm get-parameter --name /expressud/APP_DEBUG --with-decryption --query 'Parameter.Value' --output text)"
  echo "APP_URL=$(aws ssm get-parameter --name /expressud/APP_URL --with-decryption --query 'Parameter.Value' --output text)"
  echo "LOG_CHANNEL=stack"
  echo "DB_CONNECTION=mysql"
  echo "DB_HOST=$(aws ssm get-parameter --name /expressud/DB_HOST --with-decryption --query 'Parameter.Value' --output text)"
  echo "DB_PORT=3306"
  echo "DB_DATABASE=expressud-db"
  echo "DB_USERNAME=$(aws ssm get-parameter --name /expressud/DB_USERNAME --with-decryption --query 'Parameter.Value' --output text)"
  echo "DB_PASSWORD=$(aws ssm get-parameter --name /expressud/DB_PASSWORD --with-decryption --query 'Parameter.Value' --output text)"
} | tee .env >/dev/null

# Composer (install if missing)
if ! command -v composer >/dev/null 2>&1; then
  cd ~
  php -r "copy('https://getcomposer.org/installer','composer-setup.php');"
  php composer-setup.php
  sudo mv composer.phar /usr/local/bin/composer
  rm composer-setup.php
  cd - >/dev/null
fi

# Install dependencies on the instance (matches runtime PHP)
composer install --no-interaction --prefer-dist --optimize-autoloader

# Clear any build-time cache and rebuild on EC2
php artisan config:clear
php artisan route:clear || true
php artisan view:clear || true

# Generate APP_KEY once if missing (or load from SSM if you prefer)
if ! grep -q "^APP_KEY=" .env || [ -z "$(grep '^APP_KEY=' .env | cut -d= -f2-)" ]; then
  KEY=$(php artisan key:generate --show || true)
  if [ -n "${KEY:-}" ]; then
    sed -i "1s|^|APP_KEY=$KEY\n|" .env
  fi
fi

php artisan config:cache
php artisan route:cache || true
php artisan view:cache || true

php artisan migrate --force
