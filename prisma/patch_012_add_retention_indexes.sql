-- =============================================================================
-- Patch 012 — Faz A8.3 (schema): PII retention indexes
--
-- 13-month auto-anonymization cron (GDPR Art.5(e) + KVKK md.7) scans tracking
-- tables for `WHERE created_at < NOW() - INTERVAL '13 months'`. These indexes
-- make those range scans O(log n) instead of full table scans.
--
-- Tables covered (verified to exist):
--   card_leads
--   card_views
--   scan_events
--   card_connections
--
-- NOTE — `connection_events` does not exist in this schema. The Smart Exchange
-- uses `card_connections`; per-event audit lives in `voice_call_events` (a
-- different product). If a separate connection_events table is added later,
-- mirror the (created_at) index then.
--
-- No anonymization columns added here — that is the cron's job in A8.3-code.
--
-- Idempotent: every CREATE INDEX guarded by IF NOT EXISTS.
--
-- Rollback (down):
--   DROP INDEX IF EXISTS "card_leads_created_at_idx";
--   DROP INDEX IF EXISTS "card_views_created_at_idx";
--   DROP INDEX IF EXISTS "scan_events_created_at_idx";
--   DROP INDEX IF EXISTS "card_connections_created_at_idx";
-- =============================================================================

CREATE INDEX IF NOT EXISTS "card_leads_created_at_idx"
  ON "card_leads" ("created_at");

CREATE INDEX IF NOT EXISTS "card_views_created_at_idx"
  ON "card_views" ("created_at");

CREATE INDEX IF NOT EXISTS "scan_events_created_at_idx"
  ON "scan_events" ("created_at");

CREATE INDEX IF NOT EXISTS "card_connections_created_at_idx"
  ON "card_connections" ("created_at");
