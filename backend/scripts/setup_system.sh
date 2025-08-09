#!/bin/bash
set -euo pipefail

# Make sure we can reach APT over IPv4 (avoids IPv6 noise)
sudo apt-get update -o Acquire::ForceIPv4=true

# AWS CLI is required for SSM parameter fetches
if ! command -v aws >/dev/null 2>&1; then
  sudo apt-get install -y awscli -o Acquire::ForceIPv4=true
fi

# Ensure PHP 8.2 is present (if you didn't bake it yet)
if command -v php >/dev/null 2>&1; then
  CUR="$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
else
  CUR="0.0"
fi
if ! dpkg --compare-versions "$CUR" ge "8.2"; then
  sudo apt-get install -y software-properties-common -o Acquire::ForceIPv4=true
  sudo add-apt-repository ppa:ondrej/php -y
  sudo apt-get update -o Acquire::ForceIPv4=true
  sudo apt-get install -y \
    php8.2 php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd \
    php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath php8.2-intl \
    -o Acquire::ForceIPv4=true
  sudo update-alternatives --set php /usr/bin/php8.2
fi

# Prepare app directory and permissions
sudo mkdir -p /var/www/expressud
sudo chown -R ubuntu:www-data /var/www/expressud
sudo chmod -R 775 /var/www/expressud
sudo mkdir -p /var/www/expressud/storage /var/www/expressud/bootstrap/cache
sudo chown -R ubuntu:www-data /var/www/expressud/storage /var/www/expressud/bootstrap/cache
sudo chmod -R ug+rw /var/www/expressud/storage /var/www/expressud/bootstrap/cache
