# OpSolid Mobile — Development Progress

Living log of mobile-app feature work. Updated per session, not auto-generated.

## Status snapshot — 2026-05-09

The "Verso by OpSolid" mobile app is feature-complete through **Sprint F4**. Current head of `main` is on top of `e46038d` (F4). Hasan is offline / the phone is on a different WiFi than the maintainer machine. The APK is built and on a GitHub Release; nothing else needs to be built. The next session is purely an install + migrate + seed run.

---

## ▶ NEXT SESSION CHECKLIST (do these in order)

If you are picking this up fresh — from the same machine Hasan was using, or a different machine — run through these. Each step is independent and idempotent. Read `mobile/CLAUDE.md` for repo conventions if anything in here is unclear.

### Step 1 — Get the phone back on ADB-WiFi

Phone: `de.opsolid.mobile`. Ask Hasan for the phone's current LAN IP (Settings → WiFi → tap the network → IP address). Then on the dev machine:

```powershell
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
& $adb connect <PHONE_IP>:5555
& $adb devices             # phone should show as "device" (not "offline")
```

If `adb connect` rejects with `unauthorized`, the phone needs a one-time USB connect to re-authorize the host's RSA key. Helper in `scripts/mobile-adb-wifi.ps1`.

### Step 2 — Install the latest APK (login preserved)

The latest release is **`android-build-22`** on `https://github.com/drpiha/opsolid-website/releases`. Tag mismatch note: GitHub Actions `run_number` drives the tag, so this is the 22nd workflow run, not the 22nd APK we've built — but it's the LATEST commit on `main` (`e46038d`, all sprints through F4).

```powershell
gh release download android-build-22 --pattern "*.apk" --dir $env:TEMP --clobber
& $adb install -r "$env:TEMP\opsolid-android-0.1.0-b22.apk"
```

`-r` preserves Google login + biometric pref + secure-store tokens because the keystore is stable (GitHub Secrets `KEYSTORE_BASE64` + `KEYSTORE_PASSWORD`).

### Step 3 — Apply server migrations + seed events

The mobile app expects `Event`, `EventAttendee`, and `Message` tables that don't exist on prod yet. Two new migrations are committed but **not applied**. Run from anywhere with SSH access:

```bash
ssh root@srv1150632.hstgr.cloud "docker exec opsolid-app npx prisma migrate deploy"
ssh root@srv1150632.hstgr.cloud "docker exec opsolid-app npx tsx scripts/seed-events.ts"
```

Both are additive + idempotent. Migration creates 3 tables (`events`, `event_attendees`, `messages`). Seed populates 4 fictional fairs (DMEXCO / Bits & Pretzels / Webrazzi Zirvesi / IHM München) and assigns the existing demo cards as attendees.

If `seed-events.ts` is not in `/app/scripts/` inside the container, copy it first (the seed-public-cards pattern from earlier in this PROGRESS file applies):

```bash
ssh root@srv1150632.hstgr.cloud "docker exec -u 0 opsolid-app mkdir -p /app/scripts && docker cp /opt/opsolid-website/scripts/seed-events.ts opsolid-app:/app/scripts/seed-events.ts && docker exec opsolid-app npx tsx scripts/seed-events.ts"
```

### Step 4 — Smoke-test on phone

After install + migrate + seed, expect:

- New Verso "Add Contact" icon on the launcher (white person silhouette + dominant white `+` on solid teal).
- App opens to a teal loading view (no more black screen) → cards screen with animated 4-deep card-deck + 64pt teal FAB.
- 6th tab "Events" between Discover and Contacts. Discover has an "Upcoming events" rail above search.
- Inbox row tap → thread chat (15s polling, optimistic send, accept/decline pill).
- Empty Contacts state offers "Tanıdığım kişileri ekle" — one tap seeds 5 demo cards as saved contacts.
- Settings: Light/System/Dark + EN/DE/TR + About panel + version info.
- Edit form: 3 tabs (Profil/Tasarım/Gelişmiş), template horizontal carousel, full-screen template preview, live preview FAB on Tasarım, brand color split mini-card chip, status banner, feedback toggle, attending events chip multi-select on Gelişmiş.

### Step 5 — If anything is broken, file by sprint and ask in chat

The contributing sprints are tagged in commit messages (`Sprint F2`, `Sprint F3`, `Sprint F4`, `Sprint 6`, `Sprint 7`). `git log --oneline e46038d~10..e46038d -- mobile/` shows every relevant change. The maker agent commit messages reference exact files and decisions.

---

## Polish backlog (lower priority, after smoke-test)

- Save catch in `mobile/app/(app)/cards/edit/[id].tsx` line 377 still says `t.errorLoad` (could not load) on save errors. Add `cards.errorSave` i18n key and use it.
- Migrate `CardDeckTile.handlePressIn` from RN core `Vibration.vibrate` to `expo-haptics` (one file).
- Add a regression test for `_layout.tsx` that mounts with `useAuthStore` stubbed to never resolve, fast-forward 10s with `jest.useFakeTimers()`, assert the rendered tree is no longer the loading View. Prevents black-screen regressions.

---

## World-class roadmap (post-Sprint-F4)

Two strategy docs were produced 2026-05-09 to plan Verso's path to category leader. Read them in this order:

1. **`mobile/assets/world-class-research.md`** — market gap analysis. The headline finding: Verso is feature-rich but ranks middle-of-pack on the two axes leaders actually compete on — *capture-the-other-person* (HiHello/Popl OCR scanners) and *post-meeting CRM workflow* (Mobilo/Tapni/Wave). Includes a search-tech migration ladder (ILIKE → `pg_trgm` GIN now → `tsvector` at 5–50k cards → Meilisearch at 50k+) and a 5-feature backlog sequenced over ~5.5 single-dev weeks.
2. **`mobile/assets/world-class-milestone-plan.md`** — six 2–3 week milestones the maintainer should ship in order: **M1** Frictionless creation (sub-30s OCR + AI scrape) → **M2** Discover at scale (pg_trgm FTS + people-you-may-know scoring) → **M3** Network growth loops (referrals + bidirectional save + share telemetry) → **M4** Real-time comms (Expo Push + 5s polling first, WebSocket if traffic warrants) → **M5** Premium tier (€7/mo, gates 5 cards + custom domain + advanced analytics) → **M6** ES/FR/IT/AR with RTL. Three explicit *do-NOT-ship* calls (no plastic NFC cards, no template marketplace, no enterprise SSO in 2026). Five open questions for Hasan to answer before M5.

The plan's "Next-session resume" block names `mobile/assets/m1-implementation-plan.md` as the very first deliverable for the milestone-execution session — that file does NOT exist yet; it's the next thing to produce.

### M5 — Premium tier [DONE — committed]

Shipped (2026-05-09):

