# Verso App Icon — V2 Direction Research

Brief: Replace the rejected "Folded Corner" icon (white bg + black card + turquoise notch) with a direction that reads **professional editorial / identity mark**, not "indie startup business card silhouette." Italian publishing and bookbinder heritage is fair game; literal cards and NFC waves are not.

Palette: turquoise `#1AA6B7`, deep teal `#0F4F58`, paper `#F4F1EC`, ink `#0E1416`. Light backgrounds preferred. Must survive iOS 22% mask and 48px notification scale.

---

## 8 Directions

### 1. Aldine Anchor — printer's mark
A thick-stroke anchor entwined with a dolphin-like curve, descended directly from Aldus Manutius' 1502 Aldine Press device. Reads as "publisher's colophon," which is exactly the editorial-Italian register Hasan asked for. Rendered as a single-weight ink glyph on paper bg with a turquoise crossbar accent.
- **48px:** silhouette holds because the anchor's vertical stem and arms create a strong T-shape; the dolphin curve simplifies into one bold sweep.
- **Reference icon:** **Knopf (Borzoi)** publisher mark, also visible in **Day One** journal app icon — heraldic-glyph-on-paper.

### 2. Capital V Colophon — editorial monogram
A wide didone serif "V" (like Bodoni or Didot) set as a single ink letterform on paper, with the right diagonal stroke split into two weights — one ink, one turquoise — recalling typeset metal slugs. The serifs supply the "premium / Italian publishing" register sans-serif monograms can't reach.
- **48px:** the V is two diagonals meeting at a point — one of the most legible letterforms at micro size, second only to O and X.
- **Reference icon:** **Vinted** "V" mark, also **Vimeo** — confident single-letter monograms that survive scaling.

### 3. Page Turn (verso/recto) — folded gutter
A book gutter viewed straight-on: two facing rectangles in slightly different paper tones meeting at a hairline ink valley. The right page lifts ~10° to imply mid-turn; a turquoise "ribbon bookmark" hangs from the top. Reads as "the moment a page turns" — pure verso/recto metaphor without any business-card geometry.
- **48px:** the central vertical valley + ribbon read as one strong asymmetric vertical accent; pages flatten to a single tonal split.
- **Reference icon:** **Kindle** for the open-book metaphor done well; **Readwise Reader** for the gutter-as-identity treatment.

### 4. Engraved Initial — letterpress emboss
A turquoise serif "V" pressed into thick paper, rendered with an inner shadow + 1px highlight rim to suggest debossed ink-on-cotton stationery. The whole icon is the letter and its impression — no frame, no border, no card. Tactile, high-end, business-stationery vocabulary without depicting a card.
- **48px:** the emboss/shadow disappears but the V silhouette remains crisp; gracefully degrades to a flat letterform.
- **Reference icon:** **Paperless Post** emboss treatment; **Hallmark** legacy letterpress vibe applied at app-icon scale.

### 5. Bookbinder's Stitch — Coptic spine
A vertical column of turquoise saddle-stitches running down the center of an ink panel on paper background — the binding seam of a hand-bound book viewed from the spine. Five stitches, evenly spaced, with subtle thread-pull asymmetry. Pure craft-publishing reference, zero card semantics.
- **48px:** five dots on a dark vertical bar — reads as a distinctive constellation, not generic. The vertical anchor is unmistakable.
- **Reference icon:** **Day One** journal (binding-leather metaphor); **Penultimate** notebook stitch.

### 6. Wax Seal Sigil — heraldic mark
A circular turquoise wax-seal disc with a debossed monogram (Verso "V" interlocked with a small recto "R" or page-corner glyph) at center, sitting on paper. Confers authority and personal-correspondence ceremony — the gesture of "this is mine, sealed by me," which is the emotional core of a digital business card.
- **48px:** circular silhouette with internal contrast; the disc reads even when the monogram detail dissolves. Roundness contrasts well with the iOS square mask.
- **Reference icon:** **Hey** email (orb authority); **Cash App** circular contrast principle.

### 7. Italic Slash V — typographic gesture
A single-stroke turquoise oblique "V" rendered as if drawn with a calligraphic broad-nib pen — thick-thin contrast on the diagonals, terminal flicks at top corners. The letterform leans 12° to the right, reading as movement and signature without being a literal handwritten name. Paper bg.
- **48px:** the broad-nib weight makes the V hold mass at small sizes; the lean keeps it from reading as a chevron.
- **Reference icon:** **Notion** wordmark logic at app-icon scale; **Things 3** uses this exact "single confident gesture" principle with its checkmark.

