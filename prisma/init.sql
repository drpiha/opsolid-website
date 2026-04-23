-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE IF NOT EXISTS "card_templates" (
    "id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector_hint" TEXT NOT NULL,
    "component_key" TEXT NOT NULL,
    "preview_path" TEXT NOT NULL,
    "one_time_cents" INTEGER NOT NULL,
    "monthly_cents" INTEGER,
    "yearly_cents" INTEGER,
    "stripe_one_time_price_id" TEXT,
    "stripe_monthly_price_id" TEXT,
    "stripe_yearly_price_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "card_orders" (
    "id" TEXT NOT NULL,
    "order_number" SERIAL NOT NULL,
    "slug" TEXT,
    "template_id" INTEGER NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "call_me_back" BOOLEAN NOT NULL DEFAULT false,
    "card_data" JSONB NOT NULL,
    "brand_primary_hex" TEXT,
    "brand_accent_hex" TEXT,
    "photo_path" TEXT,
    "logo_path" TEXT,
    "billing_mode" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "locale" TEXT NOT NULL DEFAULT 'de',
    "stripe_session_id" TEXT,
    "stripe_payment_intent_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_customer_id" TEXT,
    "status" TEXT NOT NULL,
    "design_notes" TEXT,
    "edit_token" TEXT,
    "contacted_at" TIMESTAMP(3),
    "contacted_by_note" TEXT,
    "paid_at" TIMESTAMP(3),
    "awaiting_design_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "cancel_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "order_status_history" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT NOT NULL,
    "note" TEXT,
    "actor" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "card_templates_slug_key" ON "card_templates"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "card_orders_order_number_key" ON "card_orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "card_orders_slug_key" ON "card_orders"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "card_orders_stripe_session_id_key" ON "card_orders"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "card_orders_edit_token_key" ON "card_orders"("edit_token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "card_orders_status_idx" ON "card_orders"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "card_orders_contact_phone_idx" ON "card_orders"("contact_phone");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "card_orders_call_me_back_contacted_at_idx" ON "card_orders"("call_me_back", "contacted_at");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_order_id_key" ON "subscriptions"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "order_status_history_order_id_created_at_idx" ON "order_status_history"("order_id", "created_at");

-- AddForeignKey (wrapped in DO blocks for idempotency; PG has no IF NOT EXISTS for ADD CONSTRAINT)
DO $$ BEGIN
  ALTER TABLE "card_orders" ADD CONSTRAINT "card_orders_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "card_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "card_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "card_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

