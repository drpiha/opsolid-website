# OpSolid Mobile — Development Progress

Living log of mobile-app feature work. Updated per session, not auto-generated.

## Done — in code, awaiting / installed via APK build #13 (commit 45ccf99)

### Sprint 0 — crash fixes & vCard (build #10)
- expo-image-picker SDK 54 API: `mediaTypes: ['images']` (was crashing `+` and Edit screens with stale `MediaTypeOptions.Images`).
- `expo-contacts` v15 added: tapping Save on a public card mirrors the contact into the phone's Contacts app (vCard equivalent — C7.6 from README).
- i18n leaks fixed: `signup.tsx` and `magic-link.tsx` no longer have hardcoded English strings. New keys (`signupHeadline`, `signupNote`, `didntGetIt`, `resendIn`, `backToSignIn`) localized for en/de/tr.
- `Alert.alert(t.errorLoad)` → `Alert.alert('', t.errorLoad)` (3 sites — title/message arg confusion).
- `native.ts` rewrite: dropped `Contacts.EmailLabels` / `PhoneNumberLabels` (removed in v15), removed duplicate `Fields.*` keys, use plain `'work'` / `'mobile'` string labels.

### Sprint 1 — public viewer richness, QR & share (build #13)
- **QR code modal** (`src/components/cards/QrCodeModal.tsx`): RN Modal with copper-tinted backdrop, fetches `${API_BASE}/api/qr/${slug}` PNG, shows public URL in monospace, **Share** (RN `Share.share`) + **Close** buttons. Wired into:
  - `public/[slug].tsx` header right (next to Bookmark)
  - `cards/[id].tsx` header right when card is `PUBLISHED` and has a slug
- **Native Share** in public-viewer contact section ("Share card" pressable using `Share.share({ message, url })`).
- **Public viewer rich content** (`public/[slug].tsx`) — defensively parses and renders:
  - `bio` paragraph
  - `position` (separate from `title`)
  - **Socials row** for 8 platforms (LinkedIn / Instagram / X / TikTok / YouTube / GitHub / Facebook / Xing). lucide v1 dropped brand icons, so semantically related generic icons + text label per pill.
  - **WhatsApp** button → `wa.me/<digits-only>`
  - **Website** button → `Linking.openURL`
  - **Booking CTA** ("Schedule meeting" / locale-aware) → `Linking.openURL(bookingUrl)`
  - **Video** pressable → external open
  - **Services** list (up to 12) with title / description / price (price in copper)
  - **Custom buttons** (up to 4) as secondary-button column
  - **Address** pressable → Google Maps search

### Sprint 2 — owner editing form expansion (build #13)
- New `src/components/cards/CardFormSections.tsx` with shared section components used by `cards/create.tsx` and `cards/edit/[id].tsx`:
  - `BasicFieldsSection` — name / title / position / company / email / phone / whatsapp / website / address / **bio (multiline + 500-char counter)**
  - `SocialsSection` — collapsible (chevron toggle), 8 platform inputs
  - `BrandColorsSection` — primary + accent. 36×36 swatches + hex input, `/^#[0-9A-F]{6}$/i` blur validation, defaults `#C27940` / `#1F2937`
  - `VisibilitySection` — 3-pill segmented (public / unlisted / private) + i18n hint
  - `DiscoverySection` — `Switch` rows for openToNetworking + acceptingClients, plus industry / city / country inputs
- `stripEmpty()` helper drops empty social keys before save.
- Persists arbitrary keys into `cardData` (server PATCH already accepts arbitrary cardData JSON).

### Sprint 3 — 96 templates + layout/theme/QR picker (build #13)
- Server: new **`GET /api/v1/templates`** (`src/app/api/v1/templates/route.ts`) — Bearer-auth, returns active templates from `src/config/card-templates.ts`, cached 5 min.
- Server: **`PATCH /api/v1/cards/[id]`** schema now accepts `templateId` (validated against active catalog) + `qrStyle`.
- `mobile/src/lib/api/templates.ts` thin client.
- New sections in `CardFormSections.tsx`:
  - `TemplateSection` — sector chips ("All" + each unique `sectorHint`), 3-col `FlatList` grid of 96 templates with `getItemLayout` + windowed rendering, copper border + `Check` icon on selected, copper-tinted name placeholder when `previewPath` null.
  - `LayoutSection` — 5 chips (`bento` / `accordion` / `cinema` / `editorial` / `split`)
  - `ThemeSection` — 3 segmented pills (`aurora` / `editorial` / `cinema`)
  - `QrStyleSection` — 6 chips (`classic` / `rounded` / `dots` / `gradient` / `monoNeon` / `watercolor`); preserves `cardData.qrStyle.ai` if present
