#!/bin/bash

# Express Ride Implementation Setup Script

echo "🚗 Setting up Express Ride Implementation..."

# Navigate to backend directory
cd backend

echo "📦 Installing/Updating backend dependencies..."
composer install

echo "🗄️ Running database migrations..."
php artisan migrate

echo "🔑 Generating application key (if needed)..."
php artisan key:generate --ansi

echo "💾 Seeding database (optional)..."
# php artisan db:seed

echo "🌐 Setting up frontend dependencies..."

# Setup Customer App (Expressud)
echo "📱 Setting up Customer App..."
cd ../Expressud
npm install

# Setup Driver App
echo "🚗 Setting up Driver App..."
cd ../driver
npm install

# Setup Admin Panel
echo "🖥️ Setting up Admin Panel..."
cd ../admin-panel
npm install

echo "✅ Setup complete!"
echo ""
echo "🚀 To run the application:"
echo "1. Backend API: cd backend && php artisan serve"
echo "2. Customer App: cd Expressud && npm start"
echo "3. Driver App: cd driver && ng serve --port 4202"
echo "4. Admin Panel: cd admin-panel && ng serve --port 4201"
echo ""
echo "🌐 Access Points:"
echo "- Backend API: http://localhost:8000"
echo "- Customer App: http://localhost:4200"
echo "- Driver App: http://localhost:4202"
echo "- Admin Panel: http://localhost:4201"
