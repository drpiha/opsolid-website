#!/usr/bin/env bash
# =============================================================================
# anonymize-pii-cron.sh — VPS cron entry point for PII retention.
#
# Runs the anonymization script non-interactively, logs output to syslog,
# and exits non-zero on failure so the cron daemon can alert on errors.
#
# Install in root/operator crontab:
#   0 3 * * 0 /opt/opsolid-website/scripts/anonymize-pii-cron.sh
#   (weekly, Sunday 03:00 UTC — low-traffic window)
#
# Required environment:
#   DATABASE_URL — set in /etc/opsolid.env or sourced below
#
# GDPR Art.5(e) + KVKK md.7 — 13-month retention window.
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_TAG="opsolid-retention"

# Load environment variables if the env file exists on the VPS.
ENV_FILE="/etc/opsolid.env"
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck source=/dev/null
  source "$ENV_FILE"
fi

log() {
  logger -t "$LOG_TAG" "$*"
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"
}

log "PII retention cron starting (project=$PROJECT_DIR)"

cd "$PROJECT_DIR"

# Run with --apply to perform live anonymization.
# Remove --apply and add --dry-run to test without writing.
npx tsx scripts/anonymize-pii.ts --apply 2>&1 | while IFS= read -r line; do
  log "$line"
done

EXIT_CODE="${PIPESTATUS[0]}"

if [[ "$EXIT_CODE" -ne 0 ]]; then
  log "ERROR: anonymize-pii exited with code $EXIT_CODE"
  exit "$EXIT_CODE"
fi

log "PII retention cron completed successfully"
