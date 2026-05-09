-- M7 — User.image (avatar URL).
--
-- Populated on Google sign-in from the OIDC `picture` claim and on social-
-- profile enrichment. Nullable; the mobile client falls back to initials when
-- not set. Idempotent (`IF NOT EXISTS`) so re-applying the migration is safe.
--
-- Apply on the VPS with:
--   docker exec opsolid-app npx prisma migrate deploy
--
-- Hasan applies this manually — do not auto-deploy.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "image" TEXT;
