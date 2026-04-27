#!/usr/bin/env bash
# Manual deploy fallback — same pipeline as .github/workflows/deploy.yml
# Use when GitHub Actions is unavailable or for a fast hot-patch.
#
# Source of truth is still GitHub. Push your work first; this script only
# ships your local working tree to the VPS.
#
# Usage:
#   bash scripts/deploy.sh

set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519_opsolid}"
SSH_HOST="${SSH_HOST:-srv1150632.hstgr.cloud}"
SSH_USER="${SSH_USER:-root}"
DEPLOY_DIR=/opt/opsolid-website
TARBALL=/tmp/opsolid-deploy.tar.gz

if [ ! -f "$SSH_KEY" ]; then
  echo "ERROR: SSH key not found at $SSH_KEY" >&2
  echo "Set SSH_KEY env var to override." >&2
  exit 1
fi

cd "$(dirname "$0")/.."
echo "==> Working directory: $(pwd)"

if [ -n "$(git status --porcelain 2>/dev/null || true)" ]; then
  echo "WARNING: You have uncommitted changes. They will be deployed but"
  echo "         GitHub will be out of sync. Push first to keep main as truth."
  read -r -p "Continue anyway? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
fi

echo "==> Building tarball"
tar -czf "$TARBALL" \
  --exclude='./.env' \
  --exclude='./.env.local' \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./.git' \
  --exclude='./.github' \
  --exclude='./.design-bundle' \
  --exclude='./_kutasia_tmp' \
  --exclude='./tsconfig.tsbuildinfo' \
  .
ls -lh "$TARBALL"

echo "==> Uploading to $SSH_USER@$SSH_HOST"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$TARBALL" "$SSH_USER@$SSH_HOST:$TARBALL"

echo "==> Extracting and rebuilding on VPS"
ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" bash -se <<EOF
set -euo pipefail
cd "$DEPLOY_DIR"
tar -xzf "$TARBALL"
docker compose up -d --build opsolid
rm -f "$TARBALL"
docker ps --filter "name=opsolid-app" --format "table {{.Names}}\t{{.Status}}"
EOF

echo "==> Waiting 35s for container to reach healthy state"
sleep 35
ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" \
  'status=$(docker inspect opsolid-app --format "{{.State.Health.Status}}" 2>/dev/null); echo "Container health: $status"; [ "$status" = "healthy" ]' \
  && echo "==> Deploy OK" \
  || { echo "==> Health check failed"; ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" 'docker logs --tail 80 opsolid-app'; exit 1; }

rm -f "$TARBALL"
