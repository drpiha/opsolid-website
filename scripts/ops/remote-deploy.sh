#!/usr/bin/env bash
# Runs ON the VPS as root (streamed over SSH by .github/workflows/deploy-production.yml).
# Loads the hosted-built image, prepares a private packet from the current live
# packet, dry-runs it, then runs the existing opsolid-app-cutover.py --execute,
# which health-checks the app and rolls back automatically on failure.
# Prints only the cutover script's own JSON result; never prints environment.
set -euo pipefail
umask 077
COMMIT="${1:-}"
[[ "$COMMIT" =~ ^[a-f0-9]{40}$ ]] || { echo "bad commit" >&2; exit 2; }
[ "$(id -u)" = 0 ] || { echo "root required (use root or passwordless sudo)" >&2; exit 2; }

INCOMING="$(getent passwd "${SUDO_USER:-root}" | cut -d: -f6)/opsolid-deploy-incoming/$COMMIT"
BASE=/var/backups/opsolid
POINTER="$BASE/app-cutover-current.json"
[ -f "$POINTER" ] || { echo "missing $POINTER (one-time bootstrap, see docs/ops/github-deploy.md)" >&2; exit 2; }

cd "$INCOMING"
sha256sum --check --strict SHA256SUMS
gzip -t image.tar.gz

# Reviewed script set for exactly this commit, root-owned.
OPS=$(mktemp -d /root/opsolid-ops.XXXXXX)
trap 'rm -rf "$OPS"' EXIT
cp ops/opsolid-*.py "$OPS/"
chmod 700 "$OPS"; chmod 600 "$OPS"/*.py

read -r IMAGE_ID < <(python3 -I - metadata.json "$COMMIT" <<'PY'
import json, re, sys
m = json.load(open(sys.argv[1]))
assert m["source"]["commit"] == sys.argv[2], "metadata_commit_mismatch"
assert re.fullmatch(r"sha256:[a-f0-9]{64}", m["image"]["id"]), "image_id_invalid"
print(m["image"]["id"])
PY
)

gunzip -c image.tar.gz | docker load >/dev/null
docker image inspect "$IMAGE_ID" --format '{{ index .Config.Labels "org.opencontainers.image.revision" }}' | grep -qx "$COMMIT"

read -r EXPECTED STATE MANIFEST < <(python3 -I - "$POINTER" <<'PY'
import json, sys
p = json.load(open(sys.argv[1]))
print(p["expected"], p["state"], p["manifest_sha256"])
PY
)

PREP=$(python3 -I "$OPS/opsolid-app-cutover.py" --mode prepare-existing --expected "$EXPECTED" \
  --candidate-image "$IMAGE_ID" --commit "$COMMIT" --current-state "$STATE" --current-manifest-sha256 "$MANIFEST")
NEW_STATE=$(printf '%s' "$PREP" | python3 -I -c 'import json,sys;print(json.load(sys.stdin)["state"])')
echo "prepared: $PREP"

# Dry run (no --execute), then apply with health check + automatic rollback.
python3 -I "$OPS/opsolid-app-cutover.py" --mode apply --state "$NEW_STATE"
if ! python3 -I "$OPS/opsolid-app-cutover.py" --mode apply --state "$NEW_STATE" --execute; then
  echo "DEPLOY FAILED: health check or cutover failed (see result above; rollback attempted by script)" >&2
  exit 1
fi

# Success: the new packet becomes the live baseline for the next deploy.
NEW_MANIFEST=$(sha256sum "$NEW_STATE/manifest.json" | cut -d' ' -f1)
python3 -I - "$POINTER" "$EXPECTED" "$NEW_STATE" "$NEW_MANIFEST" <<'PY'
import json, os, sys
path, expected, state, digest = sys.argv[1:]
tmp = path + ".tmp"
with open(tmp, "w", opener=lambda p, f: os.open(p, f, 0o600)) as fh:
    json.dump({"expected": expected, "state": state, "manifest_sha256": digest}, fh)
os.replace(tmp, path)
PY
rm -rf "$INCOMING"
echo "deploy ok: $COMMIT"
