# OpSolid Mobile

Expo SDK 51 + React Native + TypeScript + expo-router. Hat C7 (Faz 7.0b).

## Setup

```bash
cd mobile
npm install
cp .env.example .env
```

## Run

```bash
npm run android    # Android emulator (requires Android Studio + AVD)
npm run ios        # iOS simulator (macOS only)
npm run web        # Web preview (limited — metro bundler)
```

Or use Expo Go on a physical device:

```bash
npx expo start --tunnel
```

Scan the QR code with the Expo Go app.

## Architecture

- `app/` — file-based routes (expo-router)
  - `(auth)/` — unauthenticated stack: login, magic-link verify
  - `(app)/` — authenticated stack: cards, card detail, card edit
- `src/lib/api/` — JWT bearer fetch wrapper + token storage (expo-secure-store)
- `src/lib/theme/` — design tokens (mirrors web tailwind palette)

## Auth

JWT bearer auth via `/api/v1/auth/*` (web backend, Hat B). Tokens stored in
expo-secure-store. Refresh rotation: on 401 the client fires a single-flight
refresh and retries. Biometric unlock added in C7.3.

## Environment

```
EXPO_PUBLIC_API_BASE=https://opsolid.de   # production
EXPO_PUBLIC_API_BASE=http://localhost:3000 # local dev
```

## Plan

| Task | Status | Description |
|------|--------|-------------|
| C7.1 | done | Scaffolding (this PR) |
| C7.2 | next | Native build verification — user runs `npx expo start` |
| C7.3 | todo | Auth screens + biometric unlock |
| C7.4 | todo | Card list + detail |
| C7.5 | todo | Card edit (form, photo, brand color) |
| C7.6 | todo | vCard save (native Contacts) |
| C7.7 | todo | Push notifications |
| C7.8 | todo | Play Store internal track |
