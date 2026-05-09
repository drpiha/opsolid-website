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
