# OpSo Digital Card — Audit, Repair & Roadmap

_Single consolidated deliverable (founder chose "one doc + first PR" over the 12-doc set)._
_Audit date: 2026-06-15. Code state: `main` @ pull of 38 commits incl. #15._

---

## Özet (TR, 60 saniye)

Ürün sanıldığı kadar bozuk değil — fazlasıyla **inşa edilmiş** bir platform; ama "kart oluştur →
sonra giriş yap → düzenle" köprüsünde iki gerçek P0 hata vardı. İkisi de düzeltildi:

1. **Magic-link girişi** linki sunucuda iki kez tükettiği için her seferinde başarısız oluyordu → düzeltildi.
2. **Panodaki "Düzenle" butonu** edit-token taşımadığı için herkeste "Link incomplete" veriyordu → düzeltildi.

Ayrıca: ürün **tamamen ücretsiz** moduna sabitlendi (billing gizli), "sipariş/Bestellung/order"
ifadeleri "kart oluştur" ile değiştirildi, ödeme cümleleri kaldırıldı, ve şablon galerisine
**hata sınırı (error boundary)** eklendi — artık bir bozuk şablon tüm galeriyi karartamıyor.
Bu üç değişiklik de `npm run build` + `npm run audit:cards` ile doğrulandı (yeşil).

Karar bekleyenler: hangi 3 jenerik tasarım öne çıkacak, ve ana "Kart oluştur" butonu hızlı akışa
(`/card/new`) yönlendirilecek mi (bkz. §12).

---

## 1. Founder-friendly diagnosis

The digital-card **core works end to end**: create → publish → public `/c/[slug]` view →
vCard / QR / share. What was broken is the *bridge between making a card and logging back in to
edit it* — which is exactly what made the product feel unreliable.

Two confirmed, line-level P0 bugs caused most of the pain:

- **Magic-link double-consume.** The verify *page* fetched the verify *API* server-side (marking
  the single-use token used), then redirected the browser to that same API, which now saw the
  token as used and bounced to `/login?error=invalid_or_expired_link`. Any login routed through
  the page failed 100%.
- **Dashboard "Edit" structurally broken.** `CardListItem` linked to `/card/edit/{id}` with **no
  `?t=` edit-token**, but the edit page *requires* the token and rejects with "Link incomplete."
  The edit page had **no session-based ownership path** — so Edit failed for every logged-in
  owner, even though the dashboard already knew they owned the card.

Everything else (heaviness, "too many templates", "order" wording, billing bleeding through) was
real but secondary and cheap to fix.

## 2. What is real vs what is broken

**Real and working:** Next.js 14 App Router + Prisma/Postgres (42 models); public card
`/c/[slug]` (contact buttons, vCard, QR, share, SEO, empty-section hiding, "create your own"
footer); uploads (`/api/uploads`, 5 MB img / 30 MB video, sanitized, Vercel-Blob-or-local);
**97 React templates, all with thumbnails, mojibake already fixed**; a **fast 5-field create flow
already exists** at `/[locale]/card/new` (`QuickCreatePage`, FREE, instant publish); dashboard
list with Share/Delete; manage page (leads + short-links + stats); Google OAuth; editor with live
preview + save-state + optimistic concurrency.

**Was broken / off (status after this engagement in brackets):**
- Magic-link verify double-consume — `src/app/[locale]/(auth)/magic-link/verify/page.tsx` **[FIXED]**
- Dashboard Edit link missing token — `src/components/dashboard/CardListItem.tsx` +
  `dashboard/cards/page.tsx` + edit `page.tsx` **[FIXED, quick path]**
- Template gallery had no error boundary — `…/sections/TemplateGallery.tsx` **[FIXED]**
- `CARD_PRICING_MODE=freemium` in `.env.example` (billing visible if VPS copied it) **[FIXED → all_free]**
- "order/sipariş/Bestellung" + "after payment" copy **[FIXED in the create flow]**

**Heavy but not broken (kept):** `OrderFormSection.tsx` (3,228 lines, 35+ fields) and
`CardEditClient.tsx` (2,381 lines). Demote the order form behind the fast flow rather than rewrite.

## 3. Top risks (ranked)

