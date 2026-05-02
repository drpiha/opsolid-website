-- =============================================================================
-- Patch 014 — B0.6: Add User.role column for RBAC
--
-- Adds a `role` text column to `users` with default 'USER'.
-- Valid values: 'USER' | 'ADMIN'. Enforced in app code, not a DB enum,
-- consistent with the project's "String with documented values" pattern.
--
-- Idempotent: guarded by IF NOT EXISTS / DO $$...EXCEPTION pattern.
--
-- Rollback (down):
--   ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
-- =============================================================================

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER';