- `cards/create.tsx`: replaces hardcoded `templateId: 1` with state, defaults `bento`/`aurora`/`classic`. POST then PATCH qrStyle (POST schema doesn't accept qrStyle).
- `cards/edit/[id].tsx`: hydrates from `card.templateId / cardData.layoutKey / cardData.themeKey / qrStyle.preset`.

### Sprint 4 — rich content editors (build #13)
- New `src/components/cards/CardRepeaterSections.tsx`:
  - `ServicesSection` — up to 12 services. Each row: title / description / price + `Trash2` delete. "+ Add service" until cap.
  - `CustomButtonsSection` — up to 4 CTAs. Label + URL.
  - `FaqsSection` — up to 12 FAQs. Question + multiline answer.
- Each row wrapped in `theme.bg[1]` card with hairline border so they group visually.
- `cleanServices()` / `cleanCustomButtons()` / `cleanFaqs()` filter empty rows on save.
- Public viewer (`public/[slug].tsx`): **FAQs accordion** (chevron toggle, `Set<number>` of expanded indices).
- Form section order is now: Basics → Socials → Brand → Template → Layout → Theme → QrStyle → Services → CustomButtons → FAQs → Visibility → Discovery.

### Inbox UX rework (build #13)
- **Empty state** replaced with explainer card (`Mailbox` icon + 2-paragraph copy in en/de/tr) explaining what triggers each request type.
- Filter chips **hidden** when `items.length === 0`.
- When shown: tighter (12×6 padding, 12px font, no horizontal scroll, hairline border-bottom separator).
- Per-item action-type icon (32×32 in `theme.bg[2]`):
  - `request_contact` → `UserPlus`
  - `request_quote` → `FileText`
  - `request_meeting` → `Calendar`
  - `send_card` → `Send`
  - `ask_collaboration` → `Users`
  - `give_feedback` → `MessageSquare`

### Keyboard fix (build #13)
- Edit/Create form ScrollView wrapped in `KeyboardAvoidingView` (iOS padding behavior) with `keyboardDismissMode="interactive"` + `automaticallyAdjustKeyboardInsets`.
- `app.json`: Android `softwareKeyboardLayoutMode: "resize"` so the activity resizes for the keyboard instead of pan-scrolling (fixes "input field hidden behind keyboard").

### Seed script (committed, not yet run)
- `scripts/seed-public-cards.ts` — idempotent upsert of 8 famous-person demo cards (Musk, Gates, Cook, Nadella, Pichai, Huang, Sandberg, Jobs).
- Each PUBLISHED + visibility=public + brand colors + layoutKey + themeKey + qrStyle + rich `cardData` (bio / services / socials / customButtons).
- `userId=null` (orphan demo cards), `photoPath=null` (no image rights — initials avatar fallback).
- Run on production: `ssh root@72.62.0.111 "cd /opt/opsolid-website && docker exec opsolid-app npx tsx scripts/seed-public-cards.ts"`

## Pending — code not yet written

- **Sprint 5 — CRM & interactions (task #10)**:
  - Lead form on public card ("Bana ulaş")
  - Smart Exchange ("Send my card")
  - Feedback widget (7 categories, 1–5 ratings)
  - Status banner (text + tone) edit field + render
- **Photo gallery multi-upload (task #14)**: `cardData.gallery` up to 24 images, multi-pick + reorder + lightbox.
- **Stable signing keystore (task #13)**: every CI build currently generates a new keystore → every install requires uninstall (Google re-login). Move keystore to GitHub secret.

## Deferred (low value vs cost)

- Apple Wallet / Google Wallet passes
- Custom domains
- Album moderation (pending visitor photos)
- Push notifications

## Build & Deploy state (this session)

| # | Trigger | Includes | Status |
|---|---|---|---|
| android-build-9 | (prior) | pre-Sprint 0 | (user had this) |
| android-build-10 | 9964d4f | Sprint 0 | ✅ installed on phone for crash-fix validation |
| (b11 cancelled) | 8d72d35 | Sprint 0+1+2 | ❌ cancelled — superseded |
| (b12 cancelled) | 64c6d19 | Sprint 0+1+2+3 + kb fix | ❌ cancelled — superseded |
| android-build-13 | 45ccf99 | Sprint 0+1+2+3+4 + Inbox UX + kb fix | 🟡 in progress |

---

*Generated via collaboration with Claude Code agents — Sprint 1, Sprint 2, Sprint 3, Sprint 4 + Inbox UX, and seed-cards each dispatched as parallel general-purpose subagents.*
