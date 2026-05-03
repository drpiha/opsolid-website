# Regression Test Report — Faz 6.7 + 6.8 + 7.0a
**Date:** 2026-05-03  
**Commit:** a3c3fa3 (HEAD), regression base: ada3ef5  
**Target:** https://opsolid.de (production)

---

## Failures / Defects

### F1 — [P1] /en/dashboard returns 404 (no page.tsx)

- **Where:** `src/app/[locale]/dashboard/` — directory has `layout.tsx` and `cards/` subdirectory but no `page.tsx`
- **Repro:** `curl -sI https://opsolid.de/en/dashboard` → 404
- **Expected:** Unauthenticated → 307 to `/en/login?next=/dashboard/cards`; authenticated → 200 (or 307 to `/en/dashboard/cards`)
- **Actual:** 404 for any request to `/en/dashboard` (or `/de/dashboard`, `/tr/dashboard`)
- **Root cause:** The dashboard layout (`layout.tsx`) correctly redirects on auth failure, but Next.js 14 App Router requires a `page.tsx` at every route segment for the layout to activate. Without it, the route is unresolvable and Next.js returns 404 before running the layout — meaning the auth guard never fires either.
- **Fix:** Add `src/app/[locale]/dashboard/page.tsx` that either renders an empty redirect to `/dashboard/cards` or shows a default dashboard landing. Simplest fix: a server component that calls `redirect('./cards')` (relative redirect).
- **Note:** `/dashboard` (no locale) → 307 to `/en/dashboard` works because middleware runs; the 404 only hits at the locale-prefixed path.

### F2 — [P1] POST /api/auth/signup → 500 server_error

- **Where:** `src/app/api/auth/signup/route.ts` (inferred)
- **Repro:** `curl -X POST https://opsolid.de/api/auth/signup -H "Content-Type: application/json" -d '{"email":"qa-X@example.com","password":"TestPass123!","locale":"en"}'` → 500 `{"error":{"code":"server_error","message":"Could not process the request. Please try again."}}`
- **Expected:** 201 + Set-Cookie (session) + user JSON
- **Actual:** 500 on every attempt
- **Root cause hypothesis:** Database write failure (Prisma migration not applied on VPS for new `users` table), or missing env var (`AUTH_SECRET`, `JWT_SECRET`, email provider). The `/api/auth/magic-link` endpoint returns 202 successfully, suggesting the user-lookup path works but the user-creation path fails. Most likely: Prisma migration for the auth schema (users, sessions) was not applied in production, or a required env var is missing.
- **Impact:** New user registration is completely broken. Magic-link flow cannot complete if no user record exists.
- **Fix:** (a) Verify `DATABASE_URL` connection and run `npx prisma migrate deploy` on VPS, (b) check `AUTH_SECRET`/`JWT_SECRET` env vars are set, (c) check server logs for exact Prisma error.

### F3 — [P2] POST /api/auth/magic-link — no verifiable email delivery / token log

- **Where:** `/api/auth/magic-link`
- **Repro:** POST returns 202 with `{"ok":true,"message":"If the address is valid, a sign-in link has been sent."}` — intentionally opaque. Unable to verify from curl that email was actually dispatched or token was stored.
- **Expected:** Email sent with `/en/magic-link/verify?token=...` URL; token stored in DB
- **Actual:** 202 returned but cannot confirm delivery without server log access
- **Note:** Not a blocking failure — 202 is correct behavior (privacy). Needs VPS log inspection or a test email address with inbox access to fully verify. Flag for manual follow-up.

### F4 — [P2] B2 vCard Content-Disposition is `attachment` not `inline`

- **Where:** `GET https://opsolid.de/api/cards/ayse-test/vcard`
- **Repro:** `curl -I https://opsolid.de/api/cards/ayse-test/vcard`
- **Expected:** `Content-Disposition: inline; filename="..."` (B2 acceptance criteria specifies inline)
- **Actual:** `Content-Disposition: attachment; filename="Ayse Mertens.vcf"`
- **Root cause:** The vCard route sets `attachment` disposition. iOS Safari triggers file download rather than native Contacts.app import when disposition is `attachment`.
- **Fix:** Change to `inline` in `src/app/api/cards/[slug]/vcard/route.ts` (or equivalent path): `Content-Disposition: inline; filename="Ayse Mertens.vcf"`

