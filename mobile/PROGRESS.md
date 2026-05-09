# OpSolid Mobile — Development Progress

Living log of mobile-app feature work. Updated per session, not auto-generated.

## Status snapshot

The "Verso by OpSolid" mobile app is feature-complete through **Sprint F4**. The current head of `main` is commit `e46038d`. Pending APK builds: `#22` (commit `c20aa96`, F2 only) and `#23` (commit `e46038d`, F2+F3+F4). Hasan is the only human in the loop and asked the assistant to ship autonomously; **install build #23 when it lands** — `gh release download android-build-23 --pattern "*.apk" --dir /tmp --clobber && adb install -r /tmp/opsolid-android-0.1.0-b23.apk`.

After install, two server steps Hasan must run:

1. `docker exec opsolid-app npx prisma migrate deploy` — applies the events + messages migrations.
2. `docker exec opsolid-app npx tsx scripts/seed-events.ts` — populates the Events tab + Discover rail.

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
| android-build-22 | `c20aa96` | Sprint F2 — Events / Fairs feature | building |
| android-build-23 | `e46038d` | Sprint F2 + F3 (Contacts seed) + F4 (Inbox messaging) | building (latest — install this when both finish) |

## Operating notes (read first when picking up work)

- Stable keystore is in GitHub Secrets (`KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`). Local backup at `~/.opsolid/opsolid-release.keystore` on the maintainer machine. **Never re-generate** without rotating both — every installed app would need uninstall.
- Repo conventions: read `mobile/CLAUDE.md` first. Conventions enforced: SDK 54 stack pinned, no New Architecture, lucide v1.14 brand-icon fallbacks, `expo-image-picker` v17 `mediaTypes: ['images']`, `expo-contacts` v15 plain string labels.
- Build trigger: `gh workflow run "Build & Release Android APK" --repo drpiha/opsolid-website --ref main`. Cold cache 30–40 min, warm 20 min. Output: `android-build-N` GitHub Release with `opsolid-android-0.1.0-bN.apk` (~108 MB).
- Server deploy: `deploy.ps1` from local Windows works but its PowerShell stderr handling is brittle; if it errors out mid-build, the VPS-side `nohup docker compose up -d --build opsolid > /tmp/deploy.log 2>&1 &` recovery is documented in commit messages.
- Seed-public-cards: prod DB seed needs `docker exec -u 0 opsolid-app mkdir -p /app/scripts && docker cp /opt/opsolid-website/scripts/seed-public-cards.ts opsolid-app:/app/scripts/seed-public-cards.ts && docker exec opsolid-app npx tsx scripts/seed-public-cards.ts`. Sandbox blocks remote writes — Hasan runs this from his terminal.

---

*Generated via collaboration with Claude Code agents. The maintainer (Hasan Dönmez) is the only human in the loop.*
