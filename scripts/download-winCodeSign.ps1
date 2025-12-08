# Script to download and extract winCodeSign archive
# This may require running PowerShell as Administrator for symlink creation

$url = "https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.6.0/winCodeSign-2.6.0.7z"
$cacheDir = "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign"
$zipFile = Join-Path $cacheDir "winCodeSign-2.6.0.7z"
$extractDir = Join-Path $cacheDir "winCodeSign-2.6.0"

Write-Host "Creating cache directory..."
New-Item -ItemType Directory -Path $cacheDir -Force | Out-Null

if (Test-Path $zipFile) {
    Write-Host "Archive already exists: $zipFile"
    $fileSize = (Get-Item $zipFile).Length / 1MB
    Write-Host "Size: $([math]::Round($fileSize, 2)) MB"
} else {
    Write-Host "Downloading winCodeSign archive..."
    Write-Host "URL: $url"
    Write-Host "Destination: $zipFile"
    
    try {
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $url -OutFile $zipFile -UseBasicParsing
        Write-Host "Download completed!"
        Write-Host "Size: $([math]::Round((Get-Item $zipFile).Length / 1MB, 2)) MB"
    } catch {
        Write-Host "Download failed: $_"
        exit 1
    }
}

Write-Host ""
Write-Host "Archive location: $zipFile"
Write-Host ""
Write-Host "Note: Extracting this archive requires administrator privileges"
Write-Host "because it contains symbolic links for macOS files."
Write-Host ""
Write-Host "To extract, you can run 7zip with admin privileges."
Write-Host ""
Write-Host "However, the best solution is to prevent electron-builder"
Write-Host "from downloading this by disabling code signing completely."