### F5 — [P2] B1 Save Contact primary CTA missing from photographer template

- **Where:** `/c/ayse-test` (photographer template)
- **Repro:** View HTML — section buttons are "Meine Daten senden" (lead exchange) and "Meine Karte senden". No full-width primary "Save Contact" / "Kontakt speichern" vCard download button exists.
- **Expected:** B1 spec: "Save Contact" as single full-width primary button with `min-h-[52px]` or `h-14` class
- **Actual:** Wallet slot ("Auf das Smartphone") is present for Apple/Google Wallet, but no direct vCard download CTA button. The two visible buttons are lead-capture forms, not contact-save actions.
- **Note:** WalletButtons component is present (renders Apple/Google Wallet pass buttons), but a direct `.vcf` download button for Android/standard browsers is absent in the photographer template.
- **Fix:** Add vCard download button as primary CTA in the photographer template component at `src/components/cards/templates/v2/photographer/` — full-width, `min-h-[52px]`, linking to `/api/cards/{slug}/vcard`.

### F6 — [P1] Mobile API /api/v1/openapi.json → 404

- **Where:** `GET https://opsolid.de/api/v1/openapi.json`
- **Repro:** `curl -sI https://opsolid.de/api/v1/openapi.json` → 404
- **Expected:** 200 + valid OpenAPI 3.1 JSON
- **Actual:** 404 — route does not exist
- **Root cause:** The OpenAPI spec endpoint was listed in Faz 7.0a (B0.8) but was apparently not implemented in the deployed build. No `src/app/api/v1/openapi.json/route.ts` found.
- **Fix:** Create `src/app/api/v1/openapi.json/route.ts` that returns a valid OpenAPI 3.1 spec for the `/api/v1/*` mobile endpoints.

### F7 — [P2] B6 Error page locale binding — /c/nonexistent returns Next.js default 404 ("This page could not be found.") regardless of ?lang=

- **Where:** `GET https://opsolid.de/c/nonexistent-slug-12345?lang=de`
- **Repro:** curl returns generic Next.js 404 HTML with English "This page could not be found." regardless of `?lang=de` or `?lang=tr`
- **Expected:** Locale-aware error message in the specified language
- **Actual:** Next.js default 404 page (English only) — the custom not-found.tsx inside `[locale]` is not invoked because the error triggers at `src/app/c/[slug]/` level which has no locale-aware not-found handler
- **Fix:** Add `src/app/c/[slug]/not-found.tsx` that reads `?lang=` param (or defaults to DE) and renders a localized 404 message, or add a notFound boundary inside the card page that passes locale through.

---

## Skipped / Out of Scope

- **B3 Dark template contrast (axe-core):** No "studio" template card available in production. ayse-test uses photographer template. SKIP — needs a studio-template card to test.
- **A4 Sticky save bar:** Requires authenticated session. Auth gating verified via `/en/dashboard/cards` → 307. SKIP manual test.
- **A8.5 Sentry tap-to-focus:** Hasan iPhone canlı testi gerekiyor. SKIP.
- **C5 Consent banner DevTools localStorage test:** Component reference confirmed in HTML (`ConsentBanner`, `ConditionalAnalytics`). Full localStorage/script-mount test requires browser. SSR component presence: PASS.
- **hasan-test cards:** Bilinçli kabul (DATA, kod değil). SKIP.

---

## Full Test Matrix

