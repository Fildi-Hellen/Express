#!/bin/bash

echo "Testing Angular compilation fixes..."

# Navigate to project directory
cd "C:/Users/fab/Documents/Express/Expressud"

# Run a quick syntax check with ng build --configuration development --dry-run
echo "Running Angular build check..."

# If this is Windows, we'll need to use the proper path
ng build --configuration development 2>&1 | head -50