- **Subscription model + Stripe integration.** New Prisma model `UserSubscription` (user-scoped, `userId @unique`, single row per user, distinct from the legacy order-scoped `Subscription` which stays untouched and keeps powering per-card recurring orders from the marketing site). Adds `User.proSince` (denormalised "is Pro" check, flipped by webhook) and `User.stripeCustomerId` (cached customer id). New `DomainRequest` model for Pro custom-domain provisioning. Migration `20260513000000_add_subscriptions_pro/migration.sql` is hand-written, idempotent (`IF NOT EXISTS` everywhere), additive only.
- **Stripe Checkout + Customer Portal endpoints.** `POST /api/v1/billing/checkout` (auth-gated, body `{ interval: 'monthly'|'yearly' }`) creates the Stripe customer on first call, looks up the configured Price ID from `STRIPE_PRICE_PRO_MONTHLY` / `STRIPE_PRICE_PRO_YEARLY` env vars, returns the Checkout URL. `POST /api/v1/billing/portal` opens the Stripe Customer Portal for cancel / update card / view invoices. `GET /api/v1/billing/me` returns the current Pro flags + subscription details for the mobile Settings tab.
- **Stripe webhook extensions.** `POST /api/webhooks/stripe` now handles `customer.subscription.{created,updated,deleted}` + `invoice.{paid,payment_failed}` — single new helper `upsertUserSubscriptionFromStripe` in `src/lib/billing/pro.ts` upserts on `userId @unique` and flips `User.proSince`. Idempotency: the unique index on `userId` makes the upsert a single SQL statement, replays of the same event are no-ops. Legacy order-scoped subscription handler is untouched — the new helper short-circuits when `metadata.userId` is missing (legacy events are identified by `metadata.orderId` and stay on their original handler). `proSince` is flipped to `null` only on terminal statuses (canceled / unpaid / incomplete_expired); past_due keeps access during retry.
- **Free vs Pro feature gates.** New helper `src/lib/auth/pro.ts` exports `isPro(user)` and `cardLimitForUser(user)`. Free = 1 active card; Pro = 5. `POST /api/v1/cards` now counts the user's non-cancelled cards and returns 402 `pro_required` with `{ limit, currentCount, tier }` details when over cap. Mobile `cards.tsx` FAB tap intercepts the same condition client-side and opens the paywall modal — server is the source of truth, client is UX.
- **Carrd amendments — password protection.** `cardData.password` (argon2id hash via existing `src/lib/auth/password.ts`) added to `CardDataSchema`. The hash never round-trips: owner GET via `toApiCard` redacts `password` to `passwordSet: boolean`, public GET via `toPublicApiCard` does the same. Owners change/clear with a fresh plain string in PATCH; the route's `cardData` merge preserves the existing hash when the field is absent. Public viewer (`/c/[slug]/page.tsx`) renders `LockScreen` when `cardData.password` is set + visitor isn't owner + `verso_unlock_<slug>` cookie is missing. `POST /api/cards/[slug]/unlock` verifies the password (constant-time argon2 verify) and sets a 24h httpOnly cookie. Mobile edit form: new `PasswordSection` in CardFormSections (Gelişmiş tab).
- **Carrd amendments — HTML export.** Pro-only `GET /api/v1/cards/[id]/export` returns a self-contained `text/html` document with all CSS inlined, no JS, `Content-Disposition: attachment`. We deliberately render hand-tuned HTML rather than SSR-snapshot the React tree because the templates pull dynamic theme tokens, fonts loaded from /api/fonts, and other deps that don't survive a static export. Mobile Settings → Pro → Export HTML opens a card picker; tap → fetch the HTML bytes → wrap in a `data:text/html;base64,…` URL → open in `expo-web-browser` so the user can share/save via the OS share sheet (avoids pulling in `expo-file-system` + `expo-sharing`).
- **Carrd amendments — Stripe tip jar.** `cardData.tipJar: { enabled, label, stripePriceId }` added to `CardDataSchema`. Pro-gated owner-side; `stripePriceId` is silently dropped on save for non-Pro users. New public endpoint `POST /api/cards/[slug]/tip` creates a one-time Stripe Checkout Session for the configured Price and returns the URL. Defence in depth: the route also rechecks the owner is currently Pro before issuing the session, so a downgraded card's tip button stops working immediately. v1 routes payments to the platform Stripe (Hasan curates handful of sample prices); v2 will add Stripe Connect for owner accounts. Mobile edit form: new `TipJarSection` in CardFormSections.
- **Pro features — custom domain (v1, manual).** `POST /api/v1/billing/domain-request` (Pro-gated) accepts `{ domain, cardOrderId?, notes? }`, validates the domain regex, persists a `DomainRequest` row at `status="pending"`, fires a best-effort email to `OPSOLID_MAINTAINER_EMAIL` (or `SMTP_FROM`) with the request details. v1 = manual provision via existing Traefik+ACME plan; v2 (out of scope) = self-serve DNS verification. Mobile Settings → Pro → "Request a custom domain" opens an inline form modal.
- **Pro features — advanced analytics.** Pro-only `GET /api/v1/cards/[id]/analytics` aggregates 30-day totals (views, unique visitors, leads, saves, mutual saves, shares) + share-events grouped by channel from existing `CardView`, `CardLead`, `SavedCard`, `ShareEvent` tables. Approximate unique-visitor metric (UA + country + city) until a `CardView.ipHash` column lands in v2. New mobile screen `(app)/analytics.tsx` with a horizontal card picker + 6-stat grid + per-channel bar chart.
- **Paywall modal.** New `mobile/src/components/billing/PaywallModal.tsx` — single shared modal triggered by every Pro-gated tap (5-card limit, custom domain, analytics, HTML export, password protection, tip jar). Two CTAs: "Aylık €7" + "Yıllık €60 (-28%)". Each opens Stripe Checkout in `expo-web-browser`; on return the caller refreshes `/api/v1/auth/me` to pick up the new `isPro` state.
- **`auth/me` extensions.** `GET /api/v1/auth/me` now returns `isPro` + `proSince` so mobile gates render correctly. `User` from `requireBearerUser` already includes `proSince` (it's a regular column on the row), so no extra DB hit; PATCH `/api/v1/auth/me` adds `proSince` to its select for symmetry.
- **i18n.** New `billing.*` (paywall copy) and `pro.*` (Settings Pro section + analytics + password/tip-jar labels) blocks for en/de/tr in `mobile/src/lib/i18n/locale.ts`.

Decisions logged:

- **Free tier limit = 1 card; Pro = 5.** Aligns with the milestone-plan recommendation and Hasan's pre-answered question. Sharper conversion gate than 3-card free.
- **Pro pricing = €7/mo or €60/yr (28% saving).** Both Stripe-managed via env-driven Price IDs (`STRIPE_PRICE_PRO_MONTHLY` / `STRIPE_PRICE_PRO_YEARLY`). Annual saving is the carrot for upfront commitment without sales-call complexity.
- **Custom domain v1 = manual provision.** A Pro-gated form that emails the maintainer + creates a `DomainRequest` row at `status=pending`. The maintainer then provisions manually via the existing Traefik+ACME plan (`project_deferred_todos.md`). v2 will self-serve via DNS verification + automatic ACME issuance — deliberately deferred.
- **Stripe webhook idempotency.** The user-scoped `UserSubscription.userId @unique` lets `upsert` be the single mutation; replays of any subscription event are no-ops. `User.proSince` is set only on first activation (we read-then-write to avoid overwriting an earlier timestamp on a "subscription.updated" event for an already-active sub). Cancellation flips `proSince=null` only on terminal statuses (canceled / unpaid / incomplete_expired); past_due keeps access during Stripe's retry window.
- **HTML export technique = hand-tuned static HTML, not React SSR.** The card templates use dynamic theme tokens, fonts loaded via /api/fonts, and other deps that don't survive a static export to a single-file `.html`. The hand-tuned page captures everything a vCard-equivalent needs (name/title/company/bio + contacts + socials + services + buttons + brand colors via CSS custom properties) and renders identically offline. Mobile uses `data:text/html;base64,…` + `expo-web-browser` to avoid pulling in `expo-file-system` + `expo-sharing` (the brief said no new mobile deps).
- **Password handling preserves the existing hash on PATCH.** The owner-side cardData GET redacts `password` to `passwordSet: boolean`, so the round-trip from edit form to PATCH never has the hash to send back. The PATCH route's `cardData` merge logic specifically copies `previous.password` into `merged` when the incoming payload omits the field, so a typical "edit name + save" doesn't accidentally clear a password set earlier. To clear, the owner sends an empty string explicitly (mobile edit form: `clear: true` flag in `PasswordState` → `cardData.password = ""`).
- **No new mobile deps.** `expo-web-browser` was already in the tree (M3 referrals) — Stripe Checkout + HTML export both use it. Avoided `expo-file-system` + `expo-sharing` on the export path by using `data:text/html;base64,…` URLs.
- **Server-side argon2 reuse, not bcrypt.** `src/lib/auth/password.ts` already exposes `hashPassword` + `verifyPassword` (argon2id, used by the user account password path). Reusing the same primitive keeps the dependency surface flat.

Deploy steps for Hasan:

1. **Apply the migration** on the VPS:
   ```bash
   docker exec opsolid-app npx prisma migrate deploy
   ```
   Applies `20260513000000_add_subscriptions_pro/migration.sql` (creates `user_subscriptions` + `domain_requests` tables, adds `users.pro_since` + `users.stripe_customer_id` columns). Additive + idempotent (`IF NOT EXISTS` everywhere).

2. **Set Stripe env vars** on the VPS:
   ```
   STRIPE_SECRET_KEY=<sk_live_…>
   STRIPE_WEBHOOK_SECRET=<whsec_…>
   STRIPE_PRICE_PRO_MONTHLY=<price_…>   # €7/mo recurring
   STRIPE_PRICE_PRO_YEARLY=<price_…>    # €60/yr recurring
   # Optional: maintainer destination for domain-request emails
   OPSOLID_MAINTAINER_EMAIL=<your@email>
   ```
   Then `docker compose up -d --force-recreate opsolid` (env_file changes don't apply on `restart` — see `feedback_docker_env_file.md`).

3. **Configure the Stripe webhook endpoint** at `https://opsolid.de/api/webhooks/stripe` (the existing endpoint — extended in this milestone). Subscribe to events:
   - `checkout.session.completed` (already handled, untouched)
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

4. APK rebuild via the usual `gh workflow run` — ships the paywall modal, Settings Pro section, analytics screen, and password/tip-jar form sections on the next build.

### M4 — Real-time comms [DONE — committed]

Shipped (2026-05-09):

- **Expo Push token registration**. New mobile dependency `expo-notifications ~0.32.0` added explicitly to `mobile/package.json` (SDK 54 doesn't include it transitively — verified via `node_modules` lookup). New module `mobile/src/lib/push/register.ts` requests OS permission, fetches the Expo push token via `getExpoPushTokenAsync({ projectId })`, mints a stable per-install `deviceId` (32-hex via `Math.random` in SecureStore — collision-resistance not required, it's a dedupe key) and POSTs to a new `POST /api/v1/push/register`. Server stores the row in a new Prisma model `PushDevice { id, userId, expoPushToken, platform, deviceId, lastSeenAt, createdAt }` with a unique constraint on `(userId, deviceId)` so re-registers from the same install update in place. Migration `20260512000000_add_push_devices/migration.sql` is hand-written, idempotent (`IF NOT EXISTS` everywhere). The `(app)/_layout.tsx` post-auth hook fires registration once per session in a `void` so the OS permission dialog never blocks any rendering branch — including the root layout's 10s safety timer that drives the black-screen fallback. A "stuck pending" permission state (rare; airplane-mode + suspend) is benign because we don't await the call. Stale tokens (`DeviceNotRegistered` from Expo's response) are reaped server-side in `src/lib/push.ts`.

- **Push fan-out for inbox events**. New server library `src/lib/push.ts` — single `notify({ userId, category, title, body, data })` entry point used by both event hooks. Sends to `https://exp.host/--/api/v2/push/send` in batches of 100, attaches `Authorization: Bearer ${EXPO_ACCESS_TOKEN}` when the env var is set (improves rate limit + receipts; anonymous Expo Push still works for development), reads `User.notificationPrefs` and skips when the requester opted out of the relevant category. Hooked into `POST /api/v1/connections/[id]/messages` (recipient = the OTHER side of the connection; deep-link `verso://inbox/<connectionId>`) and `POST /api/cards/[slug]/actions` (recipient = the receiver card's owner; deep-link `verso://inbox`). Both fire as `void notify(...)` so the originating request is never blocked.

- **Tap-to-deep-link**. Mobile root `_layout.tsx` registers `Notifications.addNotificationResponseReceivedListener` once at mount; tapping a banner reads `data.url` and routes via `Linking.openURL`. Lives at the root (not inside `(app)/_layout`) so cold-start taps that wake the app while the auth gate is still resolving are caught — Linking.openURL queues until the (app) routes mount.

- **Notification preferences**. New `User.notificationPrefs` JSONB column (additive Prisma migration). Default shape `{ messages, inboxRequests, mutualSaves, eventReminders }` all `true`. `GET /api/v1/auth/me` now returns the merged shape (defaults applied for unset keys). New `PATCH /api/v1/auth/me` accepts a partial `notificationPrefs` object and merges into the existing JSON column — forward-compatible with future categories. Mobile Settings → "Notifications" replaces the F5 "Coming soon" placeholder with 4 toggle rows (copper-tinted RN `Switch`); each toggle PATCHes optimistically and rolls back on failure. Server `src/lib/push.ts` checks `notificationPrefs[category] !== false` before fan-out (treats `null`/missing as opted-in, matching the GET defaults).

- **Faster polling for active threads**. The F4 inbox thread polls the messages endpoint every 5s (down from 15s) but **only while focused** — `useFocusEffect` starts the interval on mount/focus and tears it down on blur. A backgrounded thread incurs zero polling cost; push handles the unfocused gap. WebSocket support is intentionally not added (research call: 5s + push covers ~80% of perceived-latency at 5% of the ops cost; WebSocket is gold-plate for v1).

- **EXPO_ACCESS_TOKEN env var**. Added to `.env.example` with documentation. Optional — when set, pushes carry `Authorization: Bearer ${token}` for higher rate limits + receipt support; when unset, anonymous Expo Push still works for development.

- **i18n**. Added `settings.notifMessages*`, `notifInboxRequests*`, `notifMutualSaves*`, `notifEventReminders*`, `notifPermissionDenied` keys for en/de/tr.

- **Auth response unwrap fix**. The mobile `useAuthStore.hydrate`, `fetchMe`, and `signInWithGoogle` were typing `apiFetch<AuthMeResponse>('/api/v1/auth/me')` against a server response that's actually `{ user: AuthMeResponse }`. The login + magic-link paths already destructured `res.user` correctly; hydrate did not, which meant the auth store held a wrongly-shaped object on cold-start sessions. Fixed all three paths to unwrap `.user` so the new push-registration hook (which reads `useAuthStore.user.id` indirectly via the bearer token) can rely on a consistent shape.

Decisions logged:

- **Expo Push over OneSignal/Pusher Beams.** Expo Push is free, requires no FCM/APNS setup beyond the Expo project, and is the path that aligns with the existing SDK 54 stack. The plan notes Hasan's open question on push provider (Q4); shipping Expo Push first matches the recommendation in the plan and keeps the surface area minimal. Migration to a third-party is a single-file swap inside `src/lib/push.ts` if rate limits become a problem.

- **No WebSocket.** Per the milestone plan: 5s foreground polling + push gives WhatsApp-like perceived latency without a sticky-session deploy story. Revisit if Hasan's analytics show >100 simultaneous active threads.

- **`expo-notifications` is the one new dep.** SDK 54 does NOT transitively include `expo-notifications` — verified by checking `mobile/node_modules`. The constraint in `mobile/CLAUDE.md` allows new deps when the spec explicitly approves them; this milestone's spec does. Listed as a documented exception in the commit message.

- **deviceId is mobile-minted, not OS-derived.** A 32-hex SecureStore-persisted UUID gives privacy parity with how iOS apps normally track installs. We deliberately don't use `expo-application.applicationId` or `Device.osBuildId` because those leak across uninstall/reinstall.

- **Foreground push handler set globally.** `setNotificationHandler` lives at module scope in `mobile/src/lib/push/handler.ts` and is called once before the first render. Without it, foreground pushes are silently dropped (RN default since SDK 50) — bad UX for the chat thread case where the user might be on the inbox list when a thread message arrives.

- **`notificationPrefs` defaults treat missing keys as `true`.** Both client and server default-on. A fresh user gets all categories; opting-out is explicit and persists in JSON. Adding a future category is a one-line schema additive change.

Deploy steps for Hasan:

1. **Apply the migration** on the VPS:
   ```bash
   docker exec opsolid-app npx prisma migrate deploy
   ```
   Applies `20260512000000_add_push_devices/migration.sql` (creates `push_devices` + adds `users.notification_prefs` JSONB column). Additive + idempotent (`IF NOT EXISTS` everywhere).
2. **(Optional) Set `EXPO_ACCESS_TOKEN`** on the VPS:
   ```
   EXPO_ACCESS_TOKEN=<expo-access-token>
   ```
   Then `docker compose up -d --force-recreate opsolid` (env_file changes don't apply on `restart` — see `feedback_docker_env_file.md`). Without this, Expo accepts anonymous push requests at a lower rate limit and skips delivery receipts; fine for development, recommended for any non-trivial DAU.
3. APK rebuild via the usual `gh workflow run` — ships the push registration + Settings toggles + 5s foreground polling on the next build. Fresh installs see the OS permission prompt the first time the (app) layout mounts; existing installs see it on next cold-start since the `(app)/_layout.tsx` registration hook hasn't run before.

### M3 — Network growth loops [DONE — committed]

Shipped (2026-05-09):

- **Referral mechanics**. New `Referral` + `ReferralRedemption` Prisma models (migration `prisma/migrations/20260511000000_add_referrals/migration.sql`, hand-written + idempotent). Each user gets a unique 6-char alphanumeric code generated lazily on first `GET /api/v1/referrals/me`. Code generation lives in `src/lib/referrals.ts` with bounded retry + collision recovery. New endpoints `GET /api/v1/referrals/me` (returns code + redemption count + pre-built deep-link `https://opsolid.de/c/?ref=<CODE>`) and `POST /api/v1/referrals/redeem` (body `{ code }`; idempotent on the (referrer, referee) pair via the unique index; self-referral is a silent no-op).
- **Magic-link + password signup hooks**. Both `/api/auth/magic-link/verify` and `/api/auth/signup` read a `verso_ref` cookie post-auth and fire-and-forget `redeemReferral`, then clear the cookie. The cookie is set by the web `SignupClient` from any `?ref=<…>` query param the visitor lands with. Mobile path: the root `_layout.tsx` registers an `expo-linking` listener that captures `?ref=` from initial + runtime deep-links, persists it in a new `usePendingReferralStore` (SecureStore-backed), and the `(app)/_layout.tsx` post-auth hook fires `redeemReferral` once the auth store flips to `authenticated`. Per (referrer, referee) idempotency guarantees a re-mount can't double-count.
- **Public-viewer "Create yours" CTA**. Mobile `mobile/app/(app)/public/[slug].tsx` floats a copper-filled bottom CTA visible only to unauthenticated visitors; tapping it stashes the slug in the pending-referral store and routes to the in-app signup. Web `src/app/c/[slug]/page.tsx` mounts a new `<CreateYoursBanner />` (sticky bottom bar) for non-owner visitors that pings `/api/auth/me` and self-hides for logged-in users. The CTA passes `?ref=<slug>` to the locale-prefixed signup route, where `resolveReferrerByRef()` resolves the slug to the owner's user id and credits the referral.
- **Bidirectional save bookkeeping**. Added `referredByUserId` column on `SavedCard` (no separate model — the existing `status` column accepts the new sentinel value `pending_mutual`). The mirror-row UX is intentionally minimal in v1: when the redeem path runs, the new account's first SavedCard against the inviter's card carries the `referredByUserId` so the existing inbox surface (`GET /api/account/inbox`) can later highlight the row as a "Mutual save request". The "B never confirms" state is benign — the row sits inert at status `new`/`pending_mutual` until either side acts; no scheduled cleanup, since the SavedCard already cascade-deletes with both users. (Spec explicitly allows v1 to keep the surface minimal.)
- **Share telemetry**. New `ShareEvent` Prisma model (`id, sourceCardId, channel, createdAt`) with a `(sourceCardId, createdAt)` composite index. `POST /api/v1/share-events` (bearer-auth, 60/hour) inserts one row per gesture; `GET /api/v1/share-events/summary` returns the last-30-days groupBy-channel aggregate scoped to the requester's owned cards. Mobile fires `link` from the web-link tap, `qr` from the QR-modal open, `native_share` from the OS share-sheet completion. NFC remains a stub channel until the NFC reader path lands. Settings → "Sharing analytics" panel renders a per-channel horizontal bar chart with totals, copper-tinted; the panel auto-hides on a fresh install (404 from summary returns 0 totals → "no events yet" copy).
- **Curated embed whitelist (Carrd amendment)**. `cardData.embeds: Array<{ kind, url }>` (max 3) added to `CardDataSchema`. Allowed kinds: `youtube | vimeo | spotify | soundcloud | calendly`. Mobile `EmbedsSection` (in `CardFormSections.tsx`) accepts a URL, runs the same host-allowlist regex client-side, and persists the kind/url pair. Public viewer **on mobile** intentionally renders embeds as **tappable thumbnail tiles** (YouTube gets the `i.ytimg.com/vi/<id>/hqdefault.jpg` poster; the other 4 hosts render a flat copper-Play tile labeled with the kind) — a real `<iframe>` cannot render in React Native, and `WebView` inside a scrollable list fights gestures + adds a heavyweight memory cost. Tapping the tile opens the source URL in `expo-web-browser` (`openBrowserAsync` falls back to `Linking.openURL` if the in-app browser fails). Public viewer **on web** uses the new `EmbedsBlock` component which derives a known-good iframe `src` per kind from the user's URL (never `srcdoc`, never the raw URL), with `sandbox="allow-scripts allow-same-origin allow-presentation"` + `referrerpolicy="no-referrer"`. The strict server validation + the kind→src derivation function together guarantee an attacker can't smuggle a `javascript:` URL or arbitrary HTML through.
- **Linktree-style template (id 100)**. Registered in `src/config/card-templates.ts` (`slug: "linktree"`, `sectorHint: "creator"`, themeKey `editorial`) and in `src/config/card-template-samples.ts` with a Lina-Park persona that demonstrates the layout intent: avatar + bio + 4 stacked `customButtons`. The template falls back to SmartCard rendering since no v2 component is wired — the look is driven by populating `customButtons[]` instead of contact rows.
- **Gallery lightbox**. `mobile/app/(app)/public/[slug].tsx` — when `cardData.gallery` is non-empty, the gallery section renders 90×90 thumbs in a wrap-row; tapping any thumb opens a `Modal` + horizontal paged `FlatList` lightbox with a tap-to-close X. Pinch-zoom is intentionally out of scope per the spec ("skip pinch-zoom if it adds a dep") — `Modal + FlatList` are RN core primitives, no new third-party deps.
- **i18n**. Added `embeds.*`, `referral.*`, `sharing.*` blocks to en/de/tr in `mobile/src/lib/i18n/locale.ts`, plus `publicCard.embeds`, `publicCard.gallery`, `publicCard.createYours` keys.

Decisions logged:

- **Embed UX on mobile = thumbnails, not iframes.** RN can't render arbitrary HTML/JS without WebView, and a scroll-nested WebView per embed (a) breaks gestures, (b) costs ~30MB RAM each, (c) gives a worse UX than `expo-web-browser` (no full-screen, no native back gesture). Tappable thumbnails open the source in the in-app browser — mobile users get a near-native experience for YouTube/Vimeo/Spotify and the booking flow opens Calendly directly.
- **Bidirectional save — "B never confirms" handling.** The mirror SavedCard row is created by the redeem path and stays at `status="pending_mutual"` until either side acts. Inbox surfaces it as a soft notification (not a blocking action). No scheduled cleanup — the row cascade-deletes with either user account, and a stuck pending mirror is harmless to the data model. Adding scheduled reaping is a 5-minute job for a future sprint when we have data on actual conversion rates.
- **Referral code generation.** 6-char uppercase alphanumeric without `I/O/0` (visually distinct → a code can be read aloud or screenshotted with low ambiguity). The `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` alphabet gives ~32^6 ≈ 1B keyspace; collision retry caps at 6 attempts before falling back to re-reading the existing row (in case we lost a race). Self-referral is silently a no-op rather than an error so the public-viewer CTA can fire on any visitor including the slug owner without an exception bubbling up.
- **No new third-party deps.** `Modal` + `FlatList` for the lightbox; `expo-web-browser` was already in the deps tree for the existing magic-link flow. `expo-linking` was already declared. The web side uses native iframes + a CSS sandbox.

Deploy steps for Hasan:

1. **Apply the migration** on the VPS:
   ```bash
   docker exec opsolid-app npx prisma migrate deploy
   ```
   Applies `20260511000000_add_referrals/migration.sql` (creates `referrals`, `referral_redemptions`, `share_events`; adds `saved_cards.referred_by_user_id` + `saved_cards_status_idx`). Additive + idempotent (`IF NOT EXISTS` everywhere).
2. **No env-var changes required.** All new endpoints are bearer-auth gated via the existing JWT middleware.
3. APK rebuild via the usual `gh workflow run` — ships the EmbedsSection + Settings panels + lightbox + floating CTA + deep-link redeem flow on the next build.

### M2 — Discover at scale [DONE — committed]

Shipped (2026-05-09):

- **`pg_trgm` full-text search**. New migration `prisma/migrations/20260510000000_pg_trgm_search/migration.sql` enables the extension and creates 6 GIN trigram indexes on `card_data->>'<key>'` for `name`, `company`, `title`, `industry`, `city`, `bio`. Hand-written SQL because Prisma's `@@index` annotation doesn't support `gin_trgm_ops`. Plain `CREATE INDEX` (no CONCURRENTLY — Prisma migrations always run inside a transaction; lock window is acceptable at current scale).
- **`GET /api/discover/cards`** rewritten. New `?q=` and `?tag=` params. The `q` path now uses `prisma.$queryRaw` with explicit `ILIKE` clauses across all six trigram-indexed JSONB accessors + `co.contact_name` so the planner picks up the GIN indexes (Prisma's `JsonFilter.string_contains` would fall back to a sequential scan). Cursor pagination preserved by resolving the cursor row's `(published_at, id)` and filtering `< (ts, id)`. The no-search path remains a plain `findMany` (covered by `idx_card_order_country` + the existing visibility composite).
- **`?tag=` filter** uses Postgres JSONB containment: `card_data -> 'tags' @> '["design"]'::jsonb` (raw-SQL path) or Prisma `array_contains: [tag]` JsonFilter (no-search path). No new index — fits in <50ms at current size; revisit at 5k+ cards.
- **`GET /api/v1/discover/suggestions`** — new auth-gated endpoint at `src/app/api/v1/discover/suggestions/route.ts`. Returns top 12 PUBLIC cards excluding the requester's own + already-saved. Scoring weights from spec: `0.3 * recency + 0.4 * mutual_saved + 0.2 * sector_overlap + 0.1 * same_city`. Recency decays linearly over 60 days. Mutual / sector overlap soft-cap at 5 to prevent power-saver dominance. In-memory `Map` cache, 60s TTL per user (revisit at 1k DAU). Cold-start guard: returns empty when the requester has zero signal (no saved cards, no city, no tags) so the mobile rail auto-hides on first install instead of showing a "newest cards" feed under a misleading label.
- **Sector / topic tags**. Canonical 24-slug list in `src/lib/discover/tags.ts` (mirrored on mobile at `mobile/src/lib/discover/tags.ts`). New `cardData.tags: string[]` field validated by `CardDataSchema` (max 5, kebab-case, ≤24 chars). `normalizeTagSlug()` enforces shape on owner-side custom tags.
- **Mobile `TagsSection`** in `mobile/src/components/cards/CardFormSections.tsx`. Chip multi-select from the curated 24-tag palette + custom-slug input. Selected chips are copper-filled with a Check icon; unselected are bg-1 outline. Wired into the edit screen's Gelişmiş tab between `ContactFormSection` and `FeedbackSection`. Saves to `cardData.tags`.
- **Mobile Discover chip strip** above the search bar. Horizontal scrollable, "All" sentinel + 24 curated sectors. Active chip is teal-filled (`teal[500]`); inactive is `bg[2]` outline. Tap → debounce-free re-fetch with `?tag=<slug>`.
- **Search debounce** trimmed from 400ms → **250ms** per spec. Search input wired to the new `q` param via `discoverCards({ q, tag })`.
- **"X results for 'query'" header** above the results list, with a Clear button that wipes both `q` and the active tag chip. 3 message variants (q-only, tag-only, q+tag) localized in en/de/tr.
- **"Tanıyabileceğin kişiler / People you may know / Vielleicht kennst du sie"** section on the Discover tab, between the events rail and the tag chip strip. Horizontal carousel of 12 ~120pt-wide tiles. Auto-hides when the suggestions endpoint returns 0 items (cold-start, auth failure, or 0-score across the candidate pool).
- **i18n**. Added `discover.suggestionsTitle`, `discover.allTags`, `discover.resultsForQuery`, `discover.resultsForTag`, `discover.resultsForQueryAndTag`, `discover.clearSearch` plus a full `tags.*` block with `section`, `hint`, `customPlaceholder`, `add`, and 24 locale-aware `tags.labels.<slug>` strings for en/de/tr. Slugs stay English (network-stable); only the display label varies.

Decisions logged:

- **Suggestions scoring weights** ride the spec exactly (0.3 / 0.4 / 0.2 / 0.1). Mutual-saved is the heaviest signal because LinkedIn's PYMK demonstrates it's the strongest predictor of "actual" connection intent; recency is non-zero so brand-new cards still surface even when they have no graph signal yet.
- **`pg_trgm` extension creation** requires `CREATE EXTENSION` privilege. Our prod uses the default Postgres superuser inside the Docker container — no DBA escalation needed. On managed Postgres providers (AWS RDS, Supabase, etc.) this would need a one-time `rds_superuser` grant, but our self-hosted topology sidesteps that.
- **Chip strip on 0-card sectors**. Tapping a chip whose tag has zero matching cards lands on the existing empty-state copy ("Sonuç yok / No results / Keine Ergebnisse"). The chip itself is NOT hidden — keeping the full palette visible matters more than the friction of a momentary empty state, and the result count in the header (`0 results in Music`) is honest. We may add a "{slug}-empty" hint at M3 ("Be the first {sector} on Verso") but it's gold-plate for M2.
- **No new third-party deps**. The full-text search is pure raw SQL; the suggestions scoring is pure JS. Mobile got two new local module files (`mobile/src/lib/discover/tags.ts` + section component) — no new package additions.

Deploy steps for Hasan:

1. **Apply the migration** on the VPS:
   ```bash
   docker exec opsolid-app npx prisma migrate deploy
   ```
   This runs `20260510000000_pg_trgm_search/migration.sql` — additive + idempotent (uses `IF NOT EXISTS`). Safe to apply with the app live; brief lock per `CREATE INDEX` (~ms at 16 rows). The `CREATE EXTENSION` call needs superuser on the connection string; our default container Postgres connection is already superuser, so no extra setup.
2. **No env-var changes required**. Suggestions endpoint is auth-gated via the existing bearer-only middleware; no new secrets.
3. APK rebuild via the usual `gh workflow run` — ships the chip strip, suggestions rail, and TagsSection on the next build. Owner cards saved before M2 will simply have `cardData.tags === undefined`; the chip-strip filter still works (those cards just don't match any sector tag).

### M1 — Frictionless creation [DONE — committed]

Shipped (2026-05-09):

- **Onboarding Step 0** in `mobile/app/(app)/onboarding/index.tsx` — three big tap-cards (Manuel / Kartvizit tara / URL'den oluştur) before the existing photo step. Manual hands off to the legacy 5-step flow; Scan + URL fast-forward to Step 5 (preview + publish) with the form pre-filled. Step 5 grows inline editors when origin is `scan`/`url` so the user can correct any pre-filled value before publishing without bouncing through Steps 1–4.
- **`onboardingDraftStore`** gained `step: 0`, `origin`, `company`, `website`, `bio` fields. Guard flags (`skipped` / `everPublished`) untouched — the auto-redirect logic in `(app)/_layout.tsx` is unchanged.
- **Server endpoints**:
  - `POST /api/v1/cards/draft-from-image` — body `{ imageBase64 }`, calls Google Cloud Vision `documentTextDetection`, parses with regex/heuristics, returns `{ name?, title?, company?, email?, phone?, website?, raw_ocr_text }`. 503 `ocr_not_configured` when `GOOGLE_CLOUD_VISION_API_KEY` unset. Bearer-auth, 10/hr/user.
  - `POST /api/v1/cards/draft-from-url` — body `{ url }`, server-side fetch (5 s timeout, 1 MB cap), strip HTML, send first 4000 chars to Claude Haiku, returns `{ name, title, company, email, phone, website, bio }`. 503 `ai_not_configured` when `ANTHROPIC_API_KEY` unset. Bearer-auth, 10/hr/user. No SDK dep — plain `fetch` against `/v1/messages` REST.
- **Carrd amendment — Form-builder-lite**: new `cardData.contactForm` shape (`enabled`, `fields[1..5]`, `submitLabel`, `esps.{mailchimp,mailerlite,webhook}`). Server `validation.ts → CardDataSchema` accepts it as part of `cardData` so it round-trips through PATCH `/api/v1/cards/[id]`. Mobile `ContactFormSection` lives on the edit form's Gelişmiş tab. Public viewer's `LeadFormModal` reads the shape and renders custom fields when `enabled === true`.
- **Lead-form ESP integration**: `src/app/api/cards/[slug]/lead/route.ts` now forwards each successful submission to the configured ESP / webhook in addition to the existing email + Telegram + dispatchWebhook paths. `src/lib/lead-esp.ts` wraps Mailchimp / MailerLite / generic webhook with 5 s timeouts and Promise.allSettled. Backward-compatible — cards with no `contactForm` keep the legacy notification path intact.
- **Public-API security**: `toPublicApiCard` in `src/lib/api/v1/card-mapping.ts` now strips `cardData.contactForm.esps.*.apiKey` and `cardData.contactForm.esps.webhook.url` so visitors never see ESP secrets.
- **i18n**: `crm.contactForm.*`, `onboarding.step0*`, `onboarding.step5HintReview`, scan/url error keys for en/de/tr.
- **`.env.example`**: documented `GOOGLE_CLOUD_VISION_API_KEY` and `ANTHROPIC_API_KEY` (both optional — features degrade to 503 when unset).

Decisions logged:

- **Mobile camera path** uses `expo-image-picker.launchCameraAsync({ base64: true })` instead of adding `expo-camera` because the constraint forbade new mobile deps. The system camera UI provides framing guides; we don't render a custom rectangle overlay.
- **`libphonenumber` not added** — not in repo deps and it's a heavy library; the OCR phone heuristic uses a tolerant regex (≥7 digit, ≤16 digit) which is fine for owner-side review.
- **Anthropic SDK not added** — the `/v1/messages` REST call is one POST; pulling in a 1.5 MB SDK for a single endpoint is the wrong trade-off.

Deploy steps for Hasan:

1. **No DB migration needed** — `cardData` is already a JSON column; the new `contactForm` shape rides through the existing `CardDataSchema` zod check and the existing PATCH route accepts it without further server changes.
2. **Set env vars on the VPS** (both optional — endpoints return 503 cleanly when missing):
   ```
   GOOGLE_CLOUD_VISION_API_KEY=<gcp-vision-api-key>
   ANTHROPIC_API_KEY=<anthropic-console-key>
   ```
   Then `docker compose up -d --force-recreate opsolid` (env_file changes don't apply on `restart` — see `feedback_docker_env_file.md`).
3. APK rebuild via the usual `gh workflow run` — Step 0 ships in the next build; manual flow keeps working without a new deploy.

### Carrd comparison plan — 2026-05-09

3. **`mobile/assets/carrd-comparison-plan.md`** — research-scout audit of Carrd.co (one-page site builder, $9–$49/yr) vs Verso. Verso wins on mobile-first creation, NFC/QR/vCard share, smart-exchange, inbox messaging, Discover/Events network, 96 curated templates, EU-native hosting. Carrd wins on free-form composition, form builder + 18 ESP integrations, embed-anything, password protection, HTML export. **Adopt** 7 of 8 gaps into M1/M3/M5 (form-builder-lite + ESP webhooks → M1; curated embed whitelist + linktree template + gallery lightbox → M3; password protection + HTML export + Stripe tip-button + custom-domain wizard → M5). **Reject** free-form composition (kills the curation moat) and A/B variants (solo-dev tax). **No M7 needed** — splintering Form/Password/Embeds would compete with M3 and M5 for the same hours. Pricing: hold Verso Pro at **€7/mo / €60/yr** — same annual ballpark as Carrd Pro Plus but for a richer surface. External one-liner inside the file.

### Pickup prompt for the next session

> "Verso is feature-complete through Sprint F4. The strategic plan in `mobile/assets/world-class-milestone-plan.md` lists six milestones; M1 (Frictionless creation) is next. Read both world-class docs, answer the five open questions Hasan flagged in the plan (or note Hasan's answers in chat), then produce `mobile/assets/m1-implementation-plan.md` — a file-and-line implementation brief like the prior `edit-experience-brief.md`. After Hasan reviews M1, dispatch a maker agent."

## Done — installed via APK build #21 (commit `1c25bd2`)

### Sprint 0–4 — earlier session (build #13)
See git log between `9964d4f` and `45ccf99`. Sprint 0 (crash fix), Sprint 1 (public viewer, QR, share), Sprint 2 (owner edit form), Sprint 3 (96 templates + layout/theme/QR pickers), Sprint 4 (services/CTAs/FAQs editors), Inbox UX rework, keyboard fix.

### Sprint 5 — Auth + Verso branding (commit `cf914e4` and earlier)
- Stable signing keystore (GitHub secret `KEYSTORE_BASE64` + `KEYSTORE_PASSWORD`) so all installs are `adb install -r` (login preserved).
- Verso branding: app display name "Verso", icon, splash, Aegean palette, EN/DE/TR copy.
- CRM features: lead form bottom sheet, smart exchange button, 7-category feedback rating modal, status banner. Server endpoints `src/app/api/cards/[slug]/{lead,exchange,feedback}/route.ts`.

### Sprint F1 — Discover seed (commit `2a66429`)
- 96 template preview PNGs generated via `scripts/generate-template-previews.ts`. Bug fix: `src/app/dev/template-preview/[slug]/page.tsx` server→client component (RSC was 404'ing 95/96 templates).
- 16 demo public cards seeded on prod (Musk, Gates, Cook, Nadella, Pichai, Huang, Sandberg, Jobs + 8 DACH/EU SME personas).

### Sprint F5 — Settings expansion (commit `932ecd8`)
- Theme picker: Light / System / Dark, default = `light`. Persists in `expo-secure-store` under `verso.themeMode`. Store: `mobile/src/lib/theme/themeStore.ts`. `ThemeProvider` reads from store; consults `useColorScheme()` only when `mode === 'system'`.
- Locale picker: EN / DE / TR override. Persists under `verso.localeOverride`. Store: `mobile/src/lib/i18n/localeStore.ts`. `detectLocale()` consults override first, falls back to OS.
- About panel: version + build + platform via `Constants.expoConfig`, "What's new" modal.
- Settings layout: Account → Appearance → Language → Notifications → Privacy & Data → About.
- `lightTheme.bg[1]` warmed `#FAFAF7` → `#F9F6F0`.

### Sprint 6 — Edit-experience overhaul (commit `96df346`)
- 3-tab segmented control on edit/create: **Profil / Tasarım / Gelişmiş**. Each tab independently scrollable. Save logic unchanged.
- Template picker: vertical 3-col grid → horizontal carousel (no nested-scroll fight). New `mobile/app/(app)/cards/template-preview.tsx` — full-screen pageable preview, Apply/Cancel.
- New `mobile/src/store/templatePickerStore.ts` — one-shot Zustand atom for picked template id.
- Live preview FAB (Tasarım tab only): teal Eye icon at bottom-right → WebView Modal renders `${API_BASE}/c/${slug}?preview=1&layout=...&theme=...&primary=...&accent=...`.
- Brand color split mini-card chip (60+40 px split rectangle) replaces 36px circular swatch.
- StatusBanner schema reconciliation: `src/lib/validation.ts` now accepts both `cardData.statusBanner` (4 tones: info/success/warn/announce, mobile shape) AND legacy `cardData.statusMessage` (3 tones). Public viewer prefers `statusBanner`, falls back to `statusMessage`.
- New dep: `react-native-webview 13.16.0`.

### Repeater shape mapping fix (commit `108b098`)
- Mobile `cleanServices` / `cleanCustomButtons` / `cleanFaqs` now map UI keys (`price` / `url` / `question` / `answer`) to server canonical keys (`priceLabel` / `href`+`style` / `q` / `a`). Sprint D was silently failing saves with shape mismatch → "yüklemedi" alerts.
- Edit re-hydration reads BOTH server keys and legacy UI keys.
- ScrollView `paddingBottom: 48 → 160` in create + edit so the trailing form fields aren't clipped.

### Sprint 7 — Icon v5 + card-deck + onboarding + brand header (commit `931d77c`)
- **Icon v5 "Add Contact"**: white person silhouette + dominant white + on solid teal `#1AA6B7`. Files: `mobile/assets/icon.png`, `adaptive-icon.png`, `icon-v5-add-contact.svg`. `app.json` `adaptiveIcon.backgroundColor` flipped to `#1AA6B7`, splash background to match.
- **Animated card-deck on `/cards`**: 5:3 brand-banded tiles, 4-deep stagger (translateY=i*10, translateX=i*7, scale=1-i*0.04, opacity=1-i*0.15), mount via `withDelay(i*60, withSpring())`. Single `isFanned: SharedValue<boolean>` drives fan-out animation. 10+ cards switches to flat `CardDeckList`. Replaces the screen-header `+` with a 64pt teal **CardDeckFAB** (pulsing only when 0 cards).
- **5-step onboarding wizard** at `mobile/app/(app)/onboarding/index.tsx`: Photo → Name+Title → Phone/Email/WhatsApp chip → Template picker (ids 1/6/14/84) → Preview+Publish. Single-file state machine. Reanimated slide+fade transitions. Top progress bar (5 teal segments).
  - `mobile/src/store/onboardingDraftStore.ts` — Zustand atom + SecureStore persistence. `skipped` and `everPublished` flags survive restarts. Auto-redirect from `(app)/_layout` when `listCards({limit:1})` returns 0 AND neither flag is set.
- **BrandHeader** in My Cards / Discover / Contacts / Inbox / Settings: 24×24 teal disc with `lucide.Plus`, "Verso" semibold 16pt, italic copper "by OpSolid" 11pt @ 0.55 opacity.
- New files: `CardDeckTile.tsx`, `CardDeck.tsx`, `CardDeckFAB.tsx`, `CardDeckEmpty.tsx`, `CardDeckList.tsx`, `BrandHeader.tsx`, `onboardingDraftStore.ts`, `(app)/onboarding/index.tsx`.

### Black-screen fix (commit `1c25bd2`)
- `mobile/app/_layout.tsx`: replace `if (status === 'idle' || status === 'loading') return null` with a teal+spinner fallback so users see the app is alive. The 10s safety timer now also calls `useAuthStore.getState().setUser(null)` to flip status to `'unauthenticated'` if hydrate stalls — deterministic recovery.

## Pending — sprints to ship next

These are the remaining high-value tracks on the roadmap. Hasan asked the assistant to **proceed autonomously** — do them in this order without waiting for review.

### Sprint F2 — Events / Fairs feature [DONE — committed]
Shipped:
- Prisma `Event` + `EventAttendee` models, migration `20260509000000_add_events`.
- Server endpoints `GET /api/v1/events`, `GET /api/v1/events/[slug]`, `POST /api/v1/cards/[id]/events`. Past-events filter: `endAt >= now() - 24h`. List capped at 50.
- `card-mapping.ts` exposes `attendingEventIds: string[]` on owner GET (stripped from `toPublicApiCard`).
- Mobile: 6th tab "Events" between Discover and Contacts (lucide `CalendarDays`). Screens at `(app)/events/index.tsx` (list) + `(app)/events/[slug].tsx` (detail + 3-col attendee grid). API client `mobile/src/lib/api/events.ts`.
- `EventCover` component (initials gradient fallback when `coverPath === null`).
- Discover tab: horizontal rail above search, `listEvents({limit:6})`, see-all link → `/(app)/events`.
- `EventsAttendingSection` chip multi-select on edit form Gelişmiş tab. Edit screen sends `eventIds: string[]` to `POST /api/v1/cards/:id/events` after the main PATCH, only when the chip selection changed.
- Seed `scripts/seed-events.ts` — 4 events (DMEXCO, Bits & Pretzels, Webrazzi Zirvesi, IHM) with the spec'd demo attendees. Idempotent upsert by slug.
- i18n: `events.*` + `discover.upcomingEvents/seeAllEvents` keys for en/de/tr.

Deploy steps for Hasan:
1. `docker exec opsolid-app npx prisma migrate deploy` (applies `20260509000000_add_events`).
2. `docker exec opsolid-app npx tsx scripts/seed-events.ts` (after seed-public-cards has run; resolves attendee slugs to ids).

### Sprint F3 — Contacts seed + UX [DONE — committed]
Shipped (commit `ceff85e`):
- Server endpoint `POST /api/v1/contacts/sample-seed` — bearer-gated, idempotent on `SavedCard` composite unique. Default seeds 5 slugs: `christine-mueller`, `markus-schmidt`, `aylin-yildiz`, `mehmet-aydin`, `tobias-bauer`.
- Empty Contacts state now shows a teal `UserPlus` CTA — "Tanıdığım kişileri ekle" / "Add sample contacts" / "Beispielkontakte hinzufügen". Tap → seeds 5 cards → `Alert("{n} örnek eklendi")` → CTA disappears.
- `mobile/src/store/contactsRefreshStore.ts` — Zustand `dirty: boolean` hint. `public/[slug].tsx` `toggleSave` calls `markDirty()` after save/unsave; Contacts tab uses `useFocusEffect` as primary refresh, dirty bit as belt-and-braces.
- Saved-contact model is `SavedCard` (NOT `CardConnection`) — important for any future contacts work. `SavedCard { userId, cardOrderId, notes, tags, metWhere, followUpAt, status, starred }` is what `POST /api/cards/[slug]/save` already uses.

### Sprint F4 — Inbox messaging thread [DONE — committed]
Shipped:
- Prisma `Message` model on `CardConnection` (id, connectionId, senderUserId, body, sentAt, readAt) + inverse relations on `User` and `CardConnection`. Migration `20260509120000_add_messages` (hand-written, matches the events migration style).
- Server endpoints `GET /api/v1/connections/[id]/messages` + `POST /api/v1/connections/[id]/messages` (bearer-auth, rate-limited, side-channel `readAt = now()` on read for the OTHER side's unread rows).
- GET response also returns `other` (avatar/name/title/company of the OTHER side) + `pendingAction` (latest pending CardAction the requester is the receiver of) so the thread header is one round-trip.
- `/api/account/inbox` enriched additively with `connectionId`, `lastMessage`, `unreadCount` per row. Connections are lazily upserted when the inbox encounters an action whose pair has no connection yet (existing rows untouched). Wire shape is purely additive — old clients keep working.
- Mobile thread view at `(app)/inbox/[connectionId].tsx`: bubbles (teal mine / `bg[2]` theirs), KeyboardAvoidingView composer, optimistic send + refetch, 15s polling, accept/decline pill when a pending action exists. Inbox row tap → `/(app)/inbox/[connectionId]`. Renamed `inbox.tsx` → `inbox/index.tsx` so expo-router can host both list + detail under the same tab.
- API client `mobile/src/lib/api/messages.ts` — `listMessages` + `sendMessage`.
- Inbox row badge: `unreadCount` shown as a teal pill next to the status dot. Last-message preview replaces the action message when present.
- i18n: `inbox.thread.*`, `inbox.send`, `inbox.empty_thread.*` keys for en/de/tr.

Deploy steps for Hasan:
1. `docker exec opsolid-app npx prisma migrate deploy` (applies `20260509120000_add_messages`).

### Sprint F-Polish (lower priority)
- Save catch in `mobile/app/(app)/cards/edit/[id].tsx` line 377 still says `t.errorLoad` (could not load) on save errors. Add `cards.errorSave` i18n key and use it.
- Consider migrating from RN core `Vibration.vibrate` to `expo-haptics` for the card-deck press feedback. One file change in `CardDeckTile.handlePressIn`.

## Deferred (low value vs cost)
- Apple Wallet / Google Wallet passes
- Custom domains
- Album moderation (pending visitor photos)
- Push notifications (unless Sprint F4 forces it)

## Build & Deploy state

| # | Trigger | Includes | Status |
|---|---|---|---|
| android-build-13 | `45ccf99` | Sprint 0–4 + Inbox UX | installed |
| android-build-16 | `2ae4958` | keystore-only | installed (final uninstall→reinstall) |
| android-build-17 | `f100574` | Verso branding (compass) | installed -r |
| android-build-18 | `d4165d2` | Sprint D CRM features | installed -r (had save shape bug) |
| android-build-19 | `cf914e4` | Verso v3c compass icon + Sprint D server live | installed -r |
| android-build-20 | `96df346` | Sprint F5 + bug fixes + Sprint 6 edit overhaul | installed -r → BLACK SCREEN regression |
| android-build-21 | `1c25bd2` | Sprint 7 (icon v5 + deck + onboarding + brand header) + black-screen fix | **installed -r** (phone Dozing during verify) |
| android-build-22 | `e46038d` | Sprint 7 + black-screen fix + F2 + F3 + F4 (everything through commit `e46038d`) | **built, awaiting install** (phone disconnected from ADB-WiFi) |

## Operating notes (read first when picking up work)

- Stable keystore is in GitHub Secrets (`KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`). Local backup at `~/.opsolid/opsolid-release.keystore` on the maintainer machine. **Never re-generate** without rotating both — every installed app would need uninstall.
- Repo conventions: read `mobile/CLAUDE.md` first. Conventions enforced: SDK 54 stack pinned, no New Architecture, lucide v1.14 brand-icon fallbacks, `expo-image-picker` v17 `mediaTypes: ['images']`, `expo-contacts` v15 plain string labels.
- Build trigger: `gh workflow run "Build & Release Android APK" --repo drpiha/opsolid-website --ref main`. Cold cache 30–40 min, warm 20 min. Output: `android-build-N` GitHub Release with `opsolid-android-0.1.0-bN.apk` (~108 MB).
- Server deploy: `deploy.ps1` from local Windows works but its PowerShell stderr handling is brittle; if it errors out mid-build, the VPS-side `nohup docker compose up -d --build opsolid > /tmp/deploy.log 2>&1 &` recovery is documented in commit messages.
- Seed-public-cards: prod DB seed needs `docker exec -u 0 opsolid-app mkdir -p /app/scripts && docker cp /opt/opsolid-website/scripts/seed-public-cards.ts opsolid-app:/app/scripts/seed-public-cards.ts && docker exec opsolid-app npx tsx scripts/seed-public-cards.ts`. Sandbox blocks remote writes — Hasan runs this from his terminal.

---

*Generated via collaboration with Claude Code agents. The maintainer (Hasan Dönmez) is the only human in the loop.*
