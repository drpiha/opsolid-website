# Round 0 — Locked Decisions

Locked 2026-05-18 after user approval (single confirmation: "Hepsini onayla,
başla"). These supersede the rejected Phase 1 copper/ink/verdigris direction
and the Phase 1 "galaxy backdrop" home composition.

Authority: this file > `docs/redesign-prompt.md` §1-§9 > `docs/research/*-audit.md`.

## 1. Palette — Direction B "Concrete Studio"

| Token              | Hex       | Use                                         |
|--------------------|-----------|---------------------------------------------|
| `--v2-bg-base`     | `#F0EFED` | Page background — concrete gray             |
| `--v2-bg-surface`  | `#E5E4E1` | Cards, panels                               |
| `--v2-bg-raised`   | `#FAFAF9` | Elevated cards (above surface)              |
| `--v2-ink-1`       | `#111827` | Body text, primary strokes                  |
| `--v2-ink-2`       | `#374151` | Secondary text                              |
| `--v2-ink-3`       | `#6B7280` | Tertiary / meta text                        |
| `--v2-accent-primary` | `#0F766E` | Deep teal — CTAs, active nodes           |
| `--v2-accent-hover`   | `#0D5F58` | Teal hover state                         |
| `--v2-accent-soft`    | `#CCFBF1` | Halo around active elements              |
| `--v2-line-ghost`     | `#D1D5DB` | Inactive grid, hairlines                 |
| `--v2-line-soft`      | `#E5E7EB` | Lighter hairlines                        |
| `--v2-motion-trace`   | `#14B8A6` | Animated packet, traveling glyph         |

Contrast ratio teal-on-concrete: 5.2:1 (passes WCAG AA).

Verso (`/products/digital-card`) keeps its own Aegean turquoise `#1AA6B7` and
Concept-3 Folded Corner icon — NOT skinned in the new palette.

## 2. Typography — Pairing 2 "Technical Warmth"

- **Display / H1–H2:** Plus Jakarta Sans (Google Fonts, free) — weight 700
  used at display scale for the TWK Lausanne register (TWK Lausanne is the
  commercial-licensed reference; we ship Plus Jakarta Sans first and can
  swap in TWK Lausanne later if budget approved). Variable: `--font-v2-display`.
- **Body:** Plus Jakarta Sans (same family) — Regular 400, Medium 500.
  Variable: `--font-v2-body`. Same family for display + body keeps the
  bundle tight; weight contrast carries the hierarchy.
- **Mono (data labels, eyebrow, code blocks):** Fira Code (Google Fonts,
  free) — Regular 400, Medium 500. Variable: `--font-v2-mono`. Berkeley
  Mono stays as an upgrade option (~$75 lifetime).
- Both: `font-display: swap`. Subsets `latin`, `latin-ext` for DE/TR coverage.

Legacy Inter / Geist / Instrument Serif / JetBrains Mono stay loaded for v1
pages until M9 promotes v2 to default and we drop the legacy stack.

## 3. Motion stack additions

- `gsap` ^3.15 — already installed. ScrollTrigger usage starts in M2.
- `lenis` ^1.3 — already installed. LenisProvider already scaffolded in
  `src/components/motion/LenisProvider.tsx`.
- View Transitions API for page transitions (Next 14 App Router supports it
  stably); Framer Motion `AnimatePresence` fallback for shared-layout cases.
- Custom cursor: desktop only, `pointer: fine` + reduced-motion check, 24px
  `mix-blend-mode: difference`, `lerp(0.15)`, magnetic on primary buttons.
- **No `@react-three/fiber` in M1-M8.** Reserved for one product subpage
  in a later round, behind dynamic import + reduced-motion gate.

## 4. Stock asset budget — free tier (Coverr + Pexels)

- **Coverr** — primary for free B2B-leaning video (server racks, hands on
  keyboard, conveyor belts).
- **Pexels** — primary for free editorial photo (KI-Schulungen workshop,
  About context, blog covers).
- **Artgrid (~$200/yr)** — DEFERRED to post-M8 unless a specific hero moment
  cannot be solved with free libraries.
- Defuse technique mandatory on every stock asset: duotone OR color wash
  OR geometric clip-path OR scanning-line CSS overlay OR blur-to-white mask
  OR extreme macro. Banlist: Storyset / unDraw / generic isometric / team-
  laughing-at-laptop / handshake / golden-hour-skyline / hand-toward-AI-brain.

## 5. Page transitions — View Transitions API default

- View Transitions API is the primary mechanism (CSS-only crossfade by
  default; per-page declarative transitions where useful).
- Framer Motion `AnimatePresence` is the fallback for shared-layout
  transitions where the native API can't yet express the choreography.
- `prefers-reduced-motion: reduce` collapses every transition to a ≤180ms
  opacity-only crossfade. No pin/scrub disabled motion.

## 6. Favicon — generated from existing brand mark

- Canonical source: `src/app/icon.svg` (already in repo).
- M1 already produced `public/icons/{favicon-16, favicon-32,
  apple-touch-icon-180, icon-512, icon-512-maskable}.png` plus
  `public/site.webmanifest`. Script: `scripts/generate-favicons.ts`.
- The theme-color hex in `metadata.viewport` will move from copper `#C27940`
  to teal `#0F766E` in M1 (light register) and `#0D5F58` (dark register —
  still light theme overall; dark color is a synonym for "deep teal" for
  user-agent UI hints, not a dark-mode signal).

## 7. Scope changes (locked)

- `/pricing` REMOVED from IA. Middleware 308 redirect → `/contact`. Page
  files deleted from `src/app/[locale]/pricing/`.
- Galaxy backdrop direction (Phase 1) ABANDONED. `GalaxyBackdrop.tsx`,
  `GalaxyScene.tsx` and `.v2-galaxy-backdrop*` CSS deleted in M1.
- `HomeV2.tsx` REWRITTEN from Stripe-style split composition per
  `docs/redesign-prompt.md` §2 Home entry.
- Light-default only. No `[data-theme="dark"]` round-trip. Existing
  no-flash theme script kept for legacy pages; v2 pages set
  `data-preview="v2"` and bypass it.

## 8. Sequencing (multi-session)

- **M1 — Foundation (THIS SESSION):** decisions doc, garbage cleanup,
  Galaxy delete, v2 tokens CSS, Tailwind v2 mapping, next/font wiring,
  HomeV2 rewrite, pricing redirect, build green, push.
- **M2 — Home polish + Leistungen rail.** Next session.
- **M3 — KI-Beratung + Prozessautomatisierung.**
- **M4 — Microsoft 365 + Interne Tools.**
- **M5 — KI-Schulungen + Products index.**
- **M6 — Product subpages (Verso keeps its own palette).**
- **M7 — About + Contact + AI Automation Check.**
- **M8 — Blog redesign + sweep.**
- **M9 — Promote v2 to default, drop legacy tokens + fonts, retire
  `?preview=v2` gate.**

Each milestone behind `?preview=v2` query gate until M9 flip.
