#!/bin/bash
set -euo pipefail

# If PHP is already >= 8.2, skip
if command -v php >/dev/null 2>&1; then
  CURRENT="$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
  if dpkg --compare-versions "$CURRENT" ge "8.2"; then
    echo "PHP $CURRENT already installed. Skipping."
    exit 0
  fi
fi

# Enable PPA and install PHP 8.2 + extensions
sudo apt-get update -o Acquire::ForceIPv4=true
sudo apt-get install -y software-properties-common -o Acquire::ForceIPv4=true
sudo add-apt-repository ppa:ondrej/php -y
sudo apt-get update -o Acquire::ForceIPv4=true

sudo apt-get install -y \
  php8.2 php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd \
  php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath php8.2-intl \
  -o Acquire::ForceIPv4=true

sudo update-alternatives --set php /usr/bin/php8.2
php -v
