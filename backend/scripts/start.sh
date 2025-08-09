#!/bin/bash

cd /var/www/expressud || exit

php artisan serve --host=0.0.0.0 --port=80 &
