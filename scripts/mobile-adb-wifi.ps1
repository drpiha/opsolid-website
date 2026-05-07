# ADB WiFi Setup + APK Install Helper
# Run this ONCE with phone connected via USB to authorize wireless debugging.
# After that, use: .\scripts\mobile-adb-wifi.ps1 -Connect <phone-ip>

param(
  [switch]$Setup,      # First time: USB connected, sets up WiFi mode
  [string]$Connect,    # Connect to phone IP: -Connect 192.168.0.x
  [switch]$Install,    # Download latest dev-client APK and install
  [switch]$Logs,       # Stream logcat (filtered to OpSolid)
  [switch]$Devices     # List connected devices
)

$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"

if (-not (Test-Path $adb)) {
  Write-Host "ERROR: ADB not found at $adb" -ForegroundColor Red
  exit 1
}

function adb { & $adb @args }

if ($Devices -or (-not $Setup -and -not $Connect -and -not $Install -and -not $Logs)) {
  Write-Host "Connected devices:" -ForegroundColor Cyan
  adb devices -l
  Write-Host ""
  Write-Host "Usage:" -ForegroundColor Yellow
  Write-Host "  .\scripts\mobile-adb-wifi.ps1 -Setup           # USB connected: enable WiFi ADB"
  Write-Host "  .\scripts\mobile-adb-wifi.ps1 -Connect 192.168.0.xxx   # Connect wirelessly"
  Write-Host "  .\scripts\mobile-adb-wifi.ps1 -Install         # Install latest dev-client APK"
  Write-Host "  .\scripts\mobile-adb-wifi.ps1 -Logs            # Stream device logs"
  exit 0
}

if ($Setup) {
  Write-Host "Setting up ADB WiFi (USB must be connected)..." -ForegroundColor Cyan
  $devices = adb devices | Select-String "device$"
  if (-not $devices) {
    Write-Host "ERROR: No USB device found. Connect phone via USB with USB Debugging enabled." -ForegroundColor Red
    Write-Host "To enable: Settings > About phone > tap Build Number 7x > Developer Options > USB Debugging ON" -ForegroundColor Yellow
    exit 1
  }
  Write-Host "Device found: $devices" -ForegroundColor Green
  adb tcpip 5555
  Write-Host ""
  Write-Host "SUCCESS! WiFi ADB mode enabled on port 5555." -ForegroundColor Green
  Write-Host "Now find your phone's IP: Settings > WiFi > tap your network > IP address" -ForegroundColor Yellow
  Write-Host "Then run: .\scripts\mobile-adb-wifi.ps1 -Connect <phone-ip>" -ForegroundColor Yellow
}

if ($Connect) {
  Write-Host "Connecting to $Connect`:5555..." -ForegroundColor Cyan
  adb connect "${Connect}:5555"
  Start-Sleep 1
  $result = adb devices | Select-String $Connect
  if ($result) {
    Write-Host "Connected! You can unplug the USB cable now." -ForegroundColor Green
    adb devices -l
  } else {
    Write-Host "Connection failed. Check phone IP and that both are on same WiFi." -ForegroundColor Red
  }
}

if ($Install) {
  Write-Host "Downloading latest Dev Client APK from GitHub Releases..." -ForegroundColor Cyan
  $release = gh release view android-devclient-3 --repo drpiha/opsolid-website --json assets | ConvertFrom-Json
  $asset = $release.assets[0]
  $apkName = $asset.name
  $tmpApk = "$env:TEMP\$apkName"

  Write-Host "Downloading: $apkName" -ForegroundColor Yellow
  gh release download android-devclient-3 --repo drpiha/opsolid-website --pattern "*.apk" --output $tmpApk --clobber

  if (Test-Path $tmpApk) {
    $size = (Get-Item $tmpApk).Length / 1MB
    Write-Host "Downloaded: $([math]::Round($size, 1)) MB" -ForegroundColor Green

    $devices = adb devices | Select-String "device$"
    if (-not $devices) {
      Write-Host "No ADB device connected. Run -Connect first or connect via USB." -ForegroundColor Red
      exit 1
    }

    Write-Host "Installing APK on device..." -ForegroundColor Cyan
    adb install -r $tmpApk
    Write-Host "Done! Open 'OpSolid' app on your phone." -ForegroundColor Green
  } else {
    Write-Host "Download failed." -ForegroundColor Red
  }
}

if ($Logs) {
  Write-Host "Streaming OpSolid logs (Ctrl+C to stop)..." -ForegroundColor Cyan
  adb logcat -c
  Start-Sleep 1
  adb shell monkey -p de.opsolid.mobile -c android.intent.category.LAUNCHER 1 | Out-Null
  Start-Sleep 2
  adb logcat ReactNativeJS:V ReactNative:V AndroidRuntime:E DEBUG:E libc:F *:S | ForEach-Object {
    if ($_ -match " E |FATAL|SIGABRT|Abort message") { Write-Host $_ -ForegroundColor Red }
    elseif ($_ -match " W ") { Write-Host $_ -ForegroundColor Yellow }
    elseif ($_ -match "ReactNativeJS") { Write-Host $_ -ForegroundColor Cyan }
    else { Write-Host $_ }
  }
}
