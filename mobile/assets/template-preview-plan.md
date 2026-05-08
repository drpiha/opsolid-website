# Template Preview Generation Plan

## Verdict
**Recommend Option 1 — Server-side render + Puppeteer.**
The pipeline already exists. We are not building it from scratch; we are widening a 12-entry loop to 96.

## Trade-off Matrix
| # | Option | Pros | Cons | Effort |
|---|---|---|---|---|
| 1 | Puppeteer screenshot of `/dev/template-preview/[slug]` | True visual fidelity; auto-regenerates on template edits; infra already shipped | Needs dev server running; ~3-5 min wall time for 96 captures | **Low (existing)** |
| 2 | Static SVG from `layoutKey` + `themeKey` | No browser dep; instant | Looks like a wireframe — customer can't tell templates apart visually | Low |
| 3 | DALL-E / Midjourney generation | Pretty | Off-brand, non-deterministic, doesn't match the actual rendered card, manual cost | High |
| 4 | Typography-only thumbnail (drop image) | Honest, never broken; tiny bundle | Wastes the v2 components we already have; 96 cards look samey | Low |

## What's Already Built (verified)
- Route exists: `src/app/dev/template-preview/[slug]/page.tsx` — chrome-less, dev-only, renders the v2 component at 440px on white at production fidelity.
- Sample data exists: `src/config/card-template-samples.ts` exports `cardTemplateSamples: Record<number, SampleData>` with **all 96 ids** wired up (1..96), each with `slug`, `cardData`, `photoUrl`, brand hexes.
- Registry exists: `src/components/cards/templates/v2/registry.ts` resolves id → component for the same range.
- Puppeteer script exists: `scripts/generate-template-thumbnails.ts` (npm script: `generate-thumbnails`) — finds Chrome, walks a slug list, screenshots 540×960 @2x, writes `public/images/templates/card-NN.png`.
- **Only blocker**: line 50 of that script hard-codes a 12-entry `SAMPLES` array.

## Implementation Steps (Maker)

1. **`scripts/generate-template-thumbnails.ts` — replace the hard-coded list.**
   Delete the literal `SAMPLES` array (lines ~45-63). Replace with a runtime read of the catalog so we don't drift again. Keep the `id`/`slug` shape:
   ```ts
   import { cardTemplates } from "../src/config/card-templates";
   import { cardTemplateSamples } from "../src/config/card-template-samples";
   const SAMPLES: SampleRef[] = cardTemplates
     .filter((t) => t.isActive && cardTemplateSamples[t.id])
     .map((t) => ({ id: t.id, slug: cardTemplateSamples[t.id].slug }));
   ```
   The script already runs through `tsx`, so `@/`-alias note in the existing comment is stale — relative imports work. Verify by running locally.

2. **Add concurrency.** 96 sequential captures at ~3 s each is ~5 min. Process 4 in parallel (one browser, four pages). Cap with a tiny semaphore (no new dep).

3. **Dedupe by content hash (optional but cheap).** After `page.screenshot({ path })`, hash the PNG. If two ids produce identical hashes (sample data collision), log a warning — that's a real bug in the sample, not a screenshotter bug. Don't skip the write.

4. **`package.json` — add the requested alias.** Keep `generate-thumbnails` for back-compat, add:
   ```json
   "gen:template-previews": "tsx scripts/generate-template-previews.ts"
   ```
   Rename the file or symlink — the user asked for `scripts/generate-template-previews.ts`. Recommend a `git mv` + alias rather than two scripts.

5. **CI hook (deferred, not in this milestone).** A GH Action that runs on PRs touching `src/components/cards/templates/v2/**` or `src/config/card-template-samples.ts`, boots `next dev`, runs the script, commits regenerated PNGs. Note in plan only — don't implement until templates stabilize.

## Tests
- `scripts/generate-template-previews.test.ts` (Vitest) — assert SAMPLES list length === active+sampled catalog count; assert no duplicate ids/slugs.
- Manual smoke: run `npm run dev` + `npm run gen:template-previews`, expect 96 PNGs under `public/images/templates/`, each non-zero bytes.

## Ready?
**Ready to proceed** — single file edit + a script rename. No schema, route, or mobile changes needed.
