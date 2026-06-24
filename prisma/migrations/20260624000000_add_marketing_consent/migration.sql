-- Marketing consent (GDPR / §7 UWG double-opt-in).
--
-- Separate, by-token consent record for marketing email. The account/card data
-- is NOT consent to be marketed to (purpose limitation), so a fresh unticked
-- opt-in is captured at signup, a confirmation (DOI) email is sent, and only
-- rows with status='confirmed' are usable for marketing. Unsubscribe + the
-- whole flow act by `token` only.
--
-- Idempotent (IF NOT EXISTS) so it can be applied by hand on prod and is a
-- no-op if already present.
--
-- Rollback (down):
--   DROP TABLE IF EXISTS "marketing_consents";

CREATE TABLE IF NOT EXISTS "marketing_consents" (
  "id"               TEXT NOT NULL,
  "email"            TEXT NOT NULL,
  "status"           TEXT NOT NULL DEFAULT 'pending',
  "token"            TEXT NOT NULL,
  "consent_text"     TEXT NOT NULL,
  "consent_version"  TEXT NOT NULL,
  "source"           TEXT NOT NULL DEFAULT 'signup',
  "locale"           TEXT NOT NULL DEFAULT 'de',
  "ip_hash"          TEXT,
  "created_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "confirmed_at"     TIMESTAMP(3),
  "unsubscribed_at"  TIMESTAMP(3),
  "updated_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "marketing_consents_pkey" PRIMARY KEY ("id")
);

-- UNIQUE on email (natural key) and on token (action handle).
CREATE UNIQUE INDEX IF NOT EXISTS "marketing_consents_email_key"
  ON "marketing_consents" ("email");

CREATE UNIQUE INDEX IF NOT EXISTS "marketing_consents_token_key"
  ON "marketing_consents" ("token");

-- Status lookups (e.g. exporting confirmed addresses).
CREATE INDEX IF NOT EXISTS "marketing_consents_status_idx"
  ON "marketing_consents" ("status");
