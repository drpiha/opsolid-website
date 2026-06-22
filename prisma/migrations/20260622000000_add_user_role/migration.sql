-- B0.6 — add User.role column for RBAC.
--
-- The schema (prisma/schema.prisma) and prisma/patch_014_add_user_role.sql have
-- carried this column for some time, but it was never promoted into a tracked
-- prisma/migrations entry — so `prisma migrate deploy` (the prod apply path)
-- never created it. On a DB where patch_014 was not applied by hand, the column
-- is missing: prisma.user.create on the password-signup path emits the column in
-- its INSERT and full-row findUnique reads (requireUser / getSessionUser) SELECT
-- it, both of which throw `column "role" does not exist` -> 500 on signup.
--
-- Valid values: 'USER' | 'ADMIN'. Enforced in app code, not a DB enum, in line
-- with the project's "String with documented values" convention.
--
-- Idempotent (IF NOT EXISTS) so it is a no-op where patch_014 already ran.
--
-- Rollback (down):
--   ALTER TABLE "users" DROP COLUMN IF EXISTS "role";

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER';
