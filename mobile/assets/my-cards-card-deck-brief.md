# My Cards — Card Deck Redesign Brief

**Status:** Ready for Maker implementation.
**Replaces:** `mobile/app/(app)/cards.tsx` (full rewrite) + `mobile/src/components/cards/CardListItem.tsx` (replaced by new tile component).

---

## Files to Touch

| File | Action |
|---|---|
| `mobile/app/(app)/cards.tsx` | Full rewrite — deck screen |
| `mobile/src/components/cards/CardDeckTile.tsx` | New — animated card tile |
| `mobile/src/components/cards/CardDeck.tsx` | New — stacked deck + fan-out container |
| `mobile/src/components/cards/CardDeckFAB.tsx` | New — floating action button with pulse |
| `mobile/src/components/cards/CardDeckEmpty.tsx` | New — zero-card hero state |
| `mobile/src/components/cards/CardListItem.tsx` | Unchanged — keep for other uses |

---

## 1. Card Tile Dimensions and Brand Rendering

Each card is a **5:3 aspect tile**, width = screenWidth − 48 (24pt side margins each), height = width * 0.6.

On a 390pt screen: `tile = 342 × 205 pt`.

Brand fields from `ApiCard`: `brandPrimaryHex` (background tint band), `brandAccentHex` (accent dot), `photoPath` (avatar image), `cardData.name`, `cardData.title`.

**Tile anatomy (top-to-bottom):**

```
+------------------------------------------+
|  [primary band — top 12% height, 24pt]   |
|  [accent dot 6pt, right-aligned in band] |
+------------------------------------------+
|  [avatar 40x40, top-left, 12pt from edge]|
|  [name — 16pt semibold, ink[100]]        |
|  [title — 13pt regular, ink[300]]        |
|                                          |
|  [slug — bottom-right, 11pt, ink[400]]   |
|  [status dot 6pt — bottom-left]          |
+------------------------------------------+
```

**Inner stroke:** `borderWidth: 0.5`, color = `accentHex` at 30% opacity (or `teal[500]` at 30% when `brandAccentHex` is null). Applied via `borderColor`.

**Card surface shadow (deck top card):**
```
shadowColor: '#000'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.12
shadowRadius: 12
elevation: 6
```

**Press feedback (worklet):**
```
scale: withSpring(0.97, { damping: 20, stiffness: 300 })
shadow grows: shadowOpacity → 0.20, shadowRadius → 16 (use a separate Animated.View wrapper)
```
Call `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` from JS side (not worklet — expo-haptics is not worklet-safe). Trigger in `onPressIn`.

**Text shadow (name + title):**
```
textShadowColor: 'rgba(0,0,0,0.08)'
textShadowOffset: { width: 0, height: 1 }
textShadowRadius: 1
```

---

## 2. Deck — Collapsed State (Stacked)

Show the top 4 cards. Cards behind the top card are progressively offset, scaled, and dimmed. Index 0 = frontmost (top).

**Transform formula per layer `i` (i = 0 is the visible front card):**

```
translateY(i):  i * 10     // pt, positive = pushes card down (behind)
translateX(i):  i * 7      // pt, alternating sign optional for natural fan feel
scale(i):       1 - i * 0.04   // 1.0 / 0.96 / 0.92 / 0.88
opacity(i):     1 - i * 0.15   // 1.0 / 0.85 / 0.70 / 0.55
zIndex(i):      4 - i
```

When `items.length > 4`, render only 4 layers; show a badge "+N" (N = items.length - 4) on the bottom-most visible layer, bottom-right corner, 20×20, teal[500] fill, white text 10pt bold.

**Mount-time stagger (worklet using `withDelay + withSpring`):**

```ts
// For each card layer i:
initialTranslateY = 40   // starts 40pt below final position
initialOpacity = 0

runOnUI(() => {
  translateY_sv[i].value = withDelay(
    i * 60,
    withSpring(finalTranslateY, { damping: 18, stiffness: 180 })
  )
  opacity_sv[i].value = withDelay(
    i * 60,
    withTiming(finalOpacity, { duration: 300 })
  )
})()
```

Declare one `SharedValue<number>` pair per slot (max 4): `deckTranslateY_0..3`, `deckOpacity_0..3`. Keep outside the component using `useSharedValue`.

**Collapsed ASCII mockup:**

```
        +------------------------------------+
        |  [Card 3 — dimmed, 88%, offset]   |
       +------------------------------------+|
       |  [Card 2 — dim, 92%, offset]      ||
      +------------------------------------+||
      |  [Card 1 — slight dim, 96%]       |||
     +------------------------------------+|||
     |                                   ||||
     |   [TOP CARD — full, 100%]         ||||
     |   Avatar  Name / Title            ||||
     |   ·published          /c/slug     ||||
     |                                   ||||
     +------------------------------------++++

     Below deck: "Add another card" link (secondary, only when cards > 0)

                              [ + ]   <- FAB, bottom-right
```

---

## 3. Deck — Fanned State (Vertical Scroll)

**Trigger:** tap the top card while deck is collapsed.
**Exit:** tap the top card again, or swipe down on the scroll container.

