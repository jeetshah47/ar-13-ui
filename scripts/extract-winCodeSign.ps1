# Script to extract winCodeSign archive
# MUST be run as Administrator to create symbolic links

$cacheDir = "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign"
$zipFile = Join-Path $cacheDir "winCodeSign-2.6.0.7z"

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script."
    exit 1
}

if (-not (Test-Path $zipFile)) {
    Write-Host "ERROR: Archive not found: $zipFile" -ForegroundColor Red
    Write-Host "Run download-winCodeSign.ps1 first to download it."
    exit 1
}

Write-Host "Extracting winCodeSign archive..."
Write-Host "Source: $zipFile"
Write-Host "Destination: $cacheDir"

# Find 7zip
$7zipPath = Join-Path $PSScriptRoot "..\node_modules\7zip-bin\win\x64\7za.exe"
if (-not (Test-Path $7zipPath)) {
    Write-Host "ERROR: 7zip not found at: $7zipPath" -ForegroundColor Red
    exit 1
}

try {
    & $7zipPath x $zipFile "-o$cacheDir" -y
    Write-Host ""
    Write-Host "Extraction completed successfully!" -ForegroundColor Green
    Write-Host "The archive has been extracted to: $cacheDir"
} catch {
    Write-Host "ERROR: Extraction failed: $_" -ForegroundColor Red
    exit 1
}