| # | Risk | Status |
|---|---|---|
| 1 | **P0** Magic-link login fails (double-consume) | ✅ Fixed |
| 2 | **P0** Dashboard "Edit" fails for all owners | ✅ Fixed (quick path) |
| 3 | **P1** Gallery had no error boundary — one bad template blanks the grid | ✅ Fixed |
| 4 | **P1** `.env.example` shipped `freemium` → billing visible | ✅ Fixed (`all_free`) |
| 5 | **P1** `NEXT_PUBLIC_SITE_URL` misconfig → magic-link emails point to localhost | ⏳ Add startup/health assertion (30-day) |
| 6 | **P1** Email-scanner prefetch (Outlook SafeLinks) consumes single-use token | ⏳ Consider confirm-click verify (30-day) |
| 7 | **P2** `ADMIN_TOKEN` in URL query string (logs/history/referrer leak) | ⏳ Move to header (30-day) |
| 8 | **P2** `editToken` never expires; leaked email = permanent edit access | ⏳ Document / optional rotation |
| 9 | **P2** `CRON_SECRET` missing from `.env.example` → GDPR retention cron silently off | ⏳ Document (90-day GDPR) |
| 10 | **P2** Seeded demo public cards co-mingled with real cards, no "DEMO" badge | ⏳ Add badge (30-day) |

## 4. Recommended simplified scope (MVP)

**One sentence:** _Create a beautiful, mobile-friendly digital business card in under a minute,
log in anytime with a link or Google to edit it, and share it by link / QR / WhatsApp —
recipients need no app._

- **Primary path = the fast one.** Make `/[locale]/card/new` the default "Create your card"
  target. Demote the 35-field order form.
- **Show ~3 generic designs** up front; keep the other 94 in-repo behind "Browse all designs" —
  never required to create a card.
- **Free everywhere** (`all_free`, no billing step, no Pro gates, no price copy).
- **Account ↔ card bridge works:** login → dashboard → Edit / Preview / Share / Delete.
- **Keep JSON `cardData`** (guarded by `npm run audit:cards`); no schema migration.
- **Defer:** Voice Agent, Inbox v2, NFC/Wallet polish, normalized schema, custom domains.

## 5. Competitor research summary

Knowledge-level (expand with live web research on request). The lesson is consistent: **do not
compete on template count.**

| Product | Positioning | Free plan | QR | NFC | Wallet | vCard | Edit after publish | No-app for recipient | EU/GDPR msg |
|---|---|---|---|---|---|---|---|---|---|
| Blinq | App-first personal card | Yes | Yes | Card add-on | Yes | Yes | Yes | Yes | Weak |
| HiHello | Contact mgmt + card | Yes | Yes | Card add-on | Yes | Yes | Yes | Yes | Weak |
| Popl | NFC hardware + teams | Limited | Yes | **Core** | Yes | Yes | Yes | Yes | Weak |
| Mobilo | NFC for teams/CRM | No | Yes | **Core** | Yes | Yes | Yes | Yes | Some (EU sales) |
| V1CE | Premium NFC cards | No | Yes | **Core** | Yes | Yes | Yes | Yes | Weak |
| Spreadly | **EU/DSGVO** digital card | Yes | Yes | Optional | Yes | Yes | Yes | Yes | **Strong (DE)** |
| HiHello/others | — | — | — | — | — | — | — | — | — |

**OpSo's defensible lane:** simpler + faster creation, **DE/TR/EN multilingual**, **EU/GDPR-native**,
editable after publishing, no app for recipients, **free to start**. Spreadly is the closest
positioning competitor (German, DSGVO) — beat them on speed-to-first-card and TR/EN reach.

## 6. Technical architecture recommendation

- **Single card model stays JSON** (`CardOrder.cardData`), guarded by `npm run audit:cards`. The
  normalized tables from the brief are the documented *future* target, not MVP work.
- **Unify ownership.** Two disjoint systems exist: account/session vs per-order `editToken`.
  Short-term (done) we pass the token through the dashboard link. Proper fix (30-day): edit page
  + `/api/card/edit/*` accept **either** a valid `editToken` **or** a session user who owns the
  card (`order.userId === user.id`), so the token never needs to be in the URL.
- **Safe rendering everywhere a template mounts** (gallery done; apply same boundary to editor
  preview + dev gallery next).
- **Fast create is the product.** Lean on `QuickCreatePage`; treat `OrderFormSection` as optional
  "advanced".

## 7. Auth / login repair plan

**Done:**
- Magic-link verify page is now a pure pass-through redirect to
  `/api/auth/magic-link/verify?token=…` — no server-side fetch, no double-consume.
