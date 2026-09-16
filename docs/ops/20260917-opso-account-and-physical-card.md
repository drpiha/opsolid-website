# OpSo account and physical-card launch contract

## One account across web and Android

The OpSolid legacy Next/Prisma account and VERSO Nest/Prisma account are separate stores. Equal email addresses do not establish shared ownership. The target is one VERSO account/workspace and card collection across both clients. This integration is not live yet.

New web editing should use the VERSO API behind a server-side web session. Use a short-lived authorization code with PKCE and Secure, HttpOnly, SameSite cookies; never place access/refresh tokens in URLs. Preserve the existing web cards and share URLs during the transition.

Existing cards require proof of both accounts (or the existing card edit capability), a preview of the exact cards being linked, a single-use expiring link intent, and an owner-scoped transaction. Handle slug and plan-limit conflicts before importing. Keep an audit/rollback mapping. Do not merge by email alone or silently replace existing cards. A verified universal app link can then open the same card ID; the web fallback should link to the real Play listing once it is available. A public download button must not pretend that Play release or account synchronization already exists.

This release closes the legacy prerequisite defect: unverified email cannot discover/claim an unowned card. First email proof invalidates credentials created before verification, including in-flight password-login and refresh requests. Already verified credentials are preserved. Historical verified takeovers require a separate evidence-based audit; this patch does not identify them retrospectively.

## Physical card

The DE/EN/TR OpSo page shows an AI-generated black OpSolid NFC concept, clearly marked coming soon. Planned retail price is EUR 24.90 including VAT, shipping separate; final price/finish follows a production sample. No order or checkout is enabled.

Start with ten outsourced samples rather than buying a card printer. Request through-dyed black matte CR80 PVC, 85.6 x 53.98 mm, about 0.76 mm, white/silver print, NTAG213, per-card QR and NDEF HTTPS URL. Test print abrasion, legibility, tap on Android/iPhone and QR before approving production.

Primary suppliers inspected on 2026-09-17:

- [NFC-Tag-Shop black matte NTAG213, double-sided print](https://www.nfc-tag-shop.de/NFC-Karte-PVC-beidseitig-bedruckt-85-6-x-54-mm-NTAG213-180-Byte-schwarz-matt-durchgefaerbt/17199UN2): listed 10/50/100-unit tiers EUR 4.61/3.32/2.81; encoding EUR 0.09/card plus EUR 5.90 setup. Verify tax, shipping and artwork quote before purchase.
- [Shop NFC custom express](https://shopnfc.com/de/nfc-karten/27-custom-nfc-cards-express-print.html): alternative short-run quote; confirm solid black finish rather than assuming it matches the concept.
- [NFC.cards double-sided NTAG213](https://nfc.cards/en/front-and-back-printing/61-custom-nfc-card-ntag213-front-and-back-printing.html): alternative retransfer printing quote.

Future NFC provisioning should use an opaque HTTPS redirect under opso.cc, not personal data or an authentication token on the tag. Keep the printed link stable while the owner changes their selected digital card. A separate single-use claim secret, authenticated owner selection, revocation and reassignment audit are required before accepting physical-card orders. NFC UID is not proof of ownership. Decide write-lock policy only after provisioning tests.

## Share previews

Card metadata must contain a personalized image and canonical URL. The legacy image and metadata routes now conceal private, unpublished and password-protected cards. Public/unlisted share previews remain supported. VERSO separately prepares 1200 x 630 photo/name cards with bounded owned-photo decoding. Preview display and cache lifetime remain controlled by WhatsApp/other receiving clients; attaching an exported image alongside the URL is a separate sharing action and cannot be forced by Open Graph metadata.

## Companion entry points and next canonical-account slice

The existing web dashboard and first-visit owner welcome sheet now show a DE/EN/TR OpSo companion entry. It explicitly states that existing website cards are not yet automatically synchronized. A live check of `https://card.opsolid.de/app/android` on 2026-09-17 returned 404, so the entry links to the existing `/<locale>/opso#availability` section. Do not change this into an install CTA until the actual download or Play destination is verified. No credentials, card ownership or legacy records are transferred by this entry.

The smallest actual same-account implementation should create **new** web cards in the canonical VERSO workspace, then let the mobile client's existing `GET /cards` load them. Implement these bounded tasks in order:

1. Add a separate OpSo browser session/BFF with fixed API origin and allowlisted routes. Reuse `POST /auth/passwordless/start`, `/auth/passwordless/verify`, `/auth/passwordless/refresh` and `/auth/logout` from `Project_VERSO/apps/api/src/auth/auth.controller.ts`. Email-code verification must happen in VERSO; a legacy website login is not equivalent proof. Protect the browser session with authenticated encryption or server-side storage, Secure/HttpOnly/SameSite cookies, same-origin/CSRF checks, refresh rotation and logout/revocation. Keep tokens out of URLs and browser storage. Preserve API throttles and add per-client BFF rate limits rather than allowing arbitrary forwarded headers. Authorization-code/PKCE handoff remains required if a subsequent cross-client authorization flow is added; it is not supplied by these OTP endpoints.
2. Build a small authenticated new-card form using `GET /templates` (`apps/api/src/cards/templates.controller.ts`), `GET /onboarding/slug-availability` and `POST /users/me/onboarding` (`apps/api/src/cards/cards.controller.ts`). Show card-language and privacy choices. Reuse `GET/POST /safety/terms-acceptance` (`apps/api/src/safety/safety.controller.ts`) before protected publishing. Preserve server-side Free-card capacity and ownership rules; never silently overwrite the user's existing card.
3. Load the canonical collection with `GET /cards`, edit with `PATCH /cards/:id`, preview with `POST /cards/:id/preview`, and explicitly publish with `POST /cards/:id/publish`. All are in `apps/api/src/cards/cards.controller.ts`. Preserve revision-conflict responses and separate draft/save from publish. The mobile client already reads the same collection in `apps/mobile/src/lib/auth/context.tsx` and `apps/mobile/src/lib/api/cards.ts`; no mobile-side copy job is needed for these new canonical cards.
4. Keep legacy website cards and public links separate until a reviewed dual-proof transfer exists. Transfer must show a field/media preview, require proof of the legacy owner and canonical account, use a one-use expiring intent, enforce workspace capacity and slug conflicts, and retain an audit/rollback mapping. Existing website photo URLs cannot bypass VERSO's owned-media ingestion rules. Do not auto-merge by matching email.
5. Before shipping the canonical slice, prove two-account isolation, unverified/expired-code rejection, CSRF rejection, refresh/logout behavior, Free-card limit, concurrent revision conflict, and web-created card visibility after ordinary mobile login. Verify any universal app link against the release-signing certificate before adding a same-card app-open CTA. The current companion entry alone is not evidence for any of these acceptance criteria.
