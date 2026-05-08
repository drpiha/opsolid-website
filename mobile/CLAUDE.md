# OpSolid Mobile — Claude handoff

This file is auto-loaded when working under `mobile/`. Read first to pick up where the previous session left off.

For the full sprint-by-sprint history of what changed and why, read **`mobile/PROGRESS.md`** in this directory.

## What this app is

Expo SDK 54 / React Native 0.81 / TypeScript / expo-router file-routing.
Authenticated dashboard around a digital business card built on the same backend as the OpSolid website (`opsolid.de`). Backend already has 50+ card features (templates, layouts, themes, brand colors, QR styling, services, gallery, FAQs, custom CTAs, lead form, smart exchange, feedback, wallet passes, …). Mobile is mid-port — see PROGRESS.md for what's wired up.

## Repo layout

```
mobile/
├── app/                  # expo-router screens
│   ├── (auth)/           # login, signup, magic-link, magic-link/verify
│   ├── (app)/            # cards (list/detail/create/edit), discover, contacts, inbox, settings, public/[slug]
│   ├── _layout.tsx       # root: hydrate auth, splash safety timer
│   └── index.tsx         # auth gate redirect
├── src/
│   ├── components/cards/ # CardListItem, QrCodeModal, CardFormSections, CardRepeaterSections
│   ├── components/ui/    # Button, Input, ScreenContainer
│   ├── lib/api/          # client (Bearer + refresh), cards, discover, contacts, inbox, templates, types
│   ├── lib/auth/         # api, store (zustand), biometric
│   ├── lib/contacts/     # native.ts — vCard save via expo-contacts
│   ├── lib/i18n/locale.ts# en/de/tr — derived from device locale only (no UI switcher)
│   └── lib/theme/        # tokens + ThemeProvider (light/dark)
├── scripts/
│   ├── start-metro-tailscale.ps1  # local dev (note: machine-specific IP — DO NOT commit changes)
│   └── ...
├── app.json              # Expo config (slug=opsolid-mobile, package=de.opsolid.mobile, scheme=opsolid)
├── package.json          # SDK 54, locked
└── PROGRESS.md           # full session-by-session changelog
```

`scripts/seed-public-cards.ts` (repo root, NOT mobile/scripts) seeds 8 demo public cards for Discover.

## Current state — confirmed by git log + last session

Latest mobile-relevant commit: see `git log --oneline -10 -- mobile/`. As of last write, sprints 0–4 + Inbox UX + keyboard fix are merged on `main`. Sprint 5 (CRM features) and gallery multi-upload are NOT yet started.

**Awaiting deployment:**
- `scripts/seed-public-cards.ts` is committed but has NOT been run on production. It needs to be on the VPS (`/opt/opsolid-website`) and then executed once. The Deploy-to-VPS workflow (`paths-ignore: scripts/**`) does NOT trigger on script changes — trigger it manually with `gh workflow run "Deploy to VPS"` after a fresh `main` push.
- After deploy, run on prod: `ssh root@72.62.0.111 "cd /opt/opsolid-website && docker exec opsolid-app npx tsx scripts/seed-public-cards.ts"`. Idempotent. Inserts demo cards for Musk, Gates, Cook, Nadella, Pichai, Huang, Sandberg, Jobs.

## Pending work — read PROGRESS.md "Pending" section for details

1. **Sprint 5 — CRM** (highest user value): lead form on public card, Smart Exchange ("send my card"), feedback widget (7-category 1–5 ratings), status banner edit/render. Server endpoints already exist: `POST /api/cards/[slug]/lead`, `POST /api/cards/[slug]/exchange`, `POST /api/cards/[slug]/feedback`.
2. **Photo gallery** — `cardData.gallery` up to 24 images. Multi-pick via expo-image-picker (already in deps), reorder, delete, public viewer lightbox.
3. **Stable signing keystore** — `mobile-build.yml` regenerates the keystore each run; every install therefore requires `adb uninstall` (clears Google session, biometric pref, secure-store tokens). Move keystore to GitHub secret `KEYSTORE_BASE64` + `KEYSTORE_PASSWORD` so all builds sign with the same key. **This is the most-painful UX issue right now** — fix early.
4. **Deferred** (skip unless asked): Apple/Google Wallet pass, custom domain, album moderation, push notifications.

## Gotchas the previous session hit

