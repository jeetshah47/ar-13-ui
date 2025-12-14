# PowerShell script to clean dist folder
$ErrorActionPreference = "Continue"
$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot "dist"

if (Test-Path $distPath) {
    Write-Host "Cleaning dist folder..." -ForegroundColor Yellow
    
    $maxRetries = 3
    $retryCount = 0
    $success = $false
    
    while ($retryCount -lt $maxRetries -and -not $success) {
        try {
            Remove-Item -Path $distPath -Recurse -Force -ErrorAction Stop
            Write-Host "Cleaned dist folder successfully" -ForegroundColor Green
            $success = $true
        }
        catch {
            $retryCount++
            if ($retryCount -lt $maxRetries) {
                Write-Host "Attempt $retryCount failed, retrying in 1 second..." -ForegroundColor Yellow
                Start-Sleep -Seconds 1
            }
            else {
                Write-Host "Failed to clean dist folder after $maxRetries attempts" -ForegroundColor Red
                Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
                Write-Host "Please close any processes using files in the dist folder" -ForegroundColor Yellow
                exit 1
            }
        }
    }
}
else {
    Write-Host "Dist folder does not exist, skipping clean" -ForegroundColor Green
}