- Dashboard Edit works: owned-cards query selects `editToken`; `CardListItem` builds
  `…/card/edit/{id}?t={editToken}` (falls back to the resend-link recovery screen if a token is
  ever missing, instead of a dead end).

**Next (30-day):**
- Add session-ownership path to the edit page + `/api/card/edit/*` (drop token-in-URL for
  logged-in owners).
- Assert `NEXT_PUBLIC_SITE_URL` is set and non-localhost at startup / in `/api/health`.
- Consider a confirm-click verify step to survive email-scanner link prefetch.
- Surface a claim→edit nudge for claimable cards.

## 8. Template / theme repair plan

**Done:**
- Added reusable `TemplateErrorBoundary` (`src/components/cards/TemplateErrorBoundary.tsx`) and
  wrapped the live preview in `TemplateGallery.tsx`. A throwing template now degrades to a
  skeleton instead of blanking the carousel — this is the true fix for "blank/server-error
  templates" (it was fragility, **not** 47 corrupt cards; mojibake was already fixed).

**Next:**
- Apply the same boundary to the editor live preview and `/dev/template-gallery`.
- Mirror sample photos to `public/images/samples/` (drop the remote Unsplash dependency).
- Add an assertion in `scripts/audit-template-coverage.ts`: every `templateRegistry` entry has a
  matching sample (guards the silent "Coming soon" trap).
- **Feature ~3 generic designs** in the create flow — **DONE**: the fast `/card/new` flow now
  shows a 3-up starter picker mapped to the sector-neutral universal layouts —
  **Classic = 93 (Pure Swiss), Modern = 92 (Noir Luxury), Visual = 94 (Vivid Bold)** — defaulting
  to Classic. The other 94 stay in `registry.ts` (not deleted), reachable via the full form's
  "Browse all designs".

## 9. Roadmap (7 / 30 / 60 / 90)

**7-day stabilization — DONE this engagement:** magic-link fix; dashboard edit fix; force
all-free + `.env.example`; order/sipariş wording + payment-copy removal; gallery error boundary.

**30-day MVP:** session-ownership on edit page+APIs; make `/card/new` the primary CTA; curate 3
generic designs + "browse all"; local sample photos + coverage assertion; demo-card "DEMO" badge;
`ADMIN_TOKEN` → header; editor preview error boundary.

**60-day beta:** pilot users; media hardening (orphan cleanup, broken-image fallback in
templates); DE/TR/EN UI parity sweep; admin template QA view (active/hidden/broken); Sentry
alerting; responsive polish.

**90-day launch:** landing rewrite around "free, fast, no app for recipients"; GDPR cleanup
(`CRON_SECRET` documented + retention verified, data export/delete); NFC/Wallet plan; first
reference cards; onboarding email sequence.

## 10. First implementation — done & next

**Shipped (3 small, reviewable change-sets, all verified `build` + `audit:cards` green):**
- **PR1 (P0 bugs):** magic-link + dashboard edit.
- **PR2 (free + wording):** `all_free` default props + `.env.example`; order/sipariş/Bestellung →
  create-card; removed "after payment" copy.
- **PR3a (template safety):** gallery error boundary.

- **PR3b (designs):** the fast `/card/new` flow now offers a 3-up starter design picker
  (Classic/Modern/Visual → ids 93/92/94), defaulting to Classic — replaces the silent single
  default. Verified `build` green.
- **PR4 (MVP hero):** rewrote the OPSO SMART product-page hero + how-it-works across de/en/tr to
  the free MVP (no metal card, no NFC, no Wallet, no hardware); repointed the primary CTA from the
  in-page order form (`#order`) to the fast `/card/new` flow.
- **PR5 (copy scrub):** removed every NFC / metal / Wallet / tap-to-share and every
  premium / upgrade / "free-to-start" mention across de/en/tr — homepage chips, card landing
  tagline+body, the "physical NFC card?" FAQ (reframed to "does the recipient need an app?"), meta
  descriptions, products overview, and pricing-tier feature strings. Verified `tsc --noEmit` (the
  locale-parity gate) green. Note: the €149/€299 card tiers exist only as data and are **not
  rendered** under all-free (the only render site is the gated digital-card page; the voice page
  pulls voice tiers only).

**Resolved this session:** OPSO SMART hero positioning — founder confirmed "no metal card, move to
the new MVP." **Still open (§12):** session-ownership on the edit route (drop token-in-URL, 30-day);
optional em-dash → hyphen sweep in card copy.

