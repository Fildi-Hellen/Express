#!/bin/bash

cd /var/www/expressud || exit

# Create .env file securely from SSM Parameter Store
echo "APP_NAME=Expressud" > .env
echo "APP_ENV=$(aws ssm get-parameter --name /expressud/APP_ENV --with-decryption --query 'Parameter.Value' --output text)" >> .env
# echo "APP_KEY=$(aws ssm get-parameter --name /expressud/APP_KEY --with-decryption --query 'Parameter.Value' --output text)" >> .env
echo "APP_DEBUG=$(aws ssm get-parameter --name /expressud/APP_DEBUG --with-decryption --query 'Parameter.Value' --output text)" >> .env
echo "APP_URL=$(aws ssm get-parameter --name /expressud/APP_URL --with-decryption --query 'Parameter.Value' --output text)" >> .env

echo "LOG_CHANNEL=stack" >> .env

echo "DB_CONNECTION=mysql" >> .env
echo "DB_HOST=$(aws ssm get-parameter --name /expressud/DB_HOST --with-decryption --query 'Parameter.Value' --output text)" >> .env
echo "DB_PORT=3306" >> .env
echo "DB_DATABASE=expressud-db" >> .env
echo "DB_USERNAME=$(aws ssm get-parameter --name /expressud/DB_USERNAME --with-decryption --query 'Parameter.Value' --output text)" >> .env
echo "DB_PASSWORD=$(aws ssm get-parameter --name /expressud/DB_PASSWORD --with-decryption --query 'Parameter.Value' --output text)" >> .env

# Laravel setup
php artisan config:clear
php artisan config:cache
php artisan migrate --force

