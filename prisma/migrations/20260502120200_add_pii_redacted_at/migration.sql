-- Faz A8.3 (retention) — add pii_redacted_at column to all four PII tracking
-- tables. NULL = not yet anonymized. Set to NOW() by the retention cron once
-- the row's PII fields have been overwritten. Acts as an idempotency sentinel:
-- the cron only processes rows WHERE pii_redacted_at IS NULL.
--
-- GDPR Art.5(e) + KVKK md.7 — 13-month retention horizon.
-- Companion patch: prisma/patch_013_add_pii_redacted_at.sql

ALTER TABLE "card_leads"       ADD COLUMN "pii_redacted_at" TIMESTAMPTZ;
ALTER TABLE "card_views"       ADD COLUMN "pii_redacted_at" TIMESTAMPTZ;
ALTER TABLE "scan_events"      ADD COLUMN "pii_redacted_at" TIMESTAMPTZ;
ALTER TABLE "card_connections" ADD COLUMN "pii_redacted_at" TIMESTAMPTZ;
