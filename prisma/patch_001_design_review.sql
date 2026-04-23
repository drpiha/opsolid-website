-- =============================================================================
-- Patch 001 — Design-review lifecycle + self-service
-- Additive + idempotent. Apply with:
--   docker exec -i opsolid-db psql -U opsolid -d opsolid < prisma/patch_001_design_review.sql
-- Safe to re-run.
-- =============================================================================

ALTER TABLE "card_orders" ADD COLUMN IF NOT EXISTS "design_notes"         TEXT;
ALTER TABLE "card_orders" ADD COLUMN IF NOT EXISTS "edit_token"           TEXT;
ALTER TABLE "card_orders" ADD COLUMN IF NOT EXISTS "paid_at"              TIMESTAMP(3);
ALTER TABLE "card_orders" ADD COLUMN IF NOT EXISTS "awaiting_design_at"   TIMESTAMP(3);
ALTER TABLE "card_orders" ADD COLUMN IF NOT EXISTS "published_at"         TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "card_orders_edit_token_key" ON "card_orders" ("edit_token");

-- Backfill paid_at / published_at for orders that were already paid/published
-- under the old flow, so reports and status history look sensible.
UPDATE "card_orders"
SET    "paid_at" = COALESCE("paid_at", "updated_at")
WHERE  "status" IN ('PAID', 'AWAITING_DESIGN', 'PUBLISHED', 'CANCELLED', 'REFUNDED')
       AND "paid_at" IS NULL
       AND "stripe_session_id" IS NOT NULL;

UPDATE "card_orders"
SET    "published_at" = COALESCE("published_at", "updated_at")
WHERE  "status" = 'PUBLISHED'
       AND "published_at" IS NULL;
