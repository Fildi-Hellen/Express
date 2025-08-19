#!/bin/bash
set -euo pipefail

# Use instance region if exported by the environment; fallback to your region
REGION="${AWS_DEFAULT_REGION:-af-south-1}"
APP_DIR="/var/www/expressud"

cd "$APP_DIR"

# Ensure AWS CLI exists
if ! command -v aws >/dev/null 2>&1; then
  sudo apt-get update -o Acquire::ForceIPv4=true
  sudo apt-get install -y awscli -o Acquire::ForceIPv4=true
fi

# Helpers
getp() {
  aws ssm get-parameter \
    --name "$1" \
    --with-decryption \
    --query 'Parameter.Value' \
    --output text \
    --region "$REGION"
}
# Optional (returns empty if not found)
getp_opt() {
  set +e
  val=$(aws ssm get-parameter --name "$1" --with-decryption --query 'Parameter.Value' --output text --region "$REGION" 2>/dev/null || true)
  set -e
  echo "$val"
}

# Fetch required params
APP_ENV="$(getp /expressud/APP_ENV)"
APP_DEBUG="$(getp /expressud/APP_DEBUG)"
APP_URL="$(getp /expressud/APP_URL)"
APP_KEY="$(getp /expressud/APP_KEY)"

DB_HOST="$(getp /expressud/DB_HOST)"
DB_NAME="$(getp /expressud/DB_NAME)"
DB_USERNAME="$(getp /expressud/DB_USERNAME)"
DB_PASSWORD="$(getp /expressud/DB_PASSWORD)"

# Basic validation
[ -n "$DB_HOST" ] || { echo "ERROR: /expressud/DB_HOST is empty"; exit 1; }
[ -n "$DB_NAME" ] || { echo "ERROR: /expressud/DB_NAME is empty"; exit 1; }
[ -n "$DB_USERNAME" ] || { echo "ERROR: /expressud/DB_USERNAME is empty"; exit 1; }
[ -n "$DB_PASSWORD" ] || { echo "ERROR: /expressud/DB_PASSWORD is empty"; exit 1; }
[ -n "$APP_KEY" ] || { echo "ERROR: /expressud/APP_KEY is empty (generate and store your APP_KEY)"; exit 1; }

# Optional params
MAIL_MAILER="$(getp_opt /expressud/MAIL_MAILER)"
MAIL_HOST="$(getp_opt /expressud/MAIL_HOST)"
MAIL_PORT="$(getp_opt /expressud/MAIL_PORT)"
MAIL_USERNAME="$(getp_opt /expressud/MAIL_USERNAME)"
MAIL_PASSWORD="$(getp_opt /expressud/MAIL_PASSWORD)"
MAIL_ENCRYPTION="$(getp_opt /expressud/MAIL_ENCRYPTION)"
MAIL_FROM_ADDRESS="$(getp_opt /expressud/MAIL_FROM_ADDRESS)"
MAIL_FROM_NAME="$(getp_opt /expressud/MAIL_FROM_NAME)"

PUSHER_APP_ID="$(getp_opt /expressud/PUSHER_APP_ID)"
PUSHER_APP_KEY="$(getp_opt /expressud/PUSHER_APP_KEY)"
PUSHER_APP_SECRET="$(getp_opt /expressud/PUSHER_APP_SECRET)"
PUSHER_APP_CLUSTER="$(getp_opt /expressud/PUSHER_APP_CLUSTER)"

FLW_SECRET_KEY="$(getp_opt /expressud/FLW_SECRET_KEY)"
FLW_SECRET_HASH="$(getp_opt /expressud/FLW_SECRET_HASH)"

# Ensure writable dirs
sudo chown -R ubuntu:www-data "$APP_DIR"
sudo chmod -R 775 "$APP_DIR"
mkdir -p storage/logs bootstrap/cache
chmod -R ug+rw storage bootstrap/cache

# Build .env atomically
TMP_ENV="$(mktemp)"
{
  echo "APP_NAME=Expressud"
  echo "APP_ENV=${APP_ENV}"
  echo "APP_KEY=${APP_KEY}"
  echo "APP_DEBUG=${APP_DEBUG}"
  echo "APP_URL=${APP_URL}"
  echo "LOG_CHANNEL=stack"

  echo "DB_CONNECTION=mysql"
  echo "DB_HOST=${DB_HOST}"
  echo "DB_PORT=3306"
  echo "DB_DATABASE=${DB_NAME}"
  # wrap secrets that may include special chars
  echo "DB_USERNAME=${DB_USERNAME}"
  echo "DB_PASSWORD=\"${DB_PASSWORD}\""

  echo "SESSION_DRIVER=database"
  echo "QUEUE_CONNECTION=database"
  echo "FILESYSTEM_DISK=local"
  echo "CACHE_STORE=database"

  # Mail (optional)
  [ -n "$MAIL_MAILER" ] && echo "MAIL_MAILER=${MAIL_MAILER}"
  [ -n "$MAIL_HOST" ] && echo "MAIL_HOST=${MAIL_HOST}"
  [ -n "$MAIL_PORT" ] && echo "MAIL_PORT=${MAIL_PORT}"
  [ -n "$MAIL_USERNAME" ] && echo "MAIL_USERNAME=\"${MAIL_USERNAME}\""
  [ -n "$MAIL_PASSWORD" ] && echo "MAIL_PASSWORD=\"${MAIL_PASSWORD}\""
  [ -n "$MAIL_ENCRYPTION" ] && echo "MAIL_ENCRYPTION=${MAIL_ENCRYPTION}"
  [ -n "$MAIL_FROM_ADDRESS" ] && echo "MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}"
  [ -n "$MAIL_FROM_NAME" ] && echo "MAIL_FROM_NAME=\"${MAIL_FROM_NAME}\""

  # Pusher (optional)
  [ -n "$PUSHER_APP_ID" ] && echo "PUSHER_APP_ID=${PUSHER_APP_ID}"
  [ -n "$PUSHER_APP_KEY" ] && echo "PUSHER_APP_KEY=${PUSHER_APP_KEY}"
  [ -n "$PUSHER_APP_SECRET" ] && echo "PUSHER_APP_SECRET=${PUSHER_APP_SECRET}"
  [ -n "$PUSHER_APP_CLUSTER" ] && echo "PUSHER_APP_CLUSTER=${PUSHER_APP_CLUSTER}"

  # Flutterwave (optional)
  [ -n "$FLW_SECRET_KEY" ] && echo "FLW_SECRET_KEY=\"${FLW_SECRET_KEY}\""
  [ -n "$FLW_SECRET_HASH" ] && echo "FLW_SECRET_HASH=\"${FLW_SECRET_HASH}\""
} > "$TMP_ENV"

# Move into place and secure
mv "$TMP_ENV" .env
chown ubuntu:www-data .env
chmod 640 .env

# Composer (install if missing)
if ! command -v composer >/dev/null 2>&1; then
  cd ~
  php -r "copy('https://getcomposer.org/installer','composer-setup.php');"
  php composer-setup.php
  sudo mv composer.phar /usr/local/bin/composer
  rm composer-setup.php
  cd - >/dev/null
fi

# Install dependencies and cache configs
composer install --no-interaction --prefer-dist --optimize-autoloader

php artisan config:clear
php artisan route:clear || true
php artisan view:clear || true

php artisan config:cache
php artisan route:cache || true
php artisan view:cache || true

# Run migrations (will use the RDS host/creds from .env)
php artisan migrate --force
