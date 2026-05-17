-- =============================================================================
-- Patch 019 — Inbox v2 (Kutasia Workspace pivot)
--
-- Adds five tables for channel-agnostic unified inbox:
--   inbox_channels  · inbox_threads  · inbox_messages
--   inbox_suggestions · inbox_playbooks
--
-- Each table cascade-deletes with users. Mirrors the Prisma migration at
-- prisma/migrations/20260517000000_add_inbox_v2/migration.sql so both
-- environments stay in sync without needing Prisma CLI on the prod host.
--
-- Idempotent via IF NOT EXISTS / DO blocks — safe to re-run.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- inbox_channels
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "inbox_channels" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "external_id" TEXT,
    "config" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "last_error_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inbox_channels_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "inbox_channels_type_external_id_key"
    ON "inbox_channels"("type", "external_id");
CREATE INDEX IF NOT EXISTS "inbox_channels_user_id_type_idx"
    ON "inbox_channels"("user_id", "type");
CREATE INDEX IF NOT EXISTS "inbox_channels_user_id_status_idx"
    ON "inbox_channels"("user_id", "status");

DO $$ BEGIN
    ALTER TABLE "inbox_channels" ADD CONSTRAINT "inbox_channels_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- inbox_threads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "inbox_threads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "channel_type" TEXT NOT NULL,
    "external_thread_id" TEXT NOT NULL,
    "subject" TEXT,
    "contact_name" TEXT,
    "contact_handle" TEXT NOT NULL,
    "contact_locale" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "unread_count" INTEGER NOT NULL DEFAULT 0,
    "assigned_to" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ai_summary" TEXT,
    "ai_sentiment" TEXT,
    "ai_intent" TEXT,
    "ai_updated_at" TIMESTAMP(3),
    "ai_message_count" INTEGER NOT NULL DEFAULT 0,
    "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snoozed_until" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inbox_threads_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "inbox_threads_channel_id_external_thread_id_key"
    ON "inbox_threads"("channel_id", "external_thread_id");
CREATE INDEX IF NOT EXISTS "inbox_threads_user_id_status_last_message_at_idx"
    ON "inbox_threads"("user_id", "status", "last_message_at");
CREATE INDEX IF NOT EXISTS "inbox_threads_user_id_channel_type_status_idx"
    ON "inbox_threads"("user_id", "channel_type", "status");
CREATE INDEX IF NOT EXISTS "inbox_threads_user_id_priority_last_message_at_idx"
    ON "inbox_threads"("user_id", "priority", "last_message_at");

DO $$ BEGIN
    ALTER TABLE "inbox_threads" ADD CONSTRAINT "inbox_threads_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "inbox_threads" ADD CONSTRAINT "inbox_threads_channel_id_fkey"
        FOREIGN KEY ("channel_id") REFERENCES "inbox_channels"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- inbox_messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "inbox_messages" (
    "id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "sent_by" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "body" TEXT,
    "media_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "voice_url" TEXT,
    "voice_transcript" TEXT,
    "language" TEXT,
    "external_id" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),
    "read_at" TIMESTAMP(3),
    CONSTRAINT "inbox_messages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "inbox_messages_thread_id_external_id_key"
    ON "inbox_messages"("thread_id", "external_id");
CREATE INDEX IF NOT EXISTS "inbox_messages_thread_id_created_at_idx"
    ON "inbox_messages"("thread_id", "created_at");
CREATE INDEX IF NOT EXISTS "inbox_messages_direction_status_idx"
    ON "inbox_messages"("direction", "status");

DO $$ BEGIN
    ALTER TABLE "inbox_messages" ADD CONSTRAINT "inbox_messages_thread_id_fkey"
        FOREIGN KEY ("thread_id") REFERENCES "inbox_threads"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- inbox_suggestions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "inbox_suggestions" (
    "id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "content" TEXT NOT NULL,
    "payload" JSONB,
    "model_used" TEXT,
    "tokens_in" INTEGER,
    "tokens_out" INTEGER,
    "accepted_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inbox_suggestions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "inbox_suggestions_thread_id_type_status_idx"
    ON "inbox_suggestions"("thread_id", "type", "status");

DO $$ BEGIN
    ALTER TABLE "inbox_suggestions" ADD CONSTRAINT "inbox_suggestions_thread_id_fkey"
        FOREIGN KEY ("thread_id") REFERENCES "inbox_threads"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- inbox_playbooks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "inbox_playbooks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'custom',
    "template_slug" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger_type" TEXT NOT NULL,
    "trigger_config" JSONB,
    "steps" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "last_run_at" TIMESTAMP(3),
    "last_run_ok" BOOLEAN,
    "last_run_error" TEXT,
    "run_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inbox_playbooks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "inbox_playbooks_user_id_active_idx"
    ON "inbox_playbooks"("user_id", "active");
CREATE INDEX IF NOT EXISTS "inbox_playbooks_user_id_trigger_type_idx"
    ON "inbox_playbooks"("user_id", "trigger_type");

DO $$ BEGIN
    ALTER TABLE "inbox_playbooks" ADD CONSTRAINT "inbox_playbooks_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
