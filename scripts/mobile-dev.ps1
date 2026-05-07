# Mobile Dev Server Starter
# Sets correct LAN IP for Metro so the Dev Client APK can find it.
# Usage: .\scripts\mobile-dev.ps1

$lanIp = (Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.InterfaceAlias -match "Wi-Fi|WLAN|Ethernet" -and $_.IPAddress -notmatch "^169" } |
  Sort-Object PrefixLength -Descending |
  Select-Object -First 1).IPAddress

if (-not $lanIp) {
  Write-Host "WARNING: Could not auto-detect LAN IP. Falling back to 192.168.0.187" -ForegroundColor Yellow
  $lanIp = "192.168.0.187"
}

Write-Host "Metro server will bind to: $lanIp" -ForegroundColor Green
Write-Host "Make sure phone is on the same WiFi network." -ForegroundColor Cyan
Write-Host ""

$env:REACT_NATIVE_PACKAGER_HOSTNAME = $lanIp
$env:EXPO_PUBLIC_API_BASE = "https://opsolid.de"

Set-Location "$PSScriptRoot\..\mobile"

npm install --legacy-peer-deps --silent 2>$null

Write-Host "Starting Expo Dev Client..." -ForegroundColor Cyan
npx expo start --dev-client --host=lan --port=8081
