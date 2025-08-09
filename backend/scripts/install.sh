#!/bin/bash
set -euo pipefail

cd /var/www/expressud

# Build a new .env from SSM (use tee to avoid shell redirection permission pitfalls)
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

# Ensure storage/cache perms
mkdir -p storage bootstrap/cache
chmod -R ug+rw storage bootstrap/cache

# Install Composer if missing (safety)
if ! command -v composer >/dev/null 2>&1; then
  cd ~
  php -r "copy('https://getcomposer.org/installer','composer-setup.php');"
  php composer-setup.php
  sudo mv composer.phar /usr/local/bin/composer
  rm composer-setup.php
  cd - >/dev/null
fi

# Install PHP dependencies on the instance (best for env‑specific builds)
composer install --no-interaction --prefer-dist --optimize-autoloader

# Don’t use config cache from CodeBuild; refresh here so paths/env are correct
php artisan config:clear
php artisan route:clear || true
php artisan view:clear || true

# If APP_KEY isn’t present, generate once (idempotent)
if ! grep -q "^APP_KEY=" .env || [ -z "$(grep '^APP_KEY=' .env | cut -d= -f2-)" ]; then
  KEY=$(php artisan key:generate --show || true)
  if [ -n "${KEY:-}" ]; then
    sed -i "1s|^|APP_KEY=$KEY\n|" .env
  fi
fi

# Now cache config with correct paths
php artisan config:cache
php artisan route:cache || true
php artisan view:cache || true

# Run migrations
php artisan migrate --force
