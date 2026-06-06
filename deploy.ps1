# OpSolid VPS Deploy Script
# Calistir: .\deploy.ps1
# Gereksinimler: ~/.ssh/id_ed25519_opsolid mevcut olmali

$ErrorActionPreference = "Stop"

$SSH_KEY  = "$env:USERPROFILE\.ssh\id_ed25519_opsolid"
$VPS_HOST = "srv1150632.hstgr.cloud"
$VPS_USER = "root"
$TARBALL  = "$env:TEMP\opsolid-deploy.tar.gz"

Write-Host "`n[1/4] Tarball olusturuluyor..." -ForegroundColor Cyan

tar -czf $TARBALL `
  --exclude="./.env" `
  --exclude="./.env.local" `
  --exclude="./node_modules" `
  --exclude="./.next" `
  --exclude="./.git" `
  --exclude="./.github" `
  --exclude="./.design-bundle" `
  --exclude="./_kutasia_tmp" `
  --exclude="./tsconfig.tsbuildinfo" `
  .

$sizeMB = [math]::Round((Get-Item $TARBALL).Length / 1MB, 1)
Write-Host "   Tarball: $sizeMB MB" -ForegroundColor Gray

Write-Host "[2/4] VPS'e yukleniyor..." -ForegroundColor Cyan
scp -i $SSH_KEY -o StrictHostKeyChecking=accept-new $TARBALL "${VPS_USER}@${VPS_HOST}:/tmp/opsolid-deploy.tar.gz"

Write-Host "[3/4] VPS'te aciliyor ve container yeniden build ediliyor..." -ForegroundColor Cyan
ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new "${VPS_USER}@${VPS_HOST}" @'
set -euo pipefail
cd /opt/opsolid-website
tar -xzf /tmp/opsolid-deploy.tar.gz
docker compose up -d --build opsolid
rm -f /tmp/opsolid-deploy.tar.gz
docker ps --filter "name=opsolid-app" --format "{{.Names}}: {{.Status}}" || true
'@

Write-Host "[4/4] Health check..." -ForegroundColor Cyan
Start-Sleep -Seconds 20

$ok = $false
for ($i = 1; $i -le 8; $i++) {
    try {
        $r = Invoke-RestMethod "https://opsolid.de/api/health" -TimeoutSec 15
        if ($r.ok -eq $true) {
            Write-Host "`n Deploy basarili! DB: $($r.dbOk)" -ForegroundColor Green
            $ok = $true
            break
        }
    } catch { }
    Write-Host "   Deneme $i/8 - bekleniyor..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
}

if (-not $ok) {
    Write-Host "`n Health check basarisiz - container loglarini kontrol et:" -ForegroundColor Red
    ssh -i $SSH_KEY "${VPS_USER}@${VPS_HOST}" "docker logs --tail 50 opsolid-app"
}

Remove-Item $TARBALL -ErrorAction SilentlyContinue
