-- =============================================================================
-- Patch 004 — Smart Exchange foundation (Phase 4.4)
--
-- Adds card_connections table for the future Smart Exchange flow: visitor
-- with their own published card pressing "Send my card" creates a row both
-- sides can see in their admin.
--
-- Idempotent: every CREATE / ALTER guarded by IF NOT EXISTS.
-- =============================================================================

CREATE TABLE IF NOT EXISTS "card_connections" (
  "id"              TEXT PRIMARY KEY,
  "owner_card_id"   TEXT NOT NULL REFERENCES "card_orders"("id") ON DELETE CASCADE,
  "visitor_card_id" TEXT NOT NULL REFERENCES "card_orders"("id") ON DELETE CASCADE,
  "source"          TEXT,
  "campaign"        TEXT,
  "event_name"      TEXT,
  "note"            TEXT,
  "status"          TEXT NOT NULL DEFAULT 'new',
  "created_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "card_connections_owner_visitor_unique"
    UNIQUE ("owner_card_id", "visitor_card_id")
);

CREATE INDEX IF NOT EXISTS "card_connections_owner_created_at_idx"
  ON "card_connections" ("owner_card_id", "created_at");
