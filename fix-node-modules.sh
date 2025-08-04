#!/bin/bash

echo "🔧 Fixing corrupted node_modules and Next.js installation..."

echo "Step 1: Cleaning build cache..."
rm -rf .next

echo "Step 2: Removing corrupted node_modules..."
rm -rf node_modules

echo "Step 3: Removing package-lock.json..."
rm -rf package-lock.json

echo "Step 4: Clearing npm cache..."
npm cache clean --force

echo "Step 5: Fresh installation of dependencies..."
npm install

echo "Step 6: Starting development server..."
npm run dev

echo "✅ Fix complete! Your Diagrammr app should now be running at http://localhost:3000" 