When fanning out, each card animates from its stacked position to a vertical list position using `withSpring`. The scroll view underneath becomes interactive.

**Shared values for fan-out (one per card slot):**

```ts
// Per card i:
fanTranslateY_i: starts at stackedOffset, springs to i * (TILE_HEIGHT + 16)
fanScale_i:      starts at stackedScale, springs to 1.0
fanOpacity_i:    starts at stackedOpacity, springs to 1.0
```

Use `useAnimatedStyle` on each card; derive all values from a single `isFanned: SharedValue<boolean>` driving a `withSpring(isFanned.value ? 1 : 0)` progress value, then interpolate per card.

The container height must also animate (use `useAnimatedStyle` on a wrapper `Animated.View`) from deck height (~300pt) to `cards.length * (TILE_HEIGHT + 16)` so the parent scroll view expands correctly. Use `withSpring` for height — be aware height animation is JS-driven in RN (not UI-thread); cap card count at 20 before worrying about perf.

**Fanned ASCII mockup:**

```
     +------------------------------------+
     |   [Card 1 — TOP, full size]       |
     |   Avatar  Name / Title            |
     +------------------------------------+

     +------------------------------------+
     |   [Card 2 — full size]            |
     |   Avatar  Name / Title            |
     +------------------------------------+

     +------------------------------------+
     |   [Card 3 — full size]            |
     |   Avatar  Name / Title            |
     +------------------------------------+

                              [ + ]   <- FAB still visible
```

Tap on any non-top card while fanned navigates to `/(app)/cards/[id]`.
Tap on the top card while fanned: collapse back to deck.

---

## 4. FAB — Floating Action Button

Position: absolute, bottom = 32 + safeAreaInsets.bottom, right = 24. Size: 64 × 64. Shape: circle (borderRadius: 32). Color: `teal[500]`. Icon: `Plus` from lucide-react-native, size 28, color white. Shadow: `shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: {width:0, height:6}`.

**Pulse animation (0-card state only — worklet loop):**

```ts
// On mount when items.length === 0:
fabScale.value = withRepeat(
  withSequence(
    withSpring(1.06, { damping: 8, stiffness: 120 }),
    withSpring(1.0,  { damping: 8, stiffness: 120 })
  ),
  -1,   // infinite
  true  // reverse
)
// Approximate period ~2.5s — achieved by spring physics, not duration.
```

Stop the loop once `items.length > 0` by setting `fabScale.value = withSpring(1.0)` and not re-running `withRepeat`.

**Text bubble (one-time, 0-card state):** A small `View` anchored above the FAB, `backgroundColor: teal[700]`, `borderRadius: 10`, padding 8×12, text "Tap to create your first card" 13pt white. Animate in with `withDelay(800, withSpring(...))` from opacity 0 + translateY 8. Never shows again once user has tapped (use a local `useState` dismissed flag — no need to persist).

**Secondary affordance (cards > 0):** Below the deck area, a `TouchableOpacity` with text "Add another card" in `teal[500]`, 15pt, underline style. Minimum height 44pt. Navigates to `/(app)/cards/create`.

---

## 5. Empty State (0 cards)

Replace FlatList + empty component with a dedicated `CardDeckEmpty` component:

- Center of screen: a 180×108 rounded rectangle (card silhouette), `backgroundColor: theme.bg[2]`, `borderWidth: 1`, `borderColor: theme.line.DEFAULT`, `borderRadius: 16`.
- Overlaid on it: a `Plus` icon, size 40, color `teal[500]`, centered.
- Below silhouette, 24pt gap: "Create your first card" — 20pt, `fontWeight: '600'`, `theme.ink[100]`.
- Below that, 8pt gap: "It takes 30 seconds" — 14pt, `theme.ink[400]`.
- Tapping anywhere on the silhouette + text block navigates to `/(app)/cards/create`.
- FAB still shows and pulses.

---

## 6. Screen Layout in cards.tsx

Remove `Stack.Screen` `headerRight` "+" entirely. Set `headerShown: false` or keep a bare header title with no right action. The FAB replaces it.

Wrap the screen body in a `View` with `flex: 1, position: 'relative'` so the FAB can be positioned absolute over the scroll content.

Loading state: keep existing `ActivityIndicator` centered, color `teal[500]` (not copper — this is Verso).

Error state: keep existing `renderError()` centered layout.

---

## Open Product Questions

1. **"+N" badge on 50 cards:** The brief caps deck display at 4 layers. If Hasan has 50 cards, the badge would say "+46". Does he want "4+" instead (cap the number at a display max)? Suggest: show "+N" up to "+9", then "+9+" beyond 13 total. Confirm with Hasan before implementing.

2. **Fan-out on 10+ cards:** If a user fans out 10+ cards, the animated container height becomes very large. Recommend capping fan-out scroll at 10 visible cards, with a "Show all X cards" button below that navigates to a dedicated full-list screen (the current FlatList view, adapted). This avoids the height-animation perf problem and is a natural product boundary anyway.

3. **Selecting a "default" card:** Fanning out implies the user wants to pick a card. Is there a concept of a default/active card? If so, the top card of the collapsed deck should always be the default one. This needs a product decision before the fan-out tap target is wired.
