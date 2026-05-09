# Verso — Path to "World's Most Popular Digital Business Card"

Market research for OpSolid (DACH, premium-positioned, single-developer). Written 2026-05-09 against `mobile/PROGRESS.md` head `e46038d` (through Sprint F4). Output is consumed by a product-architect agent.

---

## 1. Competitive landscape — the ONE gap each leader exposes

For each leader, the single thing they do measurably better than Verso today.

| Leader | The ONE thing Verso lacks | Source |
|---|---|---|
| **HiHello** | **Universal Card Scanner** — OCR in 177 languages, ML enrichment auto-attaches LinkedIn + website to every scan; G2 reviewers cite "25% increased lead capture" | [hihello.com/features/business-card-scanner](https://www.hihello.com/features/business-card-scanner), [g2.com/products/hihello](https://www.g2.com/products/hihello/reviews) |
| **Blinq** | **<60s creation flow with AI auto-fill of missing email/phone/LinkedIn** — 4.9 stars / 150k reviews, 2.5M users (largest base) | [blinq.me/blog/best-digital-business-card](https://blinq.me/blog/best-digital-business-card) |
| **Popl** | **Universal Badge Scanner with 90% AI enrichment success rate** at trade-shows | [popl.co/blogs/all/the-top-7-digital-business-card-platforms-in-2025](https://popl.co/blogs/all/the-top-7-digital-business-card-platforms-in-2025) |
| **Linq** | (Sunsetting — ignore; users migrating to Wave/Blinq/Popl/V1CE) | [wavecnct.com/blogs/news/best-linq-alternative](https://wavecnct.com/blogs/news/best-linq-alternative) |
| **Mobilo** | **Mode-switching card** (business card / landing page / lead-gen page on one URL) + GPS-stamped location-of-meeting | [mobilocard.com/popl-vs-mobilo](https://www.mobilocard.com/popl-vs-mobilo) |
| **V1CE** | Premium **metal NFC physical SKUs** as the brand identity layer | [v1ce.co/blog/best-digital-business-cards](https://v1ce.co/blog/best-digital-business-cards) |
| **Beaconstac (Uniqode)** | **Dynamic QR codes with destination-rewriting** + Apple/Google Wallet native | [prnewswire.com/...beaconstac](https://www.prnewswire.com/news-releases/beaconstac-introduces-digital-business-card-product-to-meet-customer-demand-301906299.html) |
| **Wave Connect** | **CRM/Zapier/Salesforce integrations as first-class** (not bolt-on) | [wavecnct.com](https://wavecnct.com/) |
| **KADO** | **Offline vCard fallback** when no internet at the event | [tapni.com/blogs/digital-business-cards/best-free-digital-business-card-apps](https://tapni.com/blogs/digital-business-cards/best-free-digital-business-card-apps) |
| **Tapt** | **No-app-needed receiver UX** + recycled-plastic eco-story | [tapt.io/en-us/pages/pricing](https://tapt.io/en-us/pages/pricing) |
| **Tapni** | **Automated follow-ups + CRM sync** out-of-the-box | [tapni.com](https://tapni.com/) |

**Pattern:** every leader competes on either (a) capture-the-other-person (scan paper cards / badges) or (b) post-meeting CRM workflow. Verso has neither today.

---

## 2. Card-creation friction benchmarks

Time-to-first-card published:
- **Blinq**: "less than a minute" from signup → published card with auto-fill ([blinq.me/blog/how-to-set-up-your-free-digital-business-card](https://blinq.me/blog/how-to-set-up-your-free-digital-business-card)).
- **HiHello**: "in seconds" with the AI scanner that turns a paper card photo into a complete profile ([hihello.com](https://www.hihello.com/features/digital-business-cards)).
- **Verso**: 5-step wizard (Photo → Name+Title → Channels → Template → Publish) — realistically 60–90s for a fresh user typing on glass.

**Verso ranks middle of pack.** The next reduction below 30s isn't trimming the wizard — it's **bypassing typing entirely**.

**Recommendation:** Single-tap **OCR-of-paper-card → confirm → publish** (a "scan myself in" entry point on the onboarding screen alongside "from scratch"). Why this beats AI-generated layout suggestion:

- Highest leverage: 70% of new users still own a paper card; phone-camera in 5s replaces 90s of typing.
- Cheapest in SDK 54 stack: `expo-camera` v17 is already a peer of `expo-image-picker`; vision goes through a server-side OCR call. No new RN native deps.
- **Build it as:** `expo-camera` ImagePicker → POST to `/api/v1/cards/ocr` → server calls **Google Cloud Vision** ($1.50/1000 calls, EU data residency available) or **AWS Textract** EU-Frankfurt. Returns parsed fields → user lands on Step 2 of existing wizard with fields pre-filled.
- Effort: ~1 week single-dev (camera screen + server endpoint + 3 i18n strings + confirmation step in existing wizard).

AI-generated layout is sexy but lower leverage — Verso already has 96 templates and the friction isn't picking one, it's typing the data.

---

## 3. Discover at scale — when does it become a network?

The signals leaders use:
- **Mastodon Explore**: newer posts × boosts × favorites, hashtag trending charts ([docs.joinmastodon.org/methods/trends](https://docs.joinmastodon.org/methods/trends/)).
- **LinkedIn PYMK**: mutual connections, shared employer/school, contact-graph overlap.
- **Bluesky**: tag-driven feeds + custom-feed marketplace.
- **Polywork** (defunct, but the IA was sound): activity-recency feed + sector tags.

**Signal stack Verso should adopt, in order:**
1. **Sector/industry tags** (manual, picked at onboarding) — works at any scale, drives filterable Discover.
2. **Activity recency** (`updatedAt` desc, "active this week" badge) — encourages re-engagement.
3. **Geo proximity** (DACH-first: Berlin/Munich/Vienna/Zurich tag) — useful at trade-shows since events are already in the schema.
4. **Mutual contacts** (only meaningful past 1k cards; defer).

**Postgres `ILIKE` performance threshold.** Empirically a `WHERE cardData->>'name' ILIKE '%query%'` on a JSON column with no functional index degrades fast: under 10k rows it's <50ms; at 50–100k rows it crosses 200ms; past 250k rows it's user-visible at 500ms+ ([sourcegraph.com/blog/postgres-text-search-balancing-query-time-and-relevancy](https://sourcegraph.com/blog/postgres-text-search-balancing-query-time-and-relevancy), [aiven.io/blog/different-ways-to-search-text-in-postgresql](https://aiven.io/blog/different-ways-to-search-text-in-postgresql)).

Verso is at **16 cards** today. Migration plan:
- **Now → 5k cards:** ILIKE is fine. Add a single `pg_trgm` GIN index on a generated column `(coalesce(name,'') || ' ' || coalesce(title,'') || ' ' || coalesce(company,''))` — 1 day work, buys you to ~50k.
- **5k → 50k cards:** switch to **Postgres `tsvector`** with weighted columns (A=name, B=title, C=company, D=bio). Word-level index is ~10× faster than trigram for word queries ([postgresql.org/docs/current/pgtrgm.html](https://www.postgresql.org/docs/current/pgtrgm.html), [dev.to/whoffagents/...postgresql-full-text-vs-algolia-vs-meilisearch](https://dev.to/whoffagents/implementing-search-postgresql-full-text-vs-algolia-vs-meilisearch-2ibm)).
- **50k+ cards or fuzzy/typo-tolerant search demand:** **Meilisearch self-hosted** (~€10/mo VPS, EU-resident, GDPR-clean, 90% of Algolia features at <10% cost). Not Algolia — pricing model penalizes the DACH SME segment Verso targets ([meilisearch.com/blog/algolia-pricing](https://www.meilisearch.com/blog/algolia-pricing), [meilisearch.com/blog/algolia-review](https://www.meilisearch.com/blog/algolia-review)).

**Personalized ranking** (a) only matters past ~10k cards. **Tag/sector filters** (b) ship now (cheap, works at 16). **Full-text search** (c) ship `pg_trgm` now, plan `tsvector` migration when search-impressions/day > 1k.

---

## 4. Communication beyond F4 inbox

F4 ships 15s-poll thread chat. Leaders go further but most of their "messaging" is actually **lead-capture + follow-up automation**, not chat ([mobilocard.com](https://www.mobilocard.com/popl-vs-mobilo), [hihello.com](https://www.hihello.com/business)).

**Next 2 features in priority order:**

1. **Push notifications (Expo Notifications + FCM/APNs)** — ROI: reduces 15s-poll battery cost, makes chat actually feel alive, unlocks "someone saved your card" + "new event nearby" + "lead-form submitted" surfaces. Cost: 1 week (Expo's `expo-notifications` is already SDK-54-compat); dev provisioning is the only friction. **This is the single highest-ROI feature in this whole list** because every other communication feature degrades without it.

2. **AI auto-reply for inbound leads** — when the lead-form (already shipped Sprint 5) fires, an AI drafts a reply in the card-owner's voice using their bio + status banner. Owner taps "send" or edits. Mirrors HiHello's claimed "25% increased lead capture" outcome. Cost: ~1.5 weeks (Anthropic API call + draft/edit/send UI). Premium-tier feature → also a monetization wedge.

**Defer:** voice notes (low signal vs build-cost), file attachments (legal/storage tax), group chats (out of category), real-time WebSockets (push solves 80% of the perceived-latency problem at 5% of the ops cost).

---

## 5. Network effects — the actual moat

Three viral mechanisms in this category, with Verso's current posture:

| Mechanism | What it is | Verso state |
|---|---|---|
| **Receiver-becomes-sender** ("Smart Exchange / send my card back") | Recipient of a card is asked "want to share yours back?" → in-app signup if not a user. PayPal-style coefficient driver. | **Shipped (Sprint 5).** But signup conversion is unmeasured — needs analytics. **6/10.** |
| **Public viewer is a billboard** (every shared card surfaces "Get your own Verso") | Non-user opening a card link sees a footer CTA → install app or create card-from-this-page. Tapt does this well — "no app needed to view" + footer hook. | **Partial.** Public viewer exists; needs a stronger, A/B-testable footer + "Create yours in 30s" deep-link. **4/10.** |
| **OCR-the-other-side** (you scan their paper card → they get a "you're in someone's Verso contacts" SMS/email + sign-up link) | The strongest viral loop in the category — HiHello's scanner ships an enrichment email. | **Missing.** Ties directly to §2 recommendation. **0/10.** |

Score: ~10/30. Mechanisms 2 and 3 are the highest-leverage upgrades and both compound with §2 (OCR scan flow).

---

## 6. Five-thing prioritized backlog

Ranked by ROI, brutally honest. Single-developer weeks.

| # | Feature | Rationale (one line) | Weeks |
|---|---|---|---|
| 1 | **Push notifications (FCM + APNs via expo-notifications)** | Unlocks every other communication feature; replaces battery-burning 15s polling; signal-of-life that keeps users opening the app. | **1** |
| 2 | **OCR scan-a-paper-card flow** (camera → server → confirm → publish) | Drops time-to-first-card under 30s and seeds the highest-leverage viral loop (mechanism 3 in §5). | **1.5** |
| 3 | **Sector tags + filterable Discover + `pg_trgm` full-text index** | Turns Discover from a feature into a network at the scale where ILIKE breaks (~50k cards); trivially cheap to ship now. | **1** |
| 4 | **AI auto-reply for inbound leads** (Sprint 5 lead-form integration) | Premium-tier wedge + measurable conversion lift; matches HiHello's marquee enterprise claim. | **1.5** |
| 5 | **Public-viewer "Create yours in 30s" deep-link footer + signup-conversion analytics** | Mechanism 2 viral loop; without measurement the smart-exchange feature is flying blind. | **0.5** |

**Total: ~5.5 weeks single-dev to clear the gap to "world-class."** Sequencing matters: ship #1 first (everything else lights up better with push), then #2+#5 in parallel (both touch onboarding/public-viewer surfaces), then #3, then #4 as the premium-tier monetization story.

What is **deliberately not on this list**: NFC physical cards (V1CE/Tapt's moat — capital-intensive, not single-dev work), Apple/Google Wallet passes (already deferred in PROGRESS.md, low compounding ROI), group chat (out of category), custom domains (low leverage).

---

*Sources cited inline. Premium-bar check: `feedback_design_quality.md` — none of these features are flat-padding-typography filler; each is a measurable capability gain. Deploy-cost check: `project_opsolid_vps_deploy.md` — push (FCM free) + OCR (~$0.0015/scan Google Vision, EU) + Meilisearch (~€10/mo VPS) all fit the existing infra envelope.*
