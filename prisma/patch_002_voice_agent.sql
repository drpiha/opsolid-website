-- =============================================================================
-- patch_002_voice_agent.sql — Voice Agent product (14 tables)
-- Idempotent: all statements use IF NOT EXISTS / ON CONFLICT DO NOTHING.
-- PostgreSQL 16. Apply with:
--   docker exec -i opsolid-db psql -U opsolid -d opsolid < prisma/patch_002_voice_agent.sql
-- Safe to re-run.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. voice_billing_plans
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_billing_plans" (
    "id"                 TEXT        NOT NULL,
    "plan_key"           TEXT        NOT NULL,
    "display_name"       TEXT        NOT NULL,
    "monthly_minutes"    INTEGER     NOT NULL,
    "overage_rate_cents" INTEGER     NOT NULL,
    "monthly_cents"      INTEGER     NOT NULL,
    "yearly_cents"       INTEGER,
    "features"           JSONB       NOT NULL DEFAULT '[]',
    "is_active"          BOOLEAN     NOT NULL DEFAULT true,
    "created_at"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_billing_plans_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "voice_billing_plans_plan_key_key"
    ON "voice_billing_plans" ("plan_key");

-- ---------------------------------------------------------------------------
-- 2. voice_tenants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_tenants" (
    "id"                   TEXT        NOT NULL,
    "slug"                 TEXT        NOT NULL,
    "business_name"        TEXT        NOT NULL,
    "contact_email"        TEXT        NOT NULL,
    "contact_phone"        TEXT,
    "timezone"             TEXT        NOT NULL DEFAULT 'Europe/Berlin',
    "locale"               TEXT        NOT NULL DEFAULT 'de',
    "mode"                 TEXT        NOT NULL DEFAULT 'standalone',
    "status"               TEXT        NOT NULL DEFAULT 'trial',
    "plan_id"              TEXT,
    "tenant_token"         TEXT        NOT NULL,
    "webhook_secret"       TEXT        NOT NULL,
    "api_token"            TEXT,
    "provider_name"        TEXT        NOT NULL DEFAULT 'retell',
    "provider_account_id"  TEXT,
    "business_description" TEXT,
    "business_address"     TEXT,
    "business_category"    TEXT,
    "kutasia_order_id"     TEXT,
    "feature_flags"        JSONB       NOT NULL DEFAULT '{}',
    "trial_ends_at"        TIMESTAMP(3),
    "created_at"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_tenants_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_tenants_plan_id_fkey"
        FOREIGN KEY ("plan_id") REFERENCES "voice_billing_plans" ("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "voice_tenants_slug_key"
    ON "voice_tenants" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "voice_tenants_tenant_token_key"
    ON "voice_tenants" ("tenant_token");
CREATE UNIQUE INDEX IF NOT EXISTS "voice_tenants_api_token_key"
    ON "voice_tenants" ("api_token");
CREATE UNIQUE INDEX IF NOT EXISTS "voice_tenants_kutasia_order_id_key"
    ON "voice_tenants" ("kutasia_order_id");
CREATE INDEX IF NOT EXISTS "voice_tenants_status_idx"
    ON "voice_tenants" ("status");
CREATE INDEX IF NOT EXISTS "voice_tenants_mode_idx"
    ON "voice_tenants" ("mode");

-- ---------------------------------------------------------------------------
-- 3. voice_agents
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_agents" (
    "id"                       TEXT             NOT NULL,
    "tenant_id"                TEXT             NOT NULL,
    "name"                     TEXT             NOT NULL,
    "display_name"             TEXT             NOT NULL,
    "language"                 TEXT             NOT NULL DEFAULT 'de',
    "voice_id"                 TEXT             NOT NULL,
    "status"                   TEXT             NOT NULL DEFAULT 'draft',
    "prompt_template"          TEXT             NOT NULL,
    "system_prompt"            TEXT             NOT NULL,
    "provider_agent_id"        TEXT,
    "max_duration_seconds"     INTEGER          NOT NULL DEFAULT 600,
    "interruption_sensitivity" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "response_delay_ms"        INTEGER          NOT NULL DEFAULT 500,
    "end_call_phrases"         TEXT[]           NOT NULL DEFAULT '{}',
    "dtmf_handoff_digit"       TEXT,
    "ambient_sound_enabled"    BOOLEAN          NOT NULL DEFAULT false,
    "provider_overrides"       JSONB            NOT NULL DEFAULT '{}',
    "last_synced_at"           TIMESTAMP(3),
    "created_at"               TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"               TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_agents_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_agents_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "voice_agents_provider_agent_id_key"
    ON "voice_agents" ("provider_agent_id");
CREATE INDEX IF NOT EXISTS "voice_agents_tenant_id_status_idx"
    ON "voice_agents" ("tenant_id", "status");

-- ---------------------------------------------------------------------------
-- 4. voice_phone_numbers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_phone_numbers" (
    "id"                TEXT        NOT NULL,
    "tenant_id"         TEXT        NOT NULL,
    "agent_id"          TEXT,
    "e164_number"       TEXT        NOT NULL,
    "friendly_name"     TEXT,
    "provider_phone_id" TEXT,
    "status"            TEXT        NOT NULL DEFAULT 'active',
    "country"           TEXT        NOT NULL DEFAULT 'DE',
    "imported_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_at"       TIMESTAMP(3),
    "created_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_phone_numbers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_phone_numbers_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE,
    CONSTRAINT "voice_phone_numbers_agent_id_fkey"
        FOREIGN KEY ("agent_id") REFERENCES "voice_agents" ("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "voice_phone_numbers_e164_number_key"
    ON "voice_phone_numbers" ("e164_number");
CREATE UNIQUE INDEX IF NOT EXISTS "voice_phone_numbers_provider_phone_id_key"
    ON "voice_phone_numbers" ("provider_phone_id");
CREATE INDEX IF NOT EXISTS "voice_phone_numbers_tenant_id_idx"
    ON "voice_phone_numbers" ("tenant_id");

-- ---------------------------------------------------------------------------
-- 5. voice_calls
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_calls" (
    "id"                   TEXT        NOT NULL,
    "agent_id"             TEXT        NOT NULL,
    "phone_number_id"      TEXT,
    "provider_call_id"     TEXT        NOT NULL,
    "provider_name"        TEXT        NOT NULL,
    "direction"            TEXT        NOT NULL DEFAULT 'inbound',
    "from_number"          TEXT        NOT NULL,
    "to_number"            TEXT        NOT NULL,
    "status"               TEXT        NOT NULL,
    "disposition"          TEXT,
    "outcome_type"         TEXT,
    "detected_language"    TEXT,
    "sentiment"            TEXT,
    "duration_seconds"     INTEGER,
    "recording_url"        TEXT,
    "recording_deleted_at" TIMESTAMP(3),
    "transcript_json"      JSONB,
    "transcript_text"      TEXT,
    "summary_text"         TEXT,
    "extracted_fields"     JSONB       NOT NULL DEFAULT '{}',
    "caller_name"          TEXT,
    "caller_email"         TEXT,
    "caller_phone"         TEXT,
    "cost_units"           INTEGER,
    "processing_status"    TEXT        NOT NULL DEFAULT 'pending',
    "processing_error"     TEXT,
    "started_at"           TIMESTAMP(3),
    "ended_at"             TIMESTAMP(3),
    "created_at"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_calls_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_calls_agent_id_fkey"
        FOREIGN KEY ("agent_id") REFERENCES "voice_agents" ("id") ON DELETE RESTRICT,
    CONSTRAINT "voice_calls_phone_number_id_fkey"
        FOREIGN KEY ("phone_number_id") REFERENCES "voice_phone_numbers" ("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "voice_calls_provider_call_id_key"
    ON "voice_calls" ("provider_call_id");
CREATE INDEX IF NOT EXISTS "voice_calls_agent_id_started_at_idx"
    ON "voice_calls" ("agent_id", "started_at");
CREATE INDEX IF NOT EXISTS "voice_calls_provider_call_id_idx"
    ON "voice_calls" ("provider_call_id");
CREATE INDEX IF NOT EXISTS "voice_calls_processing_status_idx"
    ON "voice_calls" ("processing_status");
CREATE INDEX IF NOT EXISTS "voice_calls_from_number_idx"
    ON "voice_calls" ("from_number");

-- ---------------------------------------------------------------------------
-- 6. voice_call_events
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_call_events" (
    "id"         TEXT        NOT NULL,
    "call_id"    TEXT        NOT NULL,
    "event_type" TEXT        NOT NULL,
    "payload"    JSONB       NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_call_events_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_call_events_call_id_fkey"
        FOREIGN KEY ("call_id") REFERENCES "voice_calls" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "voice_call_events_call_id_created_at_idx"
    ON "voice_call_events" ("call_id", "created_at");

-- ---------------------------------------------------------------------------
-- 7. voice_business_hours
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_business_hours" (
    "id"             TEXT        NOT NULL,
    "tenant_id"      TEXT        NOT NULL,
    "day_of_week"    INTEGER     NOT NULL,
    "open_time"      TEXT        NOT NULL,
    "close_time"     TEXT        NOT NULL,
    "is_closed"      BOOLEAN     NOT NULL DEFAULT false,
    "is_override"    BOOLEAN     NOT NULL DEFAULT false,
    "override_date"  TEXT,
    "override_label" TEXT,
    "ai_mode"        TEXT        NOT NULL DEFAULT 'always_on',
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_business_hours_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_business_hours_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE
);
-- Unique constraint using NULLS NOT DISTINCT (PG 15+) to match Prisma behaviour
CREATE UNIQUE INDEX IF NOT EXISTS "voice_business_hours_tenant_day_key"
    ON "voice_business_hours" ("tenant_id", "day_of_week", "is_override", "override_date")
    NULLS NOT DISTINCT;
CREATE INDEX IF NOT EXISTS "voice_business_hours_tenant_id_idx"
    ON "voice_business_hours" ("tenant_id");

-- ---------------------------------------------------------------------------
-- 8. voice_handoff_rules
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_handoff_rules" (
    "id"            TEXT        NOT NULL,
    "tenant_id"     TEXT        NOT NULL,
    "name"          TEXT        NOT NULL,
    "is_active"     BOOLEAN     NOT NULL DEFAULT true,
    "trigger_type"  TEXT        NOT NULL,
    "trigger_value" TEXT,
    "action_type"   TEXT        NOT NULL,
    "action_config" JSONB       NOT NULL DEFAULT '{}',
    "sort_order"    INTEGER     NOT NULL DEFAULT 0,
    "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_handoff_rules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_handoff_rules_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "voice_handoff_rules_tenant_id_active_order_idx"
    ON "voice_handoff_rules" ("tenant_id", "is_active", "sort_order");

-- ---------------------------------------------------------------------------
-- 9. voice_knowledge_base_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_knowledge_base_items" (
    "id"         TEXT        NOT NULL,
    "tenant_id"  TEXT        NOT NULL,
    "item_type"  TEXT        NOT NULL,
    "title"      TEXT        NOT NULL,
    "content"    TEXT        NOT NULL,
    "tags"       TEXT[]      NOT NULL DEFAULT '{}',
    "is_active"  BOOLEAN     NOT NULL DEFAULT true,
    "sort_order" INTEGER     NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_knowledge_base_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_knowledge_base_items_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "voice_knowledge_base_items_tenant_active_type_idx"
    ON "voice_knowledge_base_items" ("tenant_id", "is_active", "item_type");

-- ---------------------------------------------------------------------------
-- 10. voice_appointment_rules
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_appointment_rules" (
    "id"                  TEXT        NOT NULL,
    "tenant_id"           TEXT        NOT NULL,
    "name"                TEXT        NOT NULL,
    "is_active"           BOOLEAN     NOT NULL DEFAULT true,
    "booking_type"        TEXT        NOT NULL,
    "cal_api_key"         TEXT,
    "cal_event_type_id"   INTEGER,
    "booking_url"         TEXT,
    "buffer_minutes"      INTEGER     NOT NULL DEFAULT 15,
    "min_notice_minutes"  INTEGER     NOT NULL DEFAULT 60,
    "max_days_ahead"      INTEGER     NOT NULL DEFAULT 30,
    "slot_duration_min"   INTEGER     NOT NULL DEFAULT 60,
    "conflict_policy"     TEXT        NOT NULL DEFAULT 'offer_next',
    "confirmation_msg"    TEXT,
    "require_fields"      JSONB       NOT NULL DEFAULT '["name","phone"]',
    "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_appointment_rules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_appointment_rules_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "voice_appointment_rules_tenant_active_idx"
    ON "voice_appointment_rules" ("tenant_id", "is_active");

-- ---------------------------------------------------------------------------
-- 11. voice_integrations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_integrations" (
    "id"               TEXT        NOT NULL,
    "tenant_id"        TEXT        NOT NULL,
    "integration_type" TEXT        NOT NULL,
    "label"            TEXT,
    "status"           TEXT        NOT NULL DEFAULT 'inactive',
    "credentials_json" JSONB,
    "config_json"      JSONB       NOT NULL DEFAULT '{}',
    "last_tested_at"   TIMESTAMP(3),
    "last_error_msg"   TEXT,
    "created_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_integrations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_integrations_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "voice_integrations_tenant_status_idx"
    ON "voice_integrations" ("tenant_id", "status");

-- ---------------------------------------------------------------------------
-- 12. voice_notification_configs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_notification_configs" (
    "id"           TEXT        NOT NULL,
    "tenant_id"    TEXT        NOT NULL,
    "channel_type" TEXT        NOT NULL,
    "label"        TEXT,
    "is_active"    BOOLEAN     NOT NULL DEFAULT true,
    "trigger_on"   TEXT[]      NOT NULL DEFAULT '{}',
    "config"       JSONB       NOT NULL DEFAULT '{}',
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_notification_configs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_notification_configs_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "voice_notification_configs_tenant_active_idx"
    ON "voice_notification_configs" ("tenant_id", "is_active");

-- ---------------------------------------------------------------------------
-- 13. voice_usage_records
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_usage_records" (
    "id"               TEXT        NOT NULL,
    "tenant_id"        TEXT        NOT NULL,
    "call_id"          TEXT        NOT NULL,
    "billing_month"    TEXT        NOT NULL,
    "duration_seconds" INTEGER     NOT NULL,
    "billable_minutes" INTEGER     NOT NULL,
    "cost_units"       INTEGER     NOT NULL DEFAULT 0,
    "overage_units"    INTEGER     NOT NULL DEFAULT 0,
    "overage_cents"    INTEGER     NOT NULL DEFAULT 0,
    "created_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_usage_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_usage_records_call_id_key" UNIQUE ("call_id"),
    CONSTRAINT "voice_usage_records_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE,
    CONSTRAINT "voice_usage_records_call_id_fkey"
        FOREIGN KEY ("call_id") REFERENCES "voice_calls" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "voice_usage_records_tenant_month_idx"
    ON "voice_usage_records" ("tenant_id", "billing_month");

-- ---------------------------------------------------------------------------
-- 14. voice_test_runs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "voice_test_runs" (
    "id"               TEXT        NOT NULL,
    "tenant_id"        TEXT        NOT NULL,
    "agent_id"         TEXT        NOT NULL,
    "to_number"        TEXT        NOT NULL,
    "provider_call_id" TEXT,
    "status"           TEXT        NOT NULL DEFAULT 'initiated',
    "notes"            TEXT,
    "created_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_test_runs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "voice_test_runs_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "voice_tenants" ("id") ON DELETE CASCADE,
    CONSTRAINT "voice_test_runs_agent_id_fkey"
        FOREIGN KEY ("agent_id") REFERENCES "voice_agents" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "voice_test_runs_provider_call_id_key"
    ON "voice_test_runs" ("provider_call_id");
CREATE INDEX IF NOT EXISTS "voice_test_runs_tenant_created_at_idx"
    ON "voice_test_runs" ("tenant_id", "created_at");

-- ---------------------------------------------------------------------------
-- Seed: billing plans (idempotent)
-- ---------------------------------------------------------------------------
INSERT INTO "voice_billing_plans"
    ("id", "plan_key", "display_name", "monthly_minutes", "overage_rate_cents",
     "monthly_cents", "yearly_cents", "features", "is_active", "updated_at")
VALUES
    ('vbp_starter',    'starter',      'Voice Starter',        120,  12, 4900,  49000, '["Transkript","Zusammenfassung","E-Mail-Benachrichtigung"]',           true, CURRENT_TIMESTAMP),
    ('vbp_growth',     'growth',       'Voice Growth',         600,  10, 14900, 149000,'["Transkript","Zusammenfassung","Telegram+WhatsApp","Analytics"]',      true, CURRENT_TIMESTAMP),
    ('vbp_enterprise', 'enterprise',   'Voice Enterprise',     2000, 8,  39900, 399000,'["Transkript","Zusammenfassung","Alle Kanäle","Analytics","API-Zugang"]',true, CURRENT_TIMESTAMP),
    ('vbp_kutasia',    'kutasia_addon', 'Voice Add-on (Kutasia)',300, 12, 7900,  79000, '["Kutasia CRM Integration","Transkript","Zusammenfassung"]',            true, CURRENT_TIMESTAMP)
ON CONFLICT ("plan_key") DO NOTHING;
