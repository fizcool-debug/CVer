@echo off
echo =========================================
echo Building and Packaging CVer Installer...
echo =========================================

:: 1. Clean previous build folders
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron

:: 1.5 Auto-install dependencies if node_modules is missing
if not exist node_modules (
    echo node_modules folder not found. Installing dependencies first...
    call npm install
)

:: 2. Build production assets
call npm run build

:: 3. Package installers
if "%1"=="--win" (
    echo Packaging for Windows (target: nsis)...
    npx electron-builder --win
) else (
    echo Packaging for Linux (targets: AppImage, deb, rpm)...
    npx electron-builder --linux
)

echo =========================================
echo Packaging Completed! Files are in dist-electron/
echo =========================================
