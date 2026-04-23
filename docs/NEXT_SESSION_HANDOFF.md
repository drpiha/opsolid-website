# OpSolid Website — Next Session Handoff

**Role:** You are continuing work on the OpSolid Digital Card product. A previous Claude Code session took the product from "lead-form-only marketing page" to "live self-serve flow with Stripe checkout on a Hostinger VPS." Read this document fully, then execute the remaining work described in **§ 4. Your mission**. Use parallel agents aggressively — the work splits cleanly along 4–5 independent tracks.

---

## 1. Snapshot — what's live right now

- **URL:** https://opsolid.de (public), `https://opsolid.de/products/digital-card` (self-serve DBC).
- **VPS:** `root@srv1150632.hstgr.cloud` (also `root@72.62.0.111`), Ubuntu 24.04, Docker + Traefik reverse proxy (containers `root-traefik-1`, `kutasia-app`/`kutasia-db`, `voicetranslate-*`, `root-n8n-1`, and now `opsolid-app`/`opsolid-db`). Deploy path `/opt/opsolid-website`.
- **Stack:** Next.js **14** (App Router, standalone output), React 18, Tailwind 3, Prisma **6**, Postgres 16, Stripe, nodemailer, Cal.com embed. i18n via content files in `src/content/{en,de,tr}.ts` — `en.ts` is the type source of truth, all three must share exactly the same keys or the build breaks.
- **GitHub:** `drpiha/opsolid-website` (private). Push/pull via HTTPS + PAT, or add a key to GitHub account.
- **Database:** `opsolid_web` Postgres on the same VPS, isolated from Kutasia's DB. 4 tables: `card_templates` (5 seeded), `card_orders`, `subscriptions`, `order_status_history`.
- **Stripe:** **TEST mode** only. 5 products × 3 prices (one-time, monthly, yearly). Webhook `https://opsolid.de/api/webhooks/stripe` is registered and verified end-to-end with a signed fake event.
- **SSL:** Let's Encrypt via Traefik's `mytlschallenge` certresolver, auto-renew.

## 2. What already works (verified in the previous session)

