#!/bin/bash
# CVer Packaging Automation Script

# Exit immediately if a command exits with a non-zero status
set -e

echo "========================================="
echo "Building and Packaging CVer Installer..."
echo "========================================="

# 1. Clean previous build folders
rm -rf dist dist-electron

# 1.5 Auto-install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing dependencies first..."
  npm install
fi

# 2. Build production assets
npm run build

# 3. Package installers
if [ "$1" == "--win" ]; then
  echo "Packaging for Windows (target: nsis)..."
  npx electron-builder --win
else
  echo "Packaging for Linux (targets: AppImage, deb, rpm)..."
  npx electron-builder --linux
fi

echo "========================================="
echo "Packaging Completed! Files are in dist-electron/"
echo "========================================="
