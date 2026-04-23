#!/usr/bin/env bash
# =============================================================================
# OpSolid — Postgres backup runner (host-side cron, NOT inside Docker).
#
# Streams a gzipped pg_dump out of the opsolid-db container to
# /var/backups/opsolid, then prunes files older than 14 days.
#
# Fails non-zero on pg_dump error so the operator notices via mail/cron log.
# Keeps /var/backups/opsolid chmod 700 (only root should read dumps — they
# contain customer PII and Stripe IDs).
# =============================================================================

set -euo pipefail

BACKUP_DIR="/var/backups/opsolid"
CONTAINER="opsolid-db"
DB_USER="opsolid"
DB_NAME="opsolid"
RETENTION_DAYS=14

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

STAMP=$(date +%Y%m%d-%H%M)
OUT="$BACKUP_DIR/opsolid-${STAMP}.sql.gz"

echo "[$(ts)] backup start → $OUT"

# pg_dump streams to stdout; gzip writes the final file. pipefail catches a
# pg_dump failure even when gzip succeeds on an empty/partial stream.
if ! docker exec "$CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$OUT"; then
  echo "[$(ts)] ERROR: pg_dump failed — removing partial file $OUT" >&2
  rm -f "$OUT"
  exit 1
fi

# Refuse to keep a suspiciously tiny dump (likely an auth error gzip'd).
MIN_SIZE=1024
ACTUAL_SIZE=$(stat -c%s "$OUT" 2>/dev/null || echo 0)
if [ "$ACTUAL_SIZE" -lt "$MIN_SIZE" ]; then
  echo "[$(ts)] ERROR: dump too small ($ACTUAL_SIZE bytes) — removing $OUT" >&2
  rm -f "$OUT"
  exit 1
fi

echo "[$(ts)] backup ok  $OUT ($ACTUAL_SIZE bytes)"

# Prune old dumps (inline so a single daily cron entry is enough).
find "$BACKUP_DIR" -name 'opsolid-*.sql.gz' -mtime +${RETENTION_DAYS} -print -delete

echo "[$(ts)] backup done (retention ${RETENTION_DAYS}d)"