### 8. Two-Page Spread Aperture — windowed identity
A square frame in deep teal containing two narrow vertical paper "pages" with a thin turquoise vertical line between — like looking down into an open book, top-down view. The aperture is the icon. Asymmetric inset (one page slightly wider) gives the asymmetry that prevents a generic "two columns" reading.
- **48px:** the frame + central seam reads as a strong H-vertical; the asymmetry survives. Color block stays legible.
- **Reference icon:** **Arc** browser (frame-as-identity, asymmetric internal partition); **Cron** grid-clarity.

---

## Top 3 Picks for Verso

### 1st — Direction 2: Capital V Colophon (didone monogram)
**Why:** Single letterform monograms are the most production-safe iOS direction (proven by Vinted, Vimeo, Vercel, Linear's L). The serif/didone treatment delivers the "editorial / Italian publishing" register Hasan asked for in one move, while staying name-anchored to "Verso." Survives 48px better than any other direction here. The two-weight diagonal (ink + turquoise) gives it one memorable detail without literalism.

### 2nd — Direction 4: Engraved Initial (letterpress emboss)
**Why:** Same V letterform anchor as Pick 1, but with a tactile material story (debossed paper) that reads "premium business stationery" without depicting a card. Higher craft ceiling than the flat colophon if executed precisely; risk is the emboss shadow degrading at small sizes — falls back gracefully to a flat V silhouette. Strong second because it's the only direction that addresses Hasan's "informal/dark" complaint with material vocabulary, not just shape.

### 3rd — Direction 6: Wax Seal Sigil
**Why:** The only non-letterform candidate that survives the brief. Circular silhouette gives visual contrast against the iOS rounded-square mask (most app icons read as squares; this reads as a disc-in-square). Conveys authority and ceremony — the emotional substance of identity exchange. Caveat: requires the cleanest possible internal monogram or it collapses into "generic badge" at small sizes. Pick this if Hasan wants distance from letterforms entirely.

---

## Design Constraints for the Maker Agent

- Background: `#F4F1EC` paper, optionally with a 2-3% warm grain or vignette. **No pure white**, no dark backgrounds.
- Primary glyph color: `#0E1416` ink for letterforms; `#1AA6B7` turquoise for accents/wax/secondary stroke.
- Use `#0F4F58` deep teal sparingly — only for shadows or secondary geometry.
- iOS safe zone: keep all critical mass within 832x832 of the 1024x1024 canvas (192px margin, comfortably inside 225px corner clip).
- 48px test: render at 48px, blur 1px — silhouette must remain identifiable without color.
- Avoid: gradients more than 2 stops, drop shadows beyond 8% opacity, any depiction of a card rectangle.

## Sources

- [Aldine Press / Aldus Manutius colophon history — Wikipedia](https://en.wikipedia.org/wiki/Colophon_(publishing))
- [LitHub publisher colophon ranking](https://lithub.com/an-unofficial-ranking-of-publishing-colophons/)
- [Watson-Guptill colophon by House Industries — Penguin Random House](https://global.penguinrandomhouse.com/announcements/watson-guptill-unveils-new-colophon-created-by-house-industries/)
- [MIT Press colophon 60-year history](https://mitpress.mit.edu/celebrating-60-years-of-the-mit-press-the-history-of-the-iconic-colophon/)
- [Verso / recto — Tate](https://www.tate.org.uk/art/art-terms/v/verso-recto)
- [Things 3 macOS Icon Gallery](https://www.macosicongallery.com/icons/things-3-2017-05-19/)
- [Things 3 Big Sur icon — Daniel Klopper / Dribbble](https://dribbble.com/shots/15483272-Things-3-Big-Sur-Icon)
- [The App Icon Book](https://www.appiconbook.com/)
- [Icon Design Trends 2026 — Envato Author Hub](https://author.envato.com/hub/icon-design-trends-2026/)
- [Strategic guide to 2026 iconography trends — Medium](https://medium.com/@ariniwrites/a-strategic-guide-to-2026-iconography-trends-how-to-choose-the-right-visual-style-for-your-product-s-objective-73833baf2394)
- [Cron-Notion icons — Figma community](https://www.figma.com/community/file/1329870537448686968/cron-notion-icons)
- [The art of the spine — Luke McKernan](https://lukemckernan.com/2015/12/06/the-art-of-the-spine/)
- [Best book publisher logos — The Book Designer](https://www.thebookdesigner.com/publisher-logos/)