| Test ID | Test | Beklenen | Sonuç | Not |
|---|---|---|---|---|
| S1 | /datenschutz → 308 → /de/privacy | 308 Location:/de/privacy | PASS | |
| S2 | /gizlilik → 308 → /tr/privacy | 308 Location:/tr/privacy | PASS | |
| S3 | /de/datenschutz → 308 → /de/privacy | 308 Location:/de/privacy | PASS | |
| S4 | /api/health | JSON ok + dbOk:true | PASS | commit:"unknown" (VPS deploy no git) |
| S5 | /c/ayse-test | 200 | PASS | Full HTML rendered |
| S6a | /en/login | 200 | PASS | |
| S6b | /en/signup | 200 | PASS | |
| S6c | /en/magic-link | 200 | PASS | |
| S7 | /en/dashboard (no cookie) | 307 → /en/login | FAIL (P1) | 404 — no page.tsx in dashboard route. /dashboard → 307 works via middleware |
| S8 | GET /api/auth/me (no token) | 401 | PASS | `{"error":{"code":"not_authenticated",...}}` |
| S9 | POST /api/auth/magic-link | 202 | PASS | Rate limit OK |
| A1 | /c/ayse-test og.png has ?v= in metadata | og:image URL contains ?v=<updatedAt> | PASS | `?v=1777550135355` confirmed in og:image and wa.png meta tags |
| A1b | 2 cards with different ?v= values | Different ?v= per card | PARTIAL | Only ayse-test available; hasan-test 404 (data). Single card confirmed. |
| A4 | Sticky save bar auth gate | /dashboard/cards → 307 | PASS | /en/dashboard/cards → 307 to login |
| A5 | photoPosition CSS vars | --tpl-photo-x in style attr | PASS | `--tpl-photo-x:50%;--tpl-photo-y:50%;--tpl-photo-scale:1` present |
| B1 | Save Contact primary CTA (min-h-[52px]) | Full-width vCard save button | FAIL (P2) | Photographer template has no primary Save Contact button. Wallet slot present, lead-exchange buttons present, but no vCard download CTA |
| B2 | /api/cards/ayse-test/vcard Content-Disposition | inline | FAIL (P2) | Returns `attachment` — will trigger file download on iOS instead of Contacts.app |
| B3 | axe-core dark template contrast | Pass | SKIP | No studio-template card in prod |
| B4a | ?lang=en → EN active + locale-aware labels | lang="en", EN button active | PARTIAL PASS | html[lang] stays "en" (root layout), but LocaleSwitcher aria-current="true">EN confirmed, card locale prop en ✓ |
| B4b | ?lang=de → DE active | DE button active | PASS | Default card locale is de; aria-current="true">DE for unparameterized URL |
| B4c | ?lang=tr → TR active | TR button active | PASS | aria-current="true">TR confirmed |
| B6 | 404 page locale binding | Localized error text | FAIL (P2) | Next.js default 404 in English regardless of ?lang= |
| C5 | ConsentBanner in /de HTML | Component present | PASS | ConsentBanner + ConditionalAnalytics in RSC payload confirmed |
| ML1 | POST /api/auth/magic-link qa-timestamp@ | 202 | PASS | |
| ML2 | Magic link email delivery / token URL | /en/magic-link/verify?token=... | NOT VERIFIABLE | No log/inbox access; flagged for manual test |
| SU1 | POST /api/auth/signup | 201 + cookie | FAIL (P1) | 500 server_error — Prisma/env issue |
| SU2 | GET /api/auth/me after signup | 200 + user JSON | BLOCKED | Blocked by SU1 |
| LO1 | POST /api/auth/logout | 200 + cookie clear | PASS | Returns `{"ok":true}` |
| ON1 | New user /dashboard → onboarding redirect | 307 → /onboarding | NOT TESTABLE | Signup broken (SU1) |
| MO1 | GET /api/v1/auth/me (no auth) | 401 | PASS | `{"error":{"code":"missing_bearer_token",...}}` |
| MO2 | POST /api/v1/auth/login | 200 + tokens | NOT TESTABLE | Signup broken — no valid test user exists |
| MO3 | GET /api/v1/cards (Bearer token) | 200 + array | NOT TESTABLE | Blocked by MO2 |
| MO4 | GET /api/v1/openapi.json | 200 + OpenAPI 3.1 | FAIL (P1) | 404 — endpoint not deployed |
| R1 | scripts/anonymize-pii-cron.sh exists | File present + valid bash | PASS | File present, valid shebang, --apply flag, syslog logging |
| R2 | src/lib/retention.ts exists | File present | PASS | |

---

## Summary

**Status: NOT ALL GREEN — 6 failures**

| Priority | Count | IDs |
|---|---|---|
| P1 | 3 | F1 (dashboard 404), F2 (signup 500), F6 (openapi.json 404) |
| P2 | 4 | F3 (magic-link unverifiable), F4 (vCard attachment), F5 (Save Contact missing), F7 (B6 error locale) |

**Passing:** S1–S6, S8–S9, A1, A4, A5, B4 (locale switching functional), C5, ML1, LO1, MO1, R1, R2

**Recent commits tested:** a3c3fa3, 400ac66, 1c95b5c, ada3ef5
