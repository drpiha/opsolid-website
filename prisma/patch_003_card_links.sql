-- =============================================================================
-- Patch 003 — Smart Card short-link gateway (Phase 3)
--
-- Adds two tables:
--   • card_links  — labelled short links per card (qr-main, nfc-card, …)
--   • scan_events — click events on /l/<code> with source/device/ip-hash
--
-- Idempotent: every CREATE / ALTER uses IF NOT EXISTS so re-running the
-- patch on a partially-migrated DB is safe.
-- =============================================================================

CREATE TABLE IF NOT EXISTS "card_links" (
  "id"              TEXT PRIMARY KEY,
  "order_id"        TEXT NOT NULL REFERENCES "card_orders"("id") ON DELETE CASCADE,
  "code"            TEXT NOT NULL UNIQUE,
  "label"           TEXT,
  "source"          TEXT,
  "campaign"        TEXT,
  "medium"          TEXT,
  "event_name"      TEXT,
  "destination_url" TEXT,
  "active"          BOOLEAN NOT NULL DEFAULT true,
  "created_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "card_links_order_id_idx" ON "card_links" ("order_id");

CREATE TABLE IF NOT EXISTS "scan_events" (
  "id"          TEXT PRIMARY KEY,
  "order_id"    TEXT NOT NULL REFERENCES "card_orders"("id") ON DELETE CASCADE,
  "link_id"     TEXT REFERENCES "card_links"("id") ON DELETE SET NULL,
  "source"      TEXT,
  "campaign"    TEXT,
  "event_name"  TEXT,
  "referer"     TEXT,
  "user_agent"  TEXT,
  "device_type" TEXT,
  "ip_hash"     TEXT,
  "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "scan_events_order_id_created_at_idx"
  ON "scan_events" ("order_id", "created_at");
CREATE INDEX IF NOT EXISTS "scan_events_link_id_created_at_idx"
  ON "scan_events" ("link_id", "created_at");
