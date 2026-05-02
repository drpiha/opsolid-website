-- patch_013_add_pii_redacted_at.sql
-- Faz A8.3 (retention) — idempotency sentinel for the PII anonymization cron.
--
-- Adds pii_redacted_at (TIMESTAMPTZ, nullable) to the four tables touched by
-- the 13-month retention cron. NULL means "not yet anonymized"; the cron sets
-- this to NOW() after overwriting PII fields so subsequent runs skip the row.
--
-- GDPR Art.5(e) + KVKK md.7.
-- Prisma migration: 20260502120200_add_pii_redacted_at

ALTER TABLE "card_leads"       ADD COLUMN IF NOT EXISTS "pii_redacted_at" TIMESTAMPTZ;
ALTER TABLE "card_views"       ADD COLUMN IF NOT EXISTS "pii_redacted_at" TIMESTAMPTZ;
ALTER TABLE "scan_events"      ADD COLUMN IF NOT EXISTS "pii_redacted_at" TIMESTAMPTZ;
ALTER TABLE "card_connections" ADD COLUMN IF NOT EXISTS "pii_redacted_at" TIMESTAMPTZ;
