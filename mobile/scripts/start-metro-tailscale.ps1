# Starts Metro / Expo dev server bound to the Tailscale IP so the phone
# (also on Tailscale) can reach it. Run this from the `mobile/` folder:
#
#   powershell -ExecutionPolicy Bypass -File scripts/start-metro-tailscale.ps1
#
# Phone side: open the OpSolid Dev Client APK, tap "Enter URL manually",
# type the URL printed below.

$TailscaleIP = "100.97.5.74"
$Port = "43093"

# REACT_NATIVE_PACKAGER_HOSTNAME tells the dev client which host to dial.
# Without this, Metro advertises localhost (unreachable from the phone).
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $TailscaleIP
$env:RCT_METRO_PORT = $Port

Write-Host ""
Write-Host "Metro starting on http://$TailscaleIP`:$Port" -ForegroundColor Green
Write-Host "On the phone (Dev Client APK): Enter URL manually -> http://$TailscaleIP`:$Port" -ForegroundColor Yellow
Write-Host ""

npx expo start --dev-client --host lan --port $Port
