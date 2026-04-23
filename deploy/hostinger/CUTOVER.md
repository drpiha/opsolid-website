# OpSolid — Stripe LIVE-mode cutover

Step-by-step for switching the Digital Card store from TEST to LIVE Stripe.
Nothing here is reversible in the "unprocess a real charge" sense, so take it
slow and do the €0.50 smoke test before announcing the product.

Prereqs:
- Stripe account is fully verified (ID, bank, German VAT handled in Tax
  settings, statement descriptor set).
- VPS has the current TEST-mode `.env` working, orders round-trip fine on
  TEST cards (`4242 4242 4242 4242`).

## 1. Generate LIVE products + webhook

From a dev machine that has the live secret key (`sk_live_...`), dry-run first:

```bash
cd opsolid-website
npm install            # ensures tsx is present
npx tsx scripts/setup-stripe.ts --live sk_live_xxx
```

Inspect the output. If it says `+ product created ...` and `+ yearly ... created`
for all five templates, re-run with `--write` to patch
`src/config/card-templates.ts` with the new price IDs:

```bash
npx tsx scripts/setup-stripe.ts --live sk_live_xxx --write
```

Commit the patched `card-templates.ts` to the `feat/complete-dbc` branch.

## 2. Swap env on the VPS

SSH to the VPS and edit `/opt/opsolid-website/.env`. Replace:

```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

…with the LIVE block the script printed. The publishable key (`pk_live_...`)
comes from Stripe dashboard → Developers → API keys → Publishable key.
`chmod 600 .env` stays.

## 3. Rebuild + restart the container

```bash
cd /opt/opsolid-website
git pull
docker compose up -d --build
docker logs -f opsolid-app
```

Wait for "Ready on 0.0.0.0:3000". Hit `https://opsolid.de/api/health` — expect
`{"ok":true,"commit":"...","dbOk":true}`.

## 4. €0.50 live smoke test

1. Temporarily set a €0.50 test price on template #1 (edit the DB directly or
   add a hidden "staff-test" template in `card-templates.ts`).
2. Place one order with a real card as a real person.
3. Confirm:
   - Stripe dashboard shows the payment as **Succeeded** in LIVE mode.
   - Webhook event in Stripe dashboard → Webhooks → your endpoint → Event log
     says `200 OK`.
   - `/admin/orders?token=...` shows the order as `AWAITING_DESIGN`.
   - Customer confirmation email landed (check Gmail "All Mail").
   - Telegram + WhatsApp notifications arrived.
4. Immediately refund it from the Stripe dashboard. Confirm `/admin/orders`
   reflects it (the refund may not auto-set REFUNDED today — that's Track G's
   problem; for now, manually mark it via the admin API if the status is
   misleading).
5. Restore the price back to €29 (or whatever the real value is).

## 5. Webhook smoke test (Stripe-side)

In Stripe dashboard → Developers → Webhooks → your endpoint, click
"Send test webhook" → `checkout.session.completed` → Send. Expect a **200**
response. If you get `401`, the `STRIPE_WEBHOOK_SECRET` is stale — redeploy.

## 6. Announcement gate

Do NOT announce / public-launch until:
- One real paid + refunded order has round-tripped end-to-end.
- `/api/health` has been green for 24h.
- Sentry (if configured) is receiving events from the staging webhook test.
- Backups ran at least once (see `BACKUPS.md`).
