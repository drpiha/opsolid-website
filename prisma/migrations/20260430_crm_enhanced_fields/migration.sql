-- =============================================================================
-- Migration 20260430_crm_enhanced_fields — Phase 6 CRM Polish
--
-- Adds structured CRM fields to card_leads:
--   - interest, meeting_context, company (split from concatenated message)
--   - owner_notes (free-form markdown, card owner only)
--   - tags (string array, e.g. ["müşteri", "hannover-2026"])
--   - status ("new"|"contacted"|"qualified"|"archived")
--   - priority (0=normal, 1=high, 2=urgent)
--   - last_contacted_at (owner-set last interaction date)
--
-- Adds owner CRM fields to card_connections:
--   - tags, priority, last_contacted_at (mirrors CardLead pattern)
--
-- Backward-compatible: all new columns are nullable / have defaults.
-- Existing rows are unaffected; the lead API backfill script populates
-- interest/meetingContext/company from existing concatenated messages.
-- =============================================================================

-- card_leads — structured input fields (split from message concat)
ALTER TABLE "card_leads"
  ADD COLUMN IF NOT EXISTS "interest"          TEXT,
  ADD COLUMN IF NOT EXISTS "meeting_context"   TEXT,
  ADD COLUMN IF NOT EXISTS "company"           TEXT;

-- card_leads — owner CRM fields
ALTER TABLE "card_leads"
  ADD COLUMN IF NOT EXISTS "owner_notes"       TEXT,
  ADD COLUMN IF NOT EXISTS "tags"              TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "status"            TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS "priority"          INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "last_contacted_at" TIMESTAMP(3);

-- card_leads indexes for CRM filtering
CREATE INDEX IF NOT EXISTS "card_leads_order_id_status_idx"
  ON "card_leads"("order_id", "status");

-- card_connections — owner CRM fields
ALTER TABLE "card_connections"
  ADD COLUMN IF NOT EXISTS "tags"              TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "priority"          INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "last_contacted_at" TIMESTAMP(3);
