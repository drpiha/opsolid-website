# Carrd.co Comparison + Verso Gap-Closure Plan

> Author: research-scout. Date: 2026-05-09. Codebase head: `e46038d` (F4 shipped). Reference: `mobile/assets/world-class-milestone-plan.md`.

## TL;DR (5 lines)

1. Carrd wins on **free-form composition** (any section in any order), **embeds-anything** (custom HTML/JS, 18 ESPs, Stripe/PayPal/Gumroad), **password-protected pages**, and a **form builder** with 18 email-platform integrations. ([Carrd Pro features](https://carrd.co/docs/pro/features))
2. Verso wins on **mobile-first creation**, **96 curated templates**, **NFC/QR/vCard share gestures**, **smart-exchange + inbox messaging**, **Discover + Events network surface**, and **EU-native GDPR posture** — all things a one-page site builder structurally cannot do.
3. **Adopt** five Carrd strengths into M1–M5: form-builder-lite (M1), curated embeds whitelist (M3), password-gated cards (M5), HTML export (M5), one-page Linktree mode (M3). **Adapt** custom HTML to a curated whitelist (security). **Reject** open marketplace + arbitrary-iframe embeds.
4. **No new M7 needed.** Each Carrd-derived feature slots cleanly into M3 or M5; an M7 would dilute the milestone discipline.
5. Pricing: hold Verso Pro at **€7/mo (€60/yr)** — same annual ballpark as Carrd Pro Plus ($49/yr) but for a richer surface (mobile creation + sharing + network + inbox). External one-liner at the bottom.

---

## 1. Carrd feature inventory (2026)

**Sections / elements** ([Carrd how-to-use guide](https://templatery.com/how-to-use-carrd/)): text, image, video, audio, form, button, divider, social-icons, columns, container, gallery (lightbox), countdown timer, table, embed (custom HTML/JS/CSS).

**Customization knobs**: colors, local fonts (Pro Standard+), spacing, animations on scroll, responsive breakpoints, dark-mode toggle, hover states. ([Carrd Pro features](https://carrd.co/docs/pro/features))

**Publishing options** ([Carrd plans](https://carrd.co/docs/pro/plans)): premium URL on `*.carrd.co`, **custom domain with Let's Encrypt SSL** (Pro Standard+), redirects, **password protection** (Pro Plus), SEO meta tags + OG image, canonical URLs, robots/sitemap (Pro Plus).

**Forms** ([nocode.mba tutorial](https://www.nocode.mba/articles/carrd-guide-tutorial)): contact, signup, custom, payment-enabled. **18 ESP integrations**: ActiveCampaign, beehiiv, Brevo, Buttondown, EmailOctopus, GetResponse, Ghost, HubSpot, Kit/ConvertKit, Klaviyo, Mailchimp, MailerLite, Mailjet, Omnisend, Sender, SendFox, SendGrid, Sendy. Submissions inbox + email autoresponder + Zapier/Make webhook out.

**Payment widgets**: Stripe Checkout, PayPal, Gumroad — embedded, not redirected.

**Analytics**: Google Analytics, Plausible, Matomo, Fathom (via Pro Standard meta-tag injection).

**Exports**: HTML+CSS download (Pro Plus only).

**Plans (annual only)**: Free (3 sites, basic), Pro Lite **$9/yr** (3 sites, no domain), Pro Standard **$19/yr** (10 sites, custom domain, forms, widgets, analytics, embeds, local fonts, meta tags), Pro Plus **$49/yr** (25+ sites, password protection, HTML export, canonical URLs, variables). ([Landingi pricing analysis](https://landingi.com/carrd/pricing/))

**2026 newcomers**: AI page-generator drafts a starting layout from a prompt; tables and countdown timers added as first-class elements. ([Carrd review 2026](https://themarketingagency.ca/blog/carrd-review/))

---

## 2. What Carrd does that Verso does NOT (ranked by user impact)

1. **Free-form section composition** — any block in any order. Verso has fixed-shape templates (96 curated layouts).
2. **Form builder with logic + 18 ESP integrations + autoresponder**. Verso's lead form is fixed-shape (name/email/message + CTAs).
3. **Embed any video/audio/widget via custom HTML**. Verso has a video field but no `<iframe>` whitelist.
4. **Password-protect a page**. Verso has `visibility=public|unlisted|private` only — no per-card password.
5. **HTML+CSS export**. Verso is mobile-app-bound; no take-it-with-you escape valve.
6. **Custom domain in mobile UX**. Domain is in the deferred-todos plan, not in the app.
7. **Stripe / PayPal / Gumroad checkout buttons** inline on the page. Verso has no commerce primitive.
8. **Countdown timers, tables, galleries with lightbox**. Verso has gallery + services repeater, no timer/table.
9. **Mailchimp/ConvertKit/Klaviyo direct signup form** for newsletter capture. Verso captures leads to its own inbox only.
10. **A/B / two-variants** of a page. Verso has none.

---

## 3. What Verso does that Carrd does NOT

1. **Native NFC + QR-share gestures, vCard download, share-to-Contacts** — built into the mobile shell.
2. **Smart Exchange** (mutual card swap with inbox-tracked outcome).
3. **Inbox messaging on the platform itself** (F4) — Carrd forms email out, no thread.
4. **Discover feed + Events tab + people-you-may-know** (network surface, not just publishing).
5. **Mobile-first creation**. Carrd's mobile editor is web-on-phone; Verso's is a native onboarding wizard.
6. **96 hand-curated designer templates**. Carrd has ~50 generic starter templates.
7. **DACH/EU GDPR-native hosting** on Hasan's VPS (`opsolid.de`). Carrd is US-hosted (AWS).
8. **Lead-form + smart-exchange + feedback CRM** as first-class concepts, not bolt-on.
9. **Live design preview FAB** with theme/layout/brand-color params via WebView.
10. **Card-deck UX** — the card *is* the surface, not a section on a page.

---

## 4. Adopt / Adapt / Reject decisions (one row per Carrd gap)

| # | Carrd capability | Decision | Rationale (≤1 line) | Slot |
|---|------------------|----------|---------------------|------|
| 1 | Free-form section composition | **Reject** | Curation IS the moat — 96 templates win the design bar; opening up flattens it. | — |
| 2 | Form builder + ESP + autoresponder | **Adapt** | Add a "lead-form custom-fields v2" (3 extra fields, ESP webhook out to Mailchimp/Kit/Brevo). No drag-drop logic. | M1 |
| 3 | Embed any HTML/JS/iframe | **Adapt** | Curated whitelist only: YouTube/Vimeo/Spotify/SoundCloud/Loom/Calendly. No raw `<script>`. | M3 |
| 4 | Password protection | **Adopt** | Cheap to ship, real demand from premium consultants. | M5 |
| 5 | HTML+CSS export | **Adopt** | Gives Pro users an exit story — strengthens trust, doesn't cannibalize. | M5 |
| 6 | Custom domain in mobile UX | **Adopt** | Already deferred; pull the wizard UI into M5 as planned. | M5 |
| 7 | Stripe/PayPal/Gumroad inline | **Adapt** | Stripe-only "Tip / book me" button using existing Stripe wiring; no PayPal, no Gumroad. | M5 |
| 8 | Countdown / table / lightbox | **Adopt** (lightbox), **Reject** (countdown, table) | Lightbox fits the gallery; countdown is launch-page-DNA, not card-DNA. | M3 |
| 9 | Newsletter ESP signup | **Adopt** via #2 | Same code path as form-builder-lite. | M1 |
| 10 | A/B variants | **Reject** | Solo-dev complexity tax; analytics signal is too weak at <100 cards/owner. | — |
| 11 | "Linktree-mode" one-page link-in-bio | **Adopt** | New `linktree` template — a layout in the existing 96-pool, not a new builder. | M3 |
| 12 | AI page generation | **Already in plan** | M1 already specs AI-draft-from-LinkedIn. Carrd validates the bet. | M1 |

---

## 5. Concrete M1–M6 amendments

After cross-checking `mobile/assets/world-class-milestone-plan.md`, the Carrd-derived adoptions slot in cleanly. **No M7 needed** — splintering a "Form Builder + Password + Embeds" milestone would compete with M3 (Network growth) and M5 (Pro tier) for the same dev hours and split the user-value story.

**M1 — Frictionless creation (amendments)**
- Add **lead-form custom-fields v2**: up to 3 owner-defined fields (label + type) on the existing lead form. Acceptance: owner adds "Company size" field; visitor sees it; submission lands in inbox + ESP webhook.
- Add **ESP webhook out** for new leads (Mailchimp / Kit / Brevo / generic-webhook). Acceptance: setting a webhook URL forwards every new lead within 5s.

**M3 — Network growth loops (amendments)**
- Add **curated embed whitelist**: YouTube/Vimeo/Spotify/SoundCloud/Loom/Calendly URL field on edit form, server-rendered as iframe with `sandbox` + CSP headers. Acceptance: pasting a YouTube URL renders a 16:9 player on the public viewer.
- Add **`linktree` template** (id 97) — vertical button-stack layout reusing the existing button-list primitive. Acceptance: new template id appears in picker; published card shows centered avatar + 6 button-rows + status banner.
- Add **gallery lightbox** to the existing gallery section. Acceptance: tapping a gallery image opens a full-screen pinch-zoom view.

**M5 — Premium tier (amendments)**
- Add **password-gated cards** as a Pro feature. New `cardData.passwordHash` (bcrypt) + cookie session on `/c/[slug]`. Acceptance: setting a password forces a password screen on the public viewer; cookie persists 30d.
- Add **HTML+CSS export** as a Pro feature. New `GET /api/v1/cards/[id]/export` returns a static-rendered zip. Acceptance: download produces a working `index.html` that renders identically offline.
- Add **Stripe "Tip / Book me" button** on edit form Gelişmiş tab. Reuses existing `/api/checkout` route. Acceptance: visitor taps button → Stripe Checkout → success → owner gets webhook + inbox notification.
- Custom-domain wizard UI was already in M5; reaffirm it pulls forward from `project_deferred_todos.md`.

**No-M7 conclusion**: 7 of 8 adopted gaps fit M1/M3/M5. The remaining adoptions (export, Stripe button) are tier-gated revenue plays — they belong in M5, not a new milestone.

---

## 6. Pricing positioning

Carrd Pro Plus is **$49/yr (~€45/yr)** for static one-page sites, capped at 25 sites. Verso Pro at **€7/mo / €60/yr** is in the same annual ballpark but pays for a *moving* product: native mobile creation, NFC/QR sharing, smart-exchange, inbox messaging, Discover network, Events, 96 curated templates, and (post-amendments) password + HTML export + curated embeds + ESP webhooks.

**External positioning sentence (Hasan can use verbatim)**:
> "Carrd is a one-page site builder. Verso is a one-tap business identity — your card lives in your phone, shares over NFC, books meetings into your inbox, and finds you at conferences. €60/year for the whole network surface, not just a static page."

---

## Sources

- [Carrd Pro features documentation](https://carrd.co/docs/pro/features)
- [Carrd Pro plans documentation](https://carrd.co/docs/pro/plans)
- [Carrd password protection docs](https://carrd.co/docs/sites/adding-password-protection)
- [Carrd Pro pricing page](https://carrd.co/pro)
- [Carrd 2026 pricing analyzed (Landingi)](https://landingi.com/carrd/pricing/)
- [Carrd 2026 review (themarketingagency.ca)](https://themarketingagency.ca/blog/carrd-review/)
- [Carrd tutorial 2026 (nocode.mba)](https://www.nocode.mba/articles/carrd-guide-tutorial)
- [Carrd how-to guide (Templatery)](https://templatery.com/how-to-use-carrd/)
- [NiftySite Carrd pricing 2026](https://niftysite.co/resources/carrd-pricing)

End of plan.
