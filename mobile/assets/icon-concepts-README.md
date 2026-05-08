# App Icon Concepts — Digital Business Card Product

Three directions for the 1024x1024 app icon. All SVGs are inline (no external assets).
All concepts are designed to survive iOS 22% rounded-square corner masking and remain
legible at 48px notification-dot size.

Color palette used across all three:
- Turquoise: `#14B8A6` (primary mobile accent — breaks from web restraint)
- Ink: `#15120F` (dark background / body — authority, premium)
- White: `#FFFFFF` (glyph fills, highlights — clarity)

---

## Concept 1: "Presence Ring" (`icon-concept-1.svg`)

**Direction:** Abstract glyph — identity / presence / introduction.

**The idea:** Two asymmetric arcs (one at 270°, one at ~195°) orbit a bold central disc.
The outer arc is heavier; both have a gap in the top-right quadrant, creating an open
"reaching outward" silhouette. Inside the disc: an ink pupil with a turquoise inner dot —
a "live" indicator. The asymmetry is the differentiator; it prevents this from reading as
a Wi-Fi or loading icon.

**At 48px:** Collapses to a bold dot with partial wing-arcs — distinctive and unique.
The inner pupil and dot disappear, which is fine: the outer silhouette is enough.

**Trade-offs:**
- Pro: Most abstract — name-agnostic, works for any product name chosen in parallel.
- Pro: Turquoise gradient background is the most visually distinctive on a dark home screen.
- Con: Abstract glyphs require brand familiarity to be "owned" — early-stage risk.
- Con: The arc motif has mild overlap with signal/connectivity icons (though the asymmetry helps).

---

## Concept 2: "Split-K" (`icon-concept-2.svg`)

**Direction:** Custom letterform — bold, detached-arm K on ink background.

**Letter rationale:** K chosen over M/N/O/V.
- M and N: four vertical strokes — too busy at small sizes.
- O: becomes a plain ring — indistinct.
- V: reads as an arrow/down-chevron — too directional.
- K: three strokes (stem + two diagonals) — clean triforce geometry. The two diagonal arms
  naturally evoke "connecting to a source" which maps onto the business card product concept.

**The custom touch:** A deliberate 76px air gap separates the diagonal arms from the stem.
A small white node sits in the gap — a connection-point detail. At full size this is
a design feature; at 48px antialiasing closes the gap and the K reads as solid.

**At 48px:** Bold K letterform, ink bg, turquoise strokes — unmistakable even tiny.
The dual-scale behavior (open at large, closed at small) is a feature, not a bug.

**Trade-offs:**
- Pro: Strongest brand anchor — if the product name starts with K (or shares the glyph),
  this does double duty as a wordmark proxy.
- Pro: Best legibility at 48px of all three concepts — letterforms are cognitively pre-loaded.
- Con: Locks the visual identity to the letter K. If the product name shifts to something
  that starts with a different letter, this concept becomes disconnected.
- Con: Custom letterforms require a confident final name decision before refinement.

---

## Concept 3: "Folded Corner" (`icon-concept-3.svg`)

**Direction:** Pure geometric construction — chamfered square.

**The idea:** A bold ink square with a single 148px chamfer cut at the top-right corner.
The cut corner is filled with turquoise, making it the icon's one memorable detail.
An inner frame (turquoise outline, same chamfer) creates a "panel within a panel" depth.
Three horizontal lines (long/short/medium, white and turquoise) in the lower zone evoke
content rows — a name line and two detail lines — without being a literal business card photo.
A circle in the upper-left quadrant suggests an avatar/contact photo.

**At 48px:** The inner frame, lines, and circle all disappear. What remains is a bold
ink square with a single turquoise notch at top-right — one of the most distinctive
app icon silhouettes possible. The chamfer is the entire identity at small sizes.

**Trade-offs:**
- Pro: Strongest silhouette at 48px — the notched corner is unique on an app grid.
- Pro: Geometric direction is the most scalable: name-agnostic, refinable, adaptable.
- Pro: White background stands out on dark wallpapers and in the App Store grid.
- Con: The white background may feel less premium next to darker icon neighbors.
- Con: The "folded corner" has a mild document/file metaphor overlap — acceptable twist
  on the business card trope, but worth noting.

---

## Recommendation

**Primary pick: Concept 3 (Folded Corner)**

The chamfered-square notch is the strongest single distinguishing feature at small sizes,
which matters most for notification badges and home-screen grids where icons are 48-60px.
The geometric direction is also the most name-agnostic — critical since the product name
is being finalized in parallel. The white background creates contrast against dark
wallpapers and makes it pop in App Store search results.

**Second pick: Concept 2 (Split-K)** — if the product name starts with or is anchored
to the letter K. The letterform delivers the best 48px legibility of the three and the
ink-on-turquoise color story is the strongest brand expression.

**Concept 1 (Presence Ring)** is held in reserve as an alternative if the product pivots
toward a more abstract, signal/broadcast positioning (e.g., voice cards, NFC sharing).

---

## Next Steps (after Hasan picks a direction)

1. Refine the chosen concept with final product name context.
2. Export as `icon.png` (1024x1024), `adaptive-icon.png` (1024x1024 on transparent bg),
   `favicon.png` (48x48), and `splash.png` (1284x2778).
3. Update `mobile/assets/README.md` to remove the TODO and reference final files.
4. Update `app.json` splash background if the chosen icon direction changes the color story.
