-- =============================================================================
-- Patch 008 — Phase 8: Customer-Chosen Slug
--
-- Adds the optional `desired_slug` column on card_orders so the order form can
-- capture a customer-chosen URL (without the auto-appended `-xxxx` suffix). The
-- webhook / admin publish flow prefers this value when it is still free at
-- publish time, falling back to the existing `name-xxxx` generator otherwise.
--
-- Idempotent: ADD COLUMN guarded by IF NOT EXISTS.
-- =============================================================================

ALTER TABLE "card_orders"
  ADD COLUMN IF NOT EXISTS "desired_slug" TEXT;
