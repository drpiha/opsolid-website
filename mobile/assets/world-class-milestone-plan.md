# Verso — World-Class Milestone Plan

> Author: product-architect agent. Date: 2026-05-09. Codebase head: `e46038d` (F4 shipped, build #22 awaiting install).
> Note: `world-class-research.md` was not present at write time. Plan is grounded in the agent's market knowledge of HiHello, Popl, Mobilo, Linq, Blinq, Beaconstac, V1CE, Dot, and Wave. Re-validate competitive bullets in milestone risks once the research file lands.

---

## TL;DR (5 lines)

1. The DBC category is full of plastic-NFC-card resellers with thin apps. Verso wins by being the only **premium, design-first, Europe-native** product whose card you'd actually pay to send — and whose owner-side app feels like Linear, not a SaaS form.
2. Six milestones, each ~2–3 weeks solo. Order: Frictionless creation → Discover at scale → Network growth loops → Real-time comms → Premium tier → Beyond EN/DE/TR. Each unlocks the next.
3. Three explicit ship-NOTs: NFC-plastic-card SKU, marketplace-of-templates, enterprise SSO. Each protects the design moat or the founder's time.
4. Free tier stays generous (1 card, all 96 templates, basic CRM). Pro tier (~€7/mo) unlocks multi-card, custom domain, advanced analytics, AI assist.
5. Resume this work by reading the "Next-session resume" block at the bottom — it names the exact next file to touch.

---

## A. The product thesis (in two sentences)

Every existing DBC app is built like a conference giveaway: cheap, generic, marketed to sales reps. **Verso is built like a portfolio piece** — a card a German architect, a Berlin agency lead, or a Munich solo consultant would actually be proud to send, with 96 editorial templates and a card detail page that competes with Cargo or Read.cv on its visual quality. The OpSolid angle: built by one engineer in DACH with no growth team, no sales motion, no inflated metrics — the app says no to plastic NFC SKUs, no to AI-marketing-fluff, and yes to design-grade craft that scales by referral, not by ads.

---

## B. Six milestones

Each milestone is sized to ~2–3 weeks of solo dev (fits a single APK release). Acceptance criteria are testable on the phone or via `curl` against `opsolid.de`.

---

### M1 — Frictionless creation (sub-30s card)

**Goal:** A new user installing the APK from a Discover share-link reaches a published card in under 30 seconds without typing a single full sentence.

**Acceptance criteria**
- New install + Google sign-in + onboarding wizard → published card in ≤30s on a midrange Android (S22) over 4G. Measured via in-app `Performance.now()` between `auth.success` event and `cards.create.success`.
- Onboarding step 1 (photo) offers two paths: gallery (existing) and **OCR scan of a paper business card** (new) producing pre-filled name/title/email/phone with ≥85% accuracy on a 30-card test deck (wired into `mobile/scripts/`).
- Step 2 offers an "AI draft from LinkedIn URL or company website" button — paste URL, server fetches OG metadata + first H1/h2, returns a draft (name, title, company, bio of ≤140 chars). Success rate ≥70% on top-200 European tech companies.
- Onboarding wizard auto-saves to `onboardingDraftStore` after each step (already partly wired) — closing the app and reopening resumes within 200ms. No regression on Sprint 7 black-screen fix.
- Skip rate on each step is logged via a new `OnboardingEvent` table (`step`, `skipped`, `durationMs`). Funnel visible at `/api/admin/onboarding-funnel`.

**Critical path**
1. Server: new `OnboardingEvent` Prisma model + migration `20260512_add_onboarding_events`.
2. Server: new `POST /api/v1/scrape/business-card` (Tesseract.js or AWS Textract — pick one in M1 risk).
3. Server: new `POST /api/v1/scrape/profile-url` (server-side fetch + cheerio + heuristic; Anthropic Claude Haiku as fallback when heuristics fail).
4. Mobile: extend `mobile/app/(app)/onboarding/index.tsx` step 1 with two-tab "Gallery / Scan card" sheet. New `mobile/src/lib/api/scrape.ts`.
5. Mobile: new `MicroPerf` instrumentation hook → POSTs duration to `/api/v1/onboarding/event`.

**Risks**
- *AWS Textract is overkill for OCR (€1.50/1000) but Tesseract.js inside a Node container has 30%+ word error on glossy cards.* **Mitigation**: ship Tesseract first, log accuracy via the funnel, swap to Textract only if accuracy <70%. Compare costs: AWS Textract €1.50/1000 vs **Google Cloud Vision** €1.50/1000 — same price, GCV slightly better on EU languages.
- *AI scrape gets a server tied to Anthropic — single-vendor risk.* **Mitigation**: abstract the scrape provider in `src/lib/scrape/provider.ts` with an `IScrapeProvider` interface; ship Claude Haiku, swap to **OpenAI gpt-4o-mini** if costs spike.

**What it unlocks**
A new user has a real published card in 30s — every other milestone (Discover, growth, premium) compounds on top of "got a finished card to share." Without M1, every funnel step downstream loses 30%+.

---

### M2 — Discover at scale (search + filters + suggestions)

**Goal:** A user searching for "Berlin product designer" finds 5+ relevant cards in <1s; a user with 0 contacts gets 5 reasonable suggestions on the Contacts empty state.

**Acceptance criteria**
- `GET /api/v1/discover/search?q=Berlin+designer&sectors=design&city=berlin&limit=20` returns Postgres full-text-search results in <500ms p95 (warm cache). Index: `pg_trgm` on `cardData->>'name'`, `cardData->>'jobTitle'`, `cardData->>'company'`, `cardData->>'bio'`.
- New `Discover` filter chips: sector (matches `CardTemplate.sectorHint`), city (free text), "Open to networking" (existing `cardData.openToNetworking`). Filters update results within 250ms typing debounce.
- "People you may know" rail on Contacts empty state and Discover top: pulls from server endpoint `GET /api/v1/discover/suggestions?cardId=<my>` which scores other public cards by: shared event attendance (×3), shared sector (×2), same city (×2), shared `cardData.industry` keyword (×1). Returns top 5.
- "People you may know" rail also appears as a one-time post-onboarding sheet ("Find your colleagues on Verso") with skip option that doesn't show again.
- Empty Discover (no query) shows: trending events rail (already shipped) + "New on Verso" rail (last 10 published cards) + sector-shortcut chips.

**Critical path**
1. Postgres: enable `pg_trgm` extension + create indexes via migration `20260519_add_discover_indexes` (Prisma raw migration — Prisma's `@@index` doesn't support `gin_trgm_ops`).
2. Server: rewrite `GET /api/v1/discover` to accept query+filter params; existing endpoint already returns paginated cards.
3. Server: new `GET /api/v1/discover/suggestions` — scoring SQL co-located in `src/lib/discover/suggestions.ts`.
4. Mobile: extend `mobile/app/(app)/discover.tsx` with chip filter bar above the existing search input. Reuse `mobile/src/lib/api/discover.ts`, add filter params.
5. Mobile: new `SuggestionsRail` component, mounted in Contacts empty state next to existing `seedCta`.

**Risks**
- *FTS scoring drift — at 100 cards every query feels good; at 10K cards "Müller" matches 200 people.* **Mitigation**: add `ts_rank_cd` weighting (name × 4, company × 2, bio × 1); add deterministic tie-breaker on `cardData.openToNetworking DESC, createdAt DESC`.
- *Suggestions feel creepy if they leak data the user didn't expect to be in Discover.* **Mitigation**: only score over cards with `visibility = 'PUBLIC'`. Unlisted/private cards never enter the candidate set, even if event-co-attendance would otherwise pair them.

**What it unlocks**
The growth loops in M3 require a population the user can browse. Without Discover-at-scale, the network is just "the 8 demo cards Hasan seeded." Also unlocks paid-tier "advanced search" gating in M5.

---

### M3 — Network growth loops (referrals, smart-exchange, link telemetry)

**Goal:** A published card spreads on its own — every share generates a measurable second-order signup or save.

**Acceptance criteria**
- New `ReferralLink` Prisma model: `id, ownerCardId, code (8-char), createdAt, clicks Int, signups Int`. `GET /c/<slug>?ref=<code>` increments `clicks`; signup attributable via cookie set on first visit.
- "Invite a friend" CTA on Settings → Account: tap → generates a personal referral link, opens the OS share sheet. On settle, the recipient's first card published gives the referrer a "Verso badge: Founding Network Member" (cosmetic; surfaced on owner card if `cardData.badges` includes it).
- Smart Exchange (already shipped server-side) gets two behaviors: **bidirectional auto-save** (when A sends card to B, A is offered "Save B's card too?" with one tap) AND **outcome telemetry** (track whether a smart-exchange led to a contact-save within 24h; surface aggregate to card owner as "Of the 12 people you exchanged with this month, 7 saved you back").
- Link-share telemetry: every share via `Share.share()` from the public viewer logs a `ShareEvent` (medium: WhatsApp/iMessage/Email/Other from the iOS sheet — Android is "intent" only). Aggregate appears in card owner's "Insights" tab in M5.
- Public viewer (`mobile/app/(app)/public/[slug].tsx` + `src/app/c/[slug]/page.tsx`) gets a small "powered by Verso — make your own" footer link, only when visitor doesn't have an account. Link uses the card owner's referral code.

**Critical path**
1. Migration `20260526_add_referrals` — `ReferralLink` + `ShareEvent` tables.
2. Server: middleware on `/c/[slug]/page.tsx` to read `?ref=` cookie, attribute on signup.
3. Server: `GET /api/v1/referrals/me` (own code + counts).
4. Mobile: Settings → Account → "Invite friends" row + share sheet hook.
5. Mobile: bidirectional save sheet on `crm/exchange.ts` success callback — reuse the existing `Save Contact` flow.
6. Web: footer attribution on public card pages — cookie set + `ref=` param.

**Risks**
- *Referral codes get abused by farms creating fake signups for the badge.* **Mitigation**: badge requires the referee's card to have `views >= 5` AND `cardData.profilePhoto != null` before it counts. Cheap signal, hard to fake at zero cost.
- *Powered-by footer feels tacky on a premium-positioned product.* **Mitigation**: only render for non-Verso visitors (no session cookie); use the same Instrument Serif italic copper "by OpSolid" mark from `BrandHeader` — feels like attribution, not advertising.

**What it unlocks**
First non-Hasan-driven user acquisition. Also creates the ROI story for M5's Pro tier ("upgrade to see who shared your card").

---

### M4 — Real-time communication (push + websocket inbox)

**Goal:** A user receives a meeting request push within 5 seconds of the sender tapping "Send" — and the inbox thread updates without polling.

**Acceptance criteria**
- Push notifications wired via Expo Notifications (already in SDK 54). Server stores `PushToken { userId, token, platform, lastUsedAt }` model. New events trigger push: new inbox action, new inbox message, accepted-connection, mention in a thread.
- Push delivery p95 ≤5s from server emit → device banner. Measured by a synthetic e2e test against the dev APK.
- WebSocket replaces 15s polling on `(app)/inbox/[connectionId].tsx`. Server upgrades the existing `/api/v1/connections/[id]/messages` endpoint with a parallel `WS /ws/connections/[id]` channel (Next.js 14 + `ws` library, mounted via custom server at `/server.ts` — or stick with polling and only change the cadence to 5s if the WebSocket cost is too high; see risk #1).
- Notification settings panel in Settings: master toggle + per-category (messages, connection requests, accepted, weekly digest). Persists on server (`User.notificationPrefs` JSONB).
- Voice notes (optional, defer to v2): record up to 60s, store as `Message.attachmentUrl`, play in thread. **Defer this from acceptance criteria** — see "Out of scope" / Risk #2.

**Critical path**
1. Migration `20260602_add_push_tokens` + `User.notificationPrefs` JSONB column.
2. Server: APNS + FCM credentials in env (Hasan owns both — Expo can proxy via EAS, but for self-hosted we need direct FCM; Expo Push API is simpler at €0/month vs **OneSignal** at €0/10K MAU vs **Pusher Beams** at €25/month for 1K device tokens — Expo Push is the right call).
3. Server: emit-on-event hooks in `POST /api/v1/connections/[id]/messages` and `POST /api/cards/[slug]/{connect,send-card,quote,meeting}`.
4. Mobile: register push token on app open after auth; store in `mobile/src/lib/push/register.ts`.
5. Mobile: `mobile/app/(app)/inbox/[connectionId].tsx` reactive subscription. Choose WebSocket OR 5s polling based on M4 risk #1.
6. Mobile: settings panel additions; reuse `Settings → Notifications` placeholder from F5.

**Risks**
- *WebSocket on the existing single-Docker-container deploy means sticky sessions, reconnect logic, and a new failure mode (idle disconnect after VPS restart).* **Mitigation**: ship 5s polling first (one-line change in `inbox/[connectionId].tsx`), add WebSocket only if Hasan's analytics show >100 active threads (a thread is "active" if both sides have sent in last 10 min). Threshold gives 6 months runway. Compare alternatives: **Pusher Channels** €49/mo for 100 connections vs **Ably** €25/mo for 200 — both make sense at scale, but ship polling first.
- *Voice notes pull in `expo-av` and storage costs (Cloudflare R2 vs S3) — adds a week and a bug surface.* **Mitigation**: defer voice notes to a separate sprint after M5. Acceptance criteria above already drop them.

**What it unlocks**
The inbox stops feeling like email and starts feeling like WhatsApp. Critical for daily-active retention — currently the F4 inbox needs the user to open the tab to know about a new request.

---

### M5 — Premium tier surface area

**Goal:** Verso has a paid plan worth €7/month that doesn't make the free tier feel crippled and doesn't require a sales call.

**Acceptance criteria**
- Pricing decision (locked): **Free** = 1 card, all 96 templates, basic analytics (last 30 days, total views), all CRM (lead form, smart-exchange, feedback), all Discover, all events. **Pro** (€7/mo or €60/yr) = up to 5 cards, custom domain (`yourname.com → /c/yourname`), advanced analytics (90 days, geographic heatmap, share-medium breakdown, referral telemetry from M3), AI draft regeneration unlimited (free tier: 3/month from M1), CSV export of contacts/leads, priority support email.
- New `Plan` enum on `User` (`FREE | PRO`) — store on user, NOT on CardOrder (a user can have 1 Pro account with 5 cards on it). Existing `Subscription` model extends to `userId` instead of `orderId`. Migration adds `userId` and backfills `null` for legacy paid one-time orders.
- Upgrade flow: in-app `Settings → Plan`. Tap → opens Stripe Checkout via existing `/api/checkout` route adapted to recurring. Magic-link return → app redeems via existing webhook.
- Free-tier 2nd-card creation hits a paywall sheet (clear "5 cards on Pro" copy, not a wall of features). Cancel → user stays on existing card. Upgrade → Stripe Checkout.
- All Pro features are gated by a single helper `isPro(user)` in `mobile/src/lib/billing/plan.ts` — never check `subscription.status` directly.

**Critical path**
1. Migration `20260615_add_user_plan` — `User.plan` enum + `User.planActiveUntil` DateTime; rewire `Subscription.userId`.
2. Server: extend `/api/checkout` and `/api/webhooks/stripe` to handle user-level subscriptions (existing handles per-card-order). Use the existing `stripeYearlyPriceId`/`stripeMonthlyPriceId` columns on `CardTemplate` for one-time templates **separately** — the Pro plan is a new Stripe Product (price IDs in env).
3. Server: gate routes — `/api/v1/cards POST` checks `user.cardCount < 1 || isPro(user)`. Custom-domain routing already exists in deferred-todos; gate behind plan.
4. Mobile: paywall sheet component `mobile/src/components/billing/PaywallSheet.tsx`; mounted at the create-card path.
5. Mobile: Settings → Plan row + upgrade flow via `WebView` of Stripe Checkout (already a pattern in the app).
6. Mobile: AI usage counter in `onboardingDraftStore` — increments on M1 scrape calls; gates on free.

**Risks**
- *Pricing too low — €7/mo is below HiHello Pro (€8) and Mobilo (€10), positioning as "cheaper" undercuts the premium thesis.* **Mitigation**: A/B is not solo-dev-friendly. Decision: ship at **€7/mo and €60/yr** (one-month-free annual incentive). Premium positioning comes from the design + onboarding craft, not the price. Compare: Linq Pro €5/mo, Popl Pro €8/mo, V1CE no-subscription. Verso sits in the middle with better-quality output. Revisit at 100 paying users.
- *Custom-domain DNS setup is a support nightmare — every customer needs to add A records and most don't know how.* **Mitigation**: ship a guided setup wizard inside the app that shows the exact A record values + provides a "test domain" button. Defer Apex domains (only allow `cards.<theirdomain>.com` subdomain) for first 6 months. This is already in `project_deferred_todos.md` as Traefik+ACME — read that note.

**What it unlocks**
Revenue. The first €1k MRR is the signal that lets Hasan justify M6 (international expansion costs labor, not just code).

---

### M6 — Beyond EN/DE/TR (ES, FR, IT, AR)

**Goal:** Verso ships in Spanish, French, Italian, and Arabic with quality that matches the EN/DE/TR bar.

**Acceptance criteria**
- 4 new locale files: `mobile/src/lib/i18n/locale.ts` extends from `'en'|'de'|'tr'` to `'en'|'de'|'tr'|'es'|'fr'|'it'|'ar'`. Same for web `src/content/{es,fr,it,ar}.ts`.
- Each new locale has: full keyset (≥1100 keys, matching `en.ts`), native-reviewer pass (1 native speaker per locale, paid via Upwork or DACH community ~€150/locale total), and screenshot QA on 6 primary screens (auth, cards, discover, contacts, inbox, settings).
- Arabic: full RTL support. `I18nManager.forceRTL(true)` on locale switch. All flex-row containers audited; the brand header, FAB, chips, card-deck-tile fan-direction must mirror correctly. New `mobile/src/lib/i18n/rtl.ts` helper.
- Locale picker in Settings (already shipped for EN/DE/TR) extends with the 4 new locales. OS-detected fallback chain stays: override → OS → English.
- Discover filter chips, sector hints, and template names get localized. `CardTemplate.sectorHint` becomes `sectorHintLocalized: Json` (per-locale strings) — backfill via script.

**Critical path**
1. Locale file scaffold via `scripts/i18n-scaffold.ts` — clones `en.ts` shape into 4 stub files with English values pending review.
2. Pay 4 native reviewers via Upwork (~€600 total).
3. RTL audit + fix — single sprint in itself; isolated to layout components.
4. Migration `20260629_add_template_localized_hints` + script to backfill from English source.
5. Mobile: locale picker UI extension + RTL toggle wiring.
6. Web: Next.js middleware locale detection extends from 3 to 7 locales.

**Risks**
- *Per-locale ongoing maintenance: every new feature copy needs translations × 7. Solo-dev cost grows linearly.* **Mitigation**: add ESLint rule that fails CI if a key exists in `en.ts` but not in any other locale — already implicit in the `Content = DeepString<typeof en>` type. Add a `npm run i18n:check` script that reports missing keys per locale. Translate via DeepL Pro (€8/mo, ~1M chars/mo) for placeholder values, native reviewer for a final pass once a quarter (€600/quarter at 4 locales).
- *Arabic RTL breaks 80% of the app's layout in subtle ways (chips lose their gap, the BrandHeader copper italic flips wrong).* **Mitigation**: lock RTL behind a feature flag for the first month; ship LTR Arabic first (acceptable for a v1, many Arabic apps do this). Ship full RTL in a follow-up minor release.

**What it unlocks**
Verso is plausibly the world's most popular DBC app. With EN/DE/TR alone, the addressable market caps around 250M speakers; adding ES/FR/IT/AR brings it to ~1.4B.

---

## C. Three things Verso should NOT do

**Do NOT ship plastic NFC cards as a SKU.**
Every other DBC company is logistics-first (Popl, Mobilo, V1CE, Linq, Beaconstac) — they move physical inventory at thin margins. Verso ships pixels. Adding plastic adds shipping ops, returns, EU customs, packaging — 6+ weeks for ~€2/card margin and a brand association ("oh, those NFC card people") Verso is uniquely positioned to avoid. Recommend instead: a one-time "premium card-stock business cards mailed to you" white-label via **Moo** or **VistaPrint** API — zero inventory, founder is just an affiliate.

**Do NOT build a marketplace for community templates.**
The 96-template catalog is a moat *because* Hasan controls every pixel. Open it up and within 6 months 30% of cards look generic — the design discipline that earns the premium price evaporates. Curated guest designers (1 per quarter, invitation-only, Hasan reviews) is fine. Open submissions are not.

**Do NOT chase enterprise SSO/SAML in 2026.**
The Pro tier targets DACH solos and SMBs. SAML/SCIM/Okta integrations carry 2x support overhead, custom-contract negotiation, and a sales motion Hasan doesn't want. The minute one customer pays €20K/year, the founder's time becomes a deliverable. Stay PLG. Revisit only if 50+ Pro customers explicitly request it (not just "would be nice"). HiHello and Mobilo both make this mistake — their docs are now half-enterprise-jargon.

---

## D. Open product questions for Hasan

1. Free-tier card limit: **1** (recommended above) or **3** — does Hasan want broader free top-of-funnel, or a sharper conversion gate?
2. Pro pricing: **€7/mo** (recommended) or **€9/mo** to fully match the premium positioning and undercut Mobilo by less?
3. Custom domain: shipped as **subdomain only** (cards.theirdomain.com) for the first 6 months, or full **apex domain** with the deferred Traefik+ACME work pulled forward into M5?
4. Push provider: stick with **Expo Push** (free, simple, Hasan's stack) or invest in **OneSignal** / **Pusher Beams** for richer segmentation that helps M3 referral telemetry?
5. M6 launch: ship all 4 new locales **simultaneously** at end of M6 (one big release), or **drip** (ES first, watch adoption, then FR, IT, AR over 3 months)?

---

## Next-session resume

If Hasan returns to a fresh agent and says "continue," do this in order:

1. Read this file (`mobile/assets/world-class-milestone-plan.md`) and `mobile/PROGRESS.md` head.
2. Confirm `mobile/assets/world-class-research.md` now exists; if so, cross-check the M1–M3 competitor risk bullets against it. Update only the bullets that contradict the research; the milestone structure is independent of competitor specifics.
3. Wait for Hasan's answers to the 5 open questions in section D. Do not start implementation until at least Q1 (free-tier limit) and Q2 (Pro price) are answered — both bake into M5 acceptance criteria.
4. Once unblocked, write the implementation plan for **M1 only** (sub-30s onboarding) at `mobile/assets/m1-implementation-plan.md`. Pattern: copy this file's Workstream/Acceptance/Risk structure but expand each step to file paths + Prisma migration SQL + concrete component names. Defer M2–M6 plans until M1 ships and we learn from the funnel.
5. First implementation file to touch: `mobile/app/(app)/onboarding/index.tsx` to add the Scan/Gallery tab UI shell — server endpoints (Tesseract proxy, scrape API) come second so the mobile UI can drive the contract.

Out of scope for this plan (intentional, see `project_deferred_todos.md`):
- Wallet passes (Apple + Google)
- Album moderation
- Custom-domain Traefik+ACME (resurfaces inside M5 as a deliberate sub-task; defer Apex domains until 6 months after M5 ships)
- Apple/Google Wallet — different milestone entirely; pair with M5 if there's customer demand from Pro users

End of plan.
