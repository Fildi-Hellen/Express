#!/bin/bash
cd /var/www/backend
php artisan config:clear
php artisan config:cache
php artisan migrate --force
