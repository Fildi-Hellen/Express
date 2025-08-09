#!/bin/bash
set -euo pipefail

REGION="af-south-1"

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

# Helper to fetch a parameter value
getp() {
  aws ssm get-parameter \
    --name "$1" \
    --with-decryption \
    --query 'Parameter.Value' \
    --output text \
    --region "$REGION"
}

APP_ENV=$(getp /expressud/APP_ENV)
APP_DEBUG=$(getp /expressud/APP_DEBUG)
APP_URL=$(getp /expressud/APP_URL)
DB_HOST=$(getp /expressud/DB_HOST)
DB_USERNAME=$(getp /expressud/DB_USERNAME)
DB_PASSWORD=$(getp /expressud/DB_PASSWORD)

# Validate critical ones
[ -n "$DB_HOST" ]     || { echo "ERROR: /expressud/DB_HOST is empty"; exit 1; }
[ -n "$DB_USERNAME" ] || { echo "ERROR: /expressud/DB_USERNAME is empty"; exit 1; }
[ -n "$DB_PASSWORD" ] || { echo "ERROR: /expressud/DB_PASSWORD is empty"; exit 1; }

# Build .env from SSM (use tee to avoid redirection perms)
{
  echo "APP_NAME=Expressud"
  echo "APP_ENV=${APP_ENV:-production}"
  echo "APP_DEBUG=${APP_DEBUG:-false}"
  echo "APP_URL=${APP_URL:-https://api.expressud.com}"
  echo "LOG_CHANNEL=stack"
  echo "DB_CONNECTION=mysql"
  echo "DB_HOST=$DB_HOST"
  echo "DB_PORT=3306"
  echo "DB_DATABASE=expressud-db"
  echo "DB_USERNAME=$DB_USERNAME"
  echo "DB_PASSWORD=\"$DB_PASSWORD\"" 
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

# Generate APP_KEY once if missing (or store in SSM if you prefer)
if ! grep -q "^APP_KEY=" .env || [ -z "$(grep '^APP_KEY=' .env | cut -d= -f2-)" ]; then
  KEY=$(php artisan key:generate --show || true)
  if [ -n "${KEY:-}" ]; then
    sed -i "1s|^|APP_KEY=$KEY\n|" .env
  fi
fi

php artisan config:cache
php artisan route:cache || true
php artisan view:cache || true

# Run migrations (will now use the RDS host)
php artisan migrate --force
