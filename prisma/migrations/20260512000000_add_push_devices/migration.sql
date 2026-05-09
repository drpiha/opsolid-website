-- M4 — Real-time comms.
--
-- Two additive concerns, both idempotent (`IF NOT EXISTS` everywhere) so the
-- migration is safe to re-apply.
--
--   1. PushDevice. One row per (user, deviceId); a re-register from the same
--      install updates the row in place via the unique index. Failed delivery
--      with `DeviceNotRegistered` from Expo's receipt response triggers a
--      hard-delete (see `src/lib/push.ts`).
--
--   2. User.notificationPrefs. JSONB column, default null (treated as "all
--      categories enabled" by app code). Mobile Settings → Notifications
--      writes a `{ messages, inboxRequests, mutualSaves, eventReminders }`
--      shape via `PATCH /api/v1/auth/me`.
--
-- Apply on the VPS with:
--   docker exec opsolid-app npx prisma migrate deploy
--
-- Hasan applies this manually — do not auto-deploy.

-- ---------------------------------------------------------------------------
-- PushDevice — registered Expo push tokens per (user, install).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "push_devices" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expo_push_token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_devices_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "push_devices_user_id_device_id_key"
  ON "push_devices"("user_id", "device_id");

CREATE INDEX IF NOT EXISTS "push_devices_user_id_idx"
  ON "push_devices"("user_id");

CREATE INDEX IF NOT EXISTS "push_devices_expo_push_token_idx"
  ON "push_devices"("expo_push_token");

ALTER TABLE "push_devices"
  ADD CONSTRAINT "push_devices_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- User.notificationPrefs — per-user push category toggles.
-- ---------------------------------------------------------------------------
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "notification_prefs" JSONB;