- **expo-contacts v15 dropped `EmailLabels` / `PhoneNumberLabels`** — use plain string labels (`'work'`, `'mobile'`). Don't use `Contacts.Fields.*` keys when *creating* a contact (those are for query field selection).
- **expo-image-picker v17** — use `mediaTypes: ['images']` (string array). The deprecated `MediaTypeOptions.Images` enum will runtime-crash on stale APKs; the source is correct, but APKs built before v17 was bundled crash on `+` and Edit screens.
- **lucide-react-native v1.14 dropped brand icons** (no `Linkedin`, `Instagram`, `Twitter`, `Youtube`, etc.). Use semantically related generics (`Briefcase` for LinkedIn, `Camera` for Instagram, `Video` for YouTube, `ExternalLink` fallback) plus a text label.
- **Bridgeless / New Architecture is OFF** for now (compat). Don't enable casually — the previous session ran into native-arch SIGABRTs. See git log around 6bb639d.
- **Keyboard covers input** — the fix is `KeyboardAvoidingView` (iOS padding behavior) + `softwareKeyboardLayoutMode: "resize"` in `app.json` android. Already applied to create/edit forms. If you add new long forms, do the same.
- **Server PATCH `/api/v1/cards/[id]` accepts arbitrary `cardData` keys** — you don't have to widen `CardPatchInput` for every new field. Cast through `unknown` if TypeScript narrows.
- **Brand colors persist BOTH** at top-level (`CardOrder.brandPrimaryHex`/`brandAccentHex` columns) AND inside `cardData`. The API returns top-level; mirror to cardData on save.

## Build & install loop

The CI workflow `Build & Release Android APK` is `workflow_dispatch` only — pushing alone won't build. Trigger manually:
```
gh workflow run "Build & Release Android APK" --repo drpiha/opsolid-website --ref main
```

Each run takes ~20–40 min (cold cache: 40, warm: 20). Output: `android-build-<run-number>` GitHub Release with one APK asset (`opsolid-android-0.1.0-bN.apk`, ~107 MB). Download:
```
gh release download android-build-N --repo drpiha/opsolid-website --pattern "*.apk" --output ./b-N.apk --clobber
```

Install (until keystore is stabilized — see pending item 3):
```
adb uninstall de.opsolid.mobile
adb install -r ./b-N.apk
```
After install: open app → Google login → Settings → re-enable biometric.

## Local dev (Metro live-reload — when a dev-client APK is on the phone)

```
cd mobile && npm install --legacy-peer-deps
.\scripts\mobile-dev.ps1                           # Windows: auto-detects LAN IP, sets EXPO_PUBLIC_API_BASE
# or
$env:REACT_NATIVE_PACKAGER_HOSTNAME = "<your-LAN-IP>"
$env:EXPO_PUBLIC_API_BASE = "https://opsolid.de"
npx expo start --dev-client --host=lan --port=8081
```

The phone IP / your LAN IP is **machine-specific** — don't commit `mobile/scripts/start-metro-tailscale.ps1` IP changes. The previous session used `192.168.2.40` (PC) ↔ `192.168.2.30` (phone, Samsung S23 SM-S911B). The new session will be on a different network.

`adb` should be at `$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe` (Android Studio default). The previous session had it at `C:\platform-tools\adb.exe` because Android Studio wasn't installed. Either is fine.

## When picking up work

1. Read `PROGRESS.md` for the actual changelog.
2. Run `git log --oneline -20 -- mobile/ scripts/seed-public-cards.ts` to see what shipped since this file was written.
3. Check `git status` — if `mobile/scripts/start-metro-tailscale.ps1` shows modified, that's the previous session's local IP override; ignore unless you're testing dev client locally.
4. `cd mobile && npx tsc --noEmit` to confirm baseline is clean before adding code.
5. For new features: dispatch parallel `general-purpose` agents per independent slice (e.g. Sprint 5's lead-form / smart-exchange / feedback are separate files → separate agents). Match the file-section pattern set by `CardFormSections.tsx` + `CardRepeaterSections.tsx`.

## Don't

- Don't bump `expo`, `react-native`, `react`, or any `expo-*` major version casually — the SDK 54 stack here is stable and the previous session burned a lot of time on dep-version dance (see git log around 9b5871b, e52d36e, dbf82d0).
- Don't add `framer-motion`, brand SVG packages, or new state libraries. Reuse `lucide-react-native`, `react-native-reanimated`, `zustand`.
- Don't enable React Native New Architecture (`expo.experiments.newArchEnabled`) without testing. It's intentionally off.
- Don't touch `mobile/scripts/start-metro-tailscale.ps1` IP unless the user asks — that's a machine-local override.
- Don't commit `.env` files. `mobile/.env.example` is the template; `.env` is gitignored.