- [x] Template gallery renders 5 live mini-previews, numbered `#01…#05`.
- [x] Order form with full contact + card content + photo/logo upload + hex colors + 3-tier billing toggle (Monthly / **Yearly (Best value)** / One-time). Yearly is the default.
- [x] Server-side Zod validation; URL fields accept bare domains ("studio-nord.de" auto-prepends https://).
- [x] `POST /api/orders` creates a `CardOrder(PENDING_PAYMENT)` and returns a Stripe Checkout URL.
- [x] `POST /api/webhooks/stripe` verifies HMAC; on `checkout.session.completed` flips status to `PUBLISHED`, auto-generates a slug, writes `OrderStatusHistory`, calls `notifyOrderEvent(...)`.
- [x] Public card page `/c/{slug}` renders with the chosen template + brand colors + photo.
- [x] Admin list `/admin/orders?token=…` with tabs (Call-me-back / Active / Pending) + row-click detail page at `/admin/orders/[id]?token=…` showing full customer + card content + Stripe IDs + status history.
- [x] 3 locales (DE/EN/TR) complete; Traefik routing; Let's Encrypt cert valid through 2026-07-22.

## 3. Where secrets live (pick these up at session start)

On the operator's machine (paths are Windows):

```
C:\Users\User\.ssh\id_ed25519_opsolid          # SSH key to the VPS
C:\Users\User\.stripe-token                     # sk_test_… + pk_test_… (2 lines)
C:\Users\User\.opsolid-deploy-secrets           # webhook secret + admin token
C:\Users\User\.opsolid-smtp                     # SMTP creds (IF user created this)
C:\Users\User\.claude\projects\…\memory\        # Claude memory files (project + feedback)
```

If those paths don't exist on the new machine, ask the user to run the `.transfer/` pull flow (see `.transfer/README.md`) and then **delete the `bundle-one-time` branch**.

Quick sanity check before starting real work:

```bash
ssh -i /c/Users/User/.ssh/id_ed25519_opsolid root@srv1150632.hstgr.cloud 'docker ps --filter name=opsolid'
curl -sk -I https://opsolid.de/ | head -1      # expect HTTP/2 307 or 200
```

---

## 4. Your mission — the five remaining tracks

The user wants the Digital Card product **complete end-to-end** — "eksik bir nokta kalmasın." These five tracks are independent enough to parallelize. Spawn agents, share progress, rebase on each other's work when needed. **Commit after every track.**

### Track A — Unify admin into Kutasia

> The user manages Kutasia's inbox daily. Asking them to remember a second admin URL + token for opsolid.de doesn't fit their workflow. Move the order surfaces into Kutasia's dashboard.

- Read `projects/opsolid/guestsignal/` (Kutasia repo in the same workspace). Its admin pages live under `src/app/(admin)/admin/` and `src/app/(dashboard)/`. Match that UX.
- Architecture choice: **API federation** is cleaner than shared DB.
  - Add `GET /api/admin/orders` + `GET /api/admin/orders/[id]` to opsolid-website (already gated by `ADMIN_TOKEN`; extend with a machine-to-machine token if needed).
  - In Kutasia, add a new navigation item "OpSolid Orders" under admin. Server components fetch via `apiFetch` with a service token stored in Kutasia's env (`OPSOLID_ADMIN_TOKEN`).
  - Reuse Kutasia's existing `Button/Card/Badge` components + OKLCH theme — don't copy the Popl-style admin from opsolid.
- Done when a Kutasia admin user opens `kutasia.com/admin/opsolid-orders`, sees the same 3 tabs + detail view, and `opsolid.de/admin/orders` can be deprecated (or kept behind a feature flag).

### Track B — Email pipeline (operator + customer)

> Admin notifications already trigger in `src/lib/notifications.ts::notifyOrderEvent` (Telegram + CallMeBot + SMTP in parallel). The user has SMTP creds ready at `C:\Users\User\.opsolid-smtp` (3 lines: SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL). Ingest them into the VPS `.env`.

- Append SMTP vars to `/opt/opsolid-website/.env` via SSH, `docker restart opsolid-app`, and send a test order to confirm admin gets the mail with `[ARA]` subject prefix when callMeBack=true.
- **Add a customer email** — currently customers only see the thanks page. Build `src/lib/email/templates/order-confirmation.tsx` (HTML, 3-locale) and wire it into the Stripe webhook handler right after the `PUBLISHED` transition. Content: thank you, their public URL, QR download link, the edit token (see Track D), ETA for hand-design finishes (48h per the copy).
- **Add a "revision ready" template** for Track D's flow.

### Track C — Hand-designed review stage (not auto-publish)

> Marketing copy says "el yapımı tasarım, 48 saatte teslim." But the current webhook auto-publishes the customer's raw input the second Stripe confirms. That's a credibility bug.

- Introduce a new status `AWAITING_DESIGN` between `PAID` and `PUBLISHED`. Flow: checkout.completed → `PAID` → `AWAITING_DESIGN` (not `PUBLISHED`). Admin sees it in "In design" tab, picks the order, polishes the card (tweaks bio, colors, adds logo treatment), then clicks "Publish" in the admin panel which triggers the `PUBLISHED` transition + generates slug + sends the customer the "your card is live" email.
- Customer sees a different thanks-page state between payment and publish: "Our designer is handcrafting your card — we'll email you within 48h."
- Migration: all existing `PUBLISHED` orders stay as-is; only new orders go through AWAITING_DESIGN.

### Track D — Customer self-service edit + download

> Once live, the customer should be able to tweak their own card (typo fix, new phone, update LinkedIn) without calling support. Also they need the QR + a wallet pass.

- Generate a per-order `edit_token` (random cuid) at order creation. Send it in the confirmation email.
- Build `/card/edit/{orderId}?t={edit_token}` — lets the customer update `cardData`, colors, photo. Saves straight to DB (no re-checkout, subscription implies update rights).
- Add `/c/{slug}.png` route — Puppeteer or `@vercel/og` style HTML-to-image of the card for social/OG. Also add download buttons to the thanks page: **QR PNG**, **QR SVG**, **Apple Wallet `.pkpass`** (stretch — requires a signed cert).
- Add "Cancel subscription" button — calls Stripe subscription.cancel, webhook handles the downstream transition to CANCELLED (code already exists, just expose the UI).

### Track E — Live-mode cutover + observability

> The whole store is in Stripe TEST. It can't take real money yet.

- User runs `scripts/setup-stripe.ts /path/to/live-key --write` to create LIVE-mode parallel products/prices + webhook.
- Swap the three Stripe env vars in `/opt/opsolid-website/.env` with LIVE values, restart app.
- **Add error tracking** — Sentry free tier, wired into both the Next.js app and the Stripe webhook so silent failures aren't silent anymore.
- **Add metrics** — a small `/admin/stats` panel (or merged into the Kutasia admin per Track A) showing 7-day revenue, orders by billing mode, conversion (sessions started vs completed).
- **Backups** — Postgres nightly dump to the VPS disk + weekly rotate. Add a cron via the VPS `crontab`, not in Docker.

---

## 5. Constraints + decisions the previous session locked in

- **No Vercel for this app.** Backend state (DB, uploads) means we stay on the VPS. Traefik routes `opsolid.de` → container:3000 with auto-TLS.
- **Shared VPS.** Don't touch `kutasia-*`, `voicetranslate-*`, `root-traefik-1`, `root-n8n-1` containers unless the task requires it (and then only additively).
- **Prisma 6 (NOT 7).** The `prisma-client` generator of v7 demands a driver adapter; v6's classic `prisma-client-js` works without one. Don't upgrade.
- **Build-time DB seeding is off-limits.** Prisma CLI inside the standalone runtime needs a dep it doesn't ship (`effect`). The previous session works around it by applying `prisma/init.sql` + `prisma/seed.sql` via `docker exec -i opsolid-db psql`. If you change the schema, regenerate `init.sql` with `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` and ship both files together.
- **i18n is strict.** New strings must go into all three content files (`en/de/tr`) with identical keys, or `next build` fails at type-check.
- **The user prefers self-hosted over managed.** Hostinger VPS is already paid for; avoid Vercel Postgres / Supabase / Upstash unless there's a hard reason.

## 6. Agent decomposition suggestion

Sensible parallelization (run 3 agents simultaneously; the other 2 tracks are serialized after):

| Wave | Agent | Track | Depends on |
|------|-------|-------|------------|
| 1 | general-purpose | **B** (email) | — |
| 1 | general-purpose | **C** (design review stage) | — |
| 1 | Explore, then general-purpose | **A** (Kutasia unification) | — |
| 2 | general-purpose | **D** (self-service edit) | C |
| 2 | general-purpose | **E** (live cutover + observability) | A, B |

Spawn Explore agents first to scan:
- Kutasia's admin layout and auth patterns (`projects/opsolid/guestsignal/src/app/(dashboard)/` + `src/lib/auth/session.ts`)
- Existing email templates in opsolid-website + Kutasia (`src/lib/email/templates/`)
- How Kutasia handles its own Stripe webhooks — match those patterns.

## 7. Delivery checklist for the user

When all five tracks land, verify the user can do these without asking:

1. Open `kutasia.com/admin/opsolid-orders`, see the Call-me-back list, click an order, see full details. No opsolid.de admin URL needed.
2. A real customer pays in LIVE mode → user gets both a Telegram and an email. Customer gets a "we're designing" email. 48h later user clicks "Publish" in Kutasia admin → customer gets "your card is live" email with the URL + QR.
3. Customer clicks the edit link in the email → updates their phone → change is live on `/c/{slug}` without re-checkout.
4. User sees in Kutasia admin: MRR, new orders this week, any failed webhooks, uptime of opsolid-app.
5. If the VPS reboots, opsolid-app + opsolid-db come back up on their own (`restart: unless-stopped` already set — just verify after first deploy).

## 8. First commands to run in the new session

```bash
# 1. Confirm access
ssh -i /c/Users/User/.ssh/id_ed25519_opsolid root@srv1150632.hstgr.cloud 'echo ok; docker ps --format "{{.Names}}\t{{.Status}}"'

# 2. Confirm site is live
curl -sI https://opsolid.de/ | head -1

# 3. Confirm the test order from the previous session is still there
ssh -i /c/Users/User/.ssh/id_ed25519_opsolid root@srv1150632.hstgr.cloud \
  "docker exec opsolid-db psql -U opsolid -d opsolid -c 'SELECT order_number, status, slug, call_me_back FROM card_orders ORDER BY order_number'"

# 4. Get the admin URL for manual checks
cat /c/Users/User/.opsolid-deploy-secrets

# 5. Kick off Track A exploration
#    Use the Agent tool with subagent_type="Explore" to map the Kutasia admin UX first.
```

---

**When you finish each track, update `docs/STATUS.md` (section "Yol haritası") and commit. When all five are done, update this file with "COMPLETED" header and move it to `docs/archive/`.**