### Create/Edit unification (founder-directed, 2026-06-16)
Problem: three divergent surfaces — fast `/card/new`, heavy `OrderFormSection` (~3,228 lines, reached
by picking a template), heavy `CardEditClient` (~2,381 lines). Target: **one simple, progressive
builder for create AND edit** (essentials open: photo, logo, name, title, company, phone, email,
social; collapsible "Daha fazla": WhatsApp, video, gallery, website, address, bio; advanced:
services, colours, slug, visibility). Approach: **phased + reuse existing field components.**
- **Faz 1 (DONE):** gallery "select design" now navigates to `/card/new?template=X` (not the heavy
  form); `/card/new` gained logo upload, an always-visible social block, and a collapsible "Daha
  fazla" (WhatsApp/website/address/bio/video URL). Both create entry points are now the same simple
  flow.
- **Faz 2 (next):** make the editor open in the same simple progressive view (essentials + collapse),
  add gallery-photo + self-hosted video upload, move AI/analytics/CRM behind "Gelişmiş"/the manage
  page.
- **Faz 3:** retire `OrderFormSection`.

## 11. Files changed in this engagement

**PR1**
- `src/app/[locale]/(auth)/magic-link/verify/page.tsx`
- `src/app/[locale]/dashboard/cards/page.tsx`
- `src/app/[locale]/dashboard/cards/CardListClient.tsx`
- `src/components/dashboard/CardListItem.tsx`

**PR2**
- `src/content/en.ts`, `src/content/de.ts`, `src/content/tr.ts`
- `src/app/[locale]/products/digital-card/sections/OrderFormSection.tsx` (default prop + eyebrow)
- `src/app/[locale]/products/digital-card/DigitalCardPage.tsx` (default prop)
- `src/app/[locale]/card/edit/[orderId]/ResendLinkButton.tsx`
- `src/app/[locale]/card/manage/[orderId]/page.tsx`
- `.env.example`

**PR3a**
- `src/components/cards/TemplateErrorBoundary.tsx` (new)
- `src/app/[locale]/products/digital-card/sections/TemplateGallery.tsx`

**PR3b**
- `src/app/[locale]/card/new/QuickCreatePage.tsx` (3-design starter picker)
- `src/content/en.ts`, `src/content/de.ts`, `src/content/tr.ts` (design labels)

**PR4**
- `src/content/{en,de,tr}.ts` (`v2.digitalCard.hero` + `howItWorks` → MVP)
- `src/app/[locale]/products/digital-card/DigitalCardPage.tsx` (hero CTA → `/card/new`)

**PR5**
- `src/content/{en,de,tr}.ts` (NFC/metal/Wallet/premium/"free-to-start" scrub across homepage,
  card landing, FAQ, meta, products overview, pricing-tier strings)

## 12. Open questions for the founder

1. **Pace:** PR1–PR3a are shipped & verified locally. Continue straight into PR3b (CTA + 3
   designs) and the 30-day items, or pause for review after each?
2. **The 3 generic designs:** pick names "Classic / Modern / Visual" mapped to 3 of the existing
   universal templates (ids 92–96 are the non-sector "universal" layouts — good candidates), or
   do you want to eyeball the live gallery and choose?
3. **Primary CTA:** make every "Create your card / Start free" button go to the fast `/card/new`
   flow (recommended for "easy & fast"), or keep the heavy order form as the default entry?
4. **Edit-token future:** eventually drop the token entirely for logged-in owners (account-only),
   or keep the token path for account-less "create at a trade-fair booth" users?
5. **OPSO SMART hero:** the NFC/metal-card hero (`digitalCard.hero`, CTA "Muster bestellen" /
   "Örnek sipariş et") is a *separate physical-product* framing — left untouched on purpose.
   Rewrite it toward the free digital card, or keep the NFC positioning?

---

## Verification performed

- `npm run build` — compiled successfully, types + ESLint clean, 348/348 static pages generated.
- `npm run audit:cards` — "No errors — every visual field is natively rendered or wrapper-covered."

**Manual test plan (recommend running against a deploy):**
- Magic-link: request on `/login` → click → land authenticated on `/dashboard/cards`; re-click the
  used link → "expired" UI (single-use intact).
- Edit: dashboard → ⋯ → Edit → editor loads with data (no "Link incomplete") → change a field →
  Save → public `/c/[slug]` reflects it.
- Google: sign in → dashboard → Edit works the same.
- Regression: anonymous `/c/[slug]` still renders; existing order-email `?t=` links still work;
  create flow shows no price / billing step.
