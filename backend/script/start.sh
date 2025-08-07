#!/bin/bash
cd /var/www/backend
php artisan serve --host=0.0.0.0 --port=80 &
