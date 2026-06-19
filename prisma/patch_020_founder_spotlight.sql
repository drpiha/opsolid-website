-- =============================================================================
-- patch_020_founder_spotlight.sql
--
-- Faz 9 — seed the founder card (slug 'hasan') with an example "Şu an / Now"
-- spotlight so the new panel is visible on the live card right after deploy.
-- The VPS pipeline applies these patch_*.sql files but never runs the TS seed
-- (prisma/seed.ts), so the founder card's card_data needs this one-shot fill.
--
-- Idempotent + non-destructive:
--   • the `||` merge adds ONLY the `spotlight` key, preserving every other
--     card_data field;
--   • the `NOT (card_data ? 'spotlight')` guard skips the row once a spotlight
--     exists, so a later owner edit is never overwritten and re-runs are no-ops;
--   • a missing founder card simply matches 0 rows (no error).
-- =============================================================================

UPDATE "card_orders"
SET "card_data" = "card_data" || jsonb_build_object(
      'spotlight', jsonb_build_object(
        'enabled',   true,
        'body',      'Aktuell nehme ich neue Automatisierungs- und KI-Projekte für Q3 an. Lass uns kurz sprechen — ein 20-minütiger Discovery-Call genügt.',
        'linkUrl',   'https://cal.com/solidra/discovery-call',
        'linkLabel', 'Gespräch buchen'
      )
    ),
    "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'hasan'
  AND NOT ("card_data" ? 'spotlight');
