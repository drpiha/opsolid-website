#!/usr/bin/env bash
# =============================================================================
# OpSolid — host-side DB bootstrap (idempotent).
#
# Runs the three authoritative SQL files against the opsolid-db container:
#   prisma/init.sql                       — base schema (CREATE TABLE IF NOT EXISTS ...)
#   prisma/patch_001_design_review.sql    — additive status-lifecycle columns
#   prisma/seed.sql                       — 5 card templates (ON CONFLICT DO NOTHING)
#
# Replaces the old `prisma migrate deploy`-at-boot CMD, which crashed with
# `Cannot find module 'effect'` because the Prisma CLI requires transitive
# dev-only deps that standalone builds strip. Pure psql has no such problem.
#
# Safe to re-run. Exit non-zero on any SQL error so the operator notices.
# =============================================================================

set -euo pipefail

CONTAINER="opsolid-db"
DB_USER="opsolid"
DB_NAME="opsolid"
REPO_ROOT="${REPO_ROOT:-/opt/opsolid-website}"

run_sql() {
  local label="$1"
  local file="$2"
  if [ ! -f "$file" ]; then
    echo "  skip $label  ($file missing)"
    return
  fi
  echo "→ applying $label  ($file)"
  docker exec -i "$CONTAINER" psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" < "$file"
}

echo "== OpSolid DB bootstrap =="
echo "  container: $CONTAINER"
echo "  db user:   $DB_USER"
echo "  repo root: $REPO_ROOT"

# Wait for the DB to be ready (pg_isready returns 0 when accepting connections).
for i in 1 2 3 4 5 6 7 8 9 10; do
  if docker exec "$CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
    break
  fi
  echo "  waiting for $CONTAINER to accept connections ($i/10)..."
  sleep 2
done

run_sql "init.sql"                    "$REPO_ROOT/prisma/init.sql"
run_sql "patch_001_design_review.sql" "$REPO_ROOT/prisma/patch_001_design_review.sql"
run_sql "patch_002_voice_agent.sql"   "$REPO_ROOT/prisma/patch_002_voice_agent.sql"
run_sql "patch_008_phase_8.sql"       "$REPO_ROOT/prisma/patch_008_phase_8.sql"
run_sql "patch_009_slug_rename.sql"   "$REPO_ROOT/prisma/patch_009_slug_rename.sql"
run_sql "patch_010_crm_enhanced_fields.sql" "$REPO_ROOT/prisma/patch_010_crm_enhanced_fields.sql"
run_sql "patch_011_add_user_auth.sql"       "$REPO_ROOT/prisma/patch_011_add_user_auth.sql"
run_sql "patch_012_add_retention_indexes.sql" "$REPO_ROOT/prisma/patch_012_add_retention_indexes.sql"
run_sql "patch_013_add_pii_redacted_at.sql" "$REPO_ROOT/prisma/patch_013_add_pii_redacted_at.sql"
run_sql "patch_014_add_user_role.sql"       "$REPO_ROOT/prisma/patch_014_add_user_role.sql"
run_sql "patch_015_voice_agent_llm_model.sql" "$REPO_ROOT/prisma/patch_015_voice_agent_llm_model.sql"
run_sql "patch_015_card_visibility.sql"       "$REPO_ROOT/prisma/patch_015_card_visibility.sql"
run_sql "patch_016_saved_cards.sql"           "$REPO_ROOT/prisma/patch_016_saved_cards.sql"
run_sql "patch_017_card_feedback.sql"         "$REPO_ROOT/prisma/patch_017_card_feedback.sql"
run_sql "patch_018_card_actions.sql"          "$REPO_ROOT/prisma/patch_018_card_actions.sql"
run_sql "patch_019_inbox_v2.sql"              "$REPO_ROOT/prisma/patch_019_inbox_v2.sql"
run_sql "seed.sql"                    "$REPO_ROOT/prisma/seed.sql"

echo "== bootstrap ok =="
