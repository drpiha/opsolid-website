-- Faz A8.3 (schema) — PII retention indexes for the 13-month auto-anonymization
-- cron (GDPR Art.5(e) + KVKK md.7). See prisma/patch_012_add_retention_indexes.sql
-- for the human-readable copy. This file is for `prisma migrate deploy`.

CREATE INDEX "card_leads_created_at_idx"       ON "card_leads"("created_at");
CREATE INDEX "card_views_created_at_idx"       ON "card_views"("created_at");
CREATE INDEX "scan_events_created_at_idx"      ON "scan_events"("created_at");
CREATE INDEX "card_connections_created_at_idx" ON "card_connections"("created_at");
