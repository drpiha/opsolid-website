# Verso Edit Experience — Extension Brief
**Authored by:** Scout (UX/UI research agent)
**Depends on:** edit-form-simplification-brief.md (3-tab restructure, approved)
**Status:** Ready for maker implementation

---

## Context

Hasan's post-testing feedback identifies four concrete friction points on the card edit screen (`mobile/app/(app)/cards/edit/[id].tsx`):

1. Scrolling through the template grid fights the parent vertical ScrollView — the user cannot scroll templates without accidentally scrolling the form.
2. Templates cannot be previewed at full size before applying.
3. Layout, Theme, QrStyle, and BrandColor changes are invisible until publish — no in-form feedback that anything happened.
4. The save bar hides the last form section — the user cannot scroll to the bottom.

This brief extends the approved 3-tab restructure with specific solutions for all four issues.

---

## Fix 1 — Template Picker: Kill the Scroll Fight, Add Full Preview

### Problem in code

`TemplateSection` in `mobile/src/components/cards/CardFormSections.tsx` (lines 515-595) renders a fixed-height `View` (`templateGridWrap`, height 320 at line 1025) containing a vertical `FlatList` with `nestedScrollEnabled`. On Android, the gesture disambiguator between the inner FlatList and the parent ScrollView is unreliable — users trying to scroll templates sideways or vertically hit the parent scroll instead.

### Solution A: Horizontal Carousel Strip (preferred, lower complexity)

Replace the 3-column vertical FlatList entirely with a horizontal `FlatList` inside `TemplateSection`. No `templateGridWrap` fixed-height container. The carousel scrolls left-right; the parent ScrollView owns vertical — there is no gesture conflict.

**Cell dimensions:** each card is 100px wide, height = `Math.round(100 / 0.6)` = 167px (same 3:5 portrait ratio), plus 20px label row = 187px total row height. The `contentContainerStyle` has `paddingHorizontal: 16` and `gap: 10` between cells. Set `horizontal={true}`, `showsHorizontalScrollIndicator={false}`, `snapToInterval={110}` (cell width + gap), `decelerationRate="fast"` so swiping snaps cleanly one template at a time.

**Touch on a cell does two things:** (a) fires `onChange(item.id)` to select, AND (b) opens the template preview modal (see below). The selected state is still indicated by a copper border — the two gestures (tap-to-select vs tap-to-preview) are the same tap; the modal provides the deliberate preview + confirm flow.

**File touches:**
- `mobile/src/components/cards/CardFormSections.tsx` lines 384-404: remove `TEMPLATE_GRID_HEIGHT`, `TEMPLATE_COLUMNS`, `templateCellWidth()`, `TEMPLATE_CELL_WIDTH`, `TEMPLATE_CELL_IMAGE_HEIGHT`, `TEMPLATE_CELL_LABEL_HEIGHT`, `TEMPLATE_ROW_HEIGHT` constants — these are grid-specific and no longer needed.
- `mobile/src/components/cards/CardFormSections.tsx` lines 455-513: rewrite `renderCell` with new dimensions; remove `numColumns`, `columnWrapperStyle`, `getItemLayout` props; add `horizontal={true}`, `snapToInterval`, `decelerationRate`.
- `mobile/src/components/cards/CardFormSections.tsx` lines 556-593: replace the `templateGridWrap` View + inner FlatList with the horizontal FlatList directly (no wrapping fixed-height container).
- `mobile/src/components/cards/CardFormSections.tsx` lines 1024-1029: remove `templateGridWrap` style from `StyleSheet.create` block.

**TemplateSection props change:** add `onPreviewRequest: (templateId: number) => void` prop. The cell's `onPress` calls both `onChange(item.id)` and `onPreviewRequest(item.id)`.

### Template Preview Modal

Add a new screen file at `mobile/app/(app)/cards/template-preview.tsx` using Expo Router's modal presentation. Register it as a modal in `mobile/app/(app)/_layout.tsx`.

The screen receives `templateId` (number) and `previewPath` (string, the same `item.previewPath` URL from the template catalog) via `useLocalSearchParams`. It renders a full-screen `Image` sourced from the `previewPath` URL (constructed with `${API_BASE}${previewPath}` if relative, same logic as `CardFormSections.tsx` lines 457-461). Target image dimensions: 540x960 (the Puppeteer output format from `template-preview-plan.md`).

Two buttons at the bottom, inside a safe-area-aware footer:
- "Uygula" (Apply): calls `router.back()` AND passes a return param via `router.setParams` or a callback prop indicating the selected template id. The cleanest pattern in Expo Router is to push the modal from `edit/[id].tsx` with `router.push({ pathname: '/(app)/cards/template-preview', params: { templateId: item.id, previewPath: item.previewPath } })` and, on Apply, pop back with a route param: `router.back()` + then in `edit/[id].tsx`, listen for a `selectedTemplateId` param change via `useLocalSearchParams` in a `useEffect`.
- "Iptal" (Cancel): `router.back()` with no selection change.

The user can swipe horizontally between templates in the preview modal using a horizontal `FlatList` or `ScrollView` in paging mode (snapToInterval = screen width). Pass the full filtered template list as a serialized param or load it fresh inside the modal from `listTemplates()` (already cached on the API layer).

**File touches:**
- `mobile/app/(app)/cards/template-preview.tsx` — new file (full-screen modal)
- `mobile/app/(app)/_layout.tsx` — add `template-preview` to Stack screens with `presentation: 'modal'`
- `mobile/app/(app)/cards/edit/[id].tsx` line 423: update `TemplateSection` call to pass `onPreviewRequest` callback that calls `router.push` with template params
- `mobile/src/components/cards/CardFormSections.tsx` lines 405-413: add `onPreviewRequest` to `TemplateSection` prop signature

---

## Fix 2 — Design Picker Live Feedback: Preview FAB

### Problem in code

`LayoutSection` (lines 601-650), `ThemeSection` (lines 656-701), `QrStyleSection` (lines 703-763), and `BrandColorsSection` (lines 243-265) all commit their selection to React state immediately, but there is no visual output in the form. The user does not know if "cinema" looks better than "bento" without publishing.

### Solution: Sticky Preview FAB

Add a floating action button (FAB) that is visible only on the Tasarim tab (established by the approved 3-tab restructure). The FAB sits in the bottom-right corner at `position: 'absolute'`, `bottom: 88` (above the sticky save bar height of ~72pt + 16pt gap), `right: 20`. It is a circular button, 56x56pt, background `copper[500]`, with an Eye icon from `lucide-react-native`.

Tapping the FAB opens a bottom sheet that snaps to 70% of screen height, showing a WebView rendering the public card viewer at the URL `${API_BASE}/c/${card.slug}?preview=1`. This requires a `?preview=1` query param the server must already handle (see server-side note below).

**Server-side dependency:** The web viewer at `src/app/c/[slug]/page.tsx` needs to detect `?preview=1` and, if present, read design overrides from additional query params: `?preview=1&layout=cinema&theme=editorial&qrPreset=dots&primary=%23C27940&accent=%231F2937`. These params override what's in the DB without writing. The server-side rendering path already receives `searchParams`; this is a pure read path with no auth requirement. The maker agent must verify whether this override param support exists or needs a small addition to the web server route — this brief covers the mobile FAB only; the server param reading is a separate 20-line addition to `src/app/c/[slug]/page.tsx` or its data-fetching layer.

**WebView dependency:** `expo-router` apps can use `react-native-webview` if already in deps. Check `mobile/package.json` before implementing — if not present, use an `expo-web-browser` `openBrowserAsync` call as fallback (simpler, no bottom sheet, opens system browser with the preview URL). Bottom sheet preferred; system browser is acceptable for V1.

**FAB placement in edit/[id].tsx:** The FAB is rendered outside the `ScrollView` but inside the `KeyboardAvoidingView`, as a sibling `View` with `StyleSheet.absoluteFillObject`-style positioning. It is conditionally rendered: `{activeTab === 'tasarim' && <PreviewFAB onPress={openPreview} />}`. `PreviewFAB` is a small inline component in `edit/[id].tsx` — no separate file, ~25 lines.

**File touches:**
- `mobile/app/(app)/cards/edit/[id].tsx`: add `PreviewFAB` inline component, add FAB render inside the `KeyboardAvoidingView`, build preview URL from current draft state params, add a `bottomSheetVisible` state variable

---

## Fix 3 — Brand Color Preview Chip

### Problem in code

`HexRow` in `mobile/src/components/cards/CardFormSections.tsx` (lines 196-240) already shows a `36x36` circular swatch (`styles.swatch`, line 991-996) that updates live as the user types. The swatch is too small (36px diameter) to give meaningful feedback about how the color will read on a card.

### Solution: Mini-card Preview Chip

Replace the circular swatch in `HexRow` (lines 223-225) with a `100x60` rounded rectangle (`borderRadius: 8`). Split it diagonally: the left 60% is filled with `primaryHex` (simulating the card background), the right 40% is filled with `accentHex` (simulating the text/secondary surface). This requires `BrandColorsSection` to pass both hex values down to each `HexRow` so the chip can render the combined pair, not just the individual color being edited.

**Prop change to `HexRow`:** add `pairedHex: string` prop. `BrandColorsSection` passes `accentHex` as `pairedHex` to the primary `HexRow` and `primaryHex` as `pairedHex` to the accent `HexRow`.

The mini-card is a `View` with `flexDirection: 'row'`, `width: 100`, `height: 60`, `borderRadius: 8`, `overflow: 'hidden'`, `borderWidth: 1`, `borderColor: theme.line.DEFAULT`. Left child: `View` with `flex: 3`, `backgroundColor: primaryHex`. Right child: `View` with `flex: 2`, `backgroundColor: accentHex`. Both children update live as state changes — the existing `swatchColor = HEX_RE.test(draft) ? draft : value` logic at line 220 already handles the live-update while typing.

Remove `styles.swatch` (lines 991-996) from `StyleSheet.create` and add `styles.miniCard` and `styles.miniCardLeft`, `styles.miniCardRight`.

**File touches:**
- `mobile/src/components/cards/CardFormSections.tsx` lines 196-240: modify `HexRow` component signature and internal swatch render
- `mobile/src/components/cards/CardFormSections.tsx` lines 243-265: update `BrandColorsSection` to pass `pairedHex` to each `HexRow`
- `mobile/src/components/cards/CardFormSections.tsx` lines 989-996: replace `swatch` style with `miniCard` style block

---

## Fix 4 — Save Bar Scroll Clearance

### Problem in code

`mobile/app/(app)/cards/edit/[id].tsx` line 452 sets `scroll: { padding: 16, paddingBottom: 48 }`. The existing save bar (header right button) is in the nav header, not a sticky bottom bar — but the brief assumes a sticky save bar will be part of the Tasarim tab design. Regardless: `paddingBottom: 48` is insufficient when the last section (`DiscoverySection`, rendered at line 433) ends near the bottom of most phone screens. On devices with gesture navigation, the system home gesture bar adds ~34pt of inset on top of the existing padding.

### Solution

Change `paddingBottom` on the `scroll` style in `edit/[id].tsx` line 452 from `48` to `120`. This ensures the last section (`DiscoverySection` on Gelismis tab, or `FaqsSection` on Profil tab post-3-tab restructure) is fully scrollable above both the gesture bar and any sticky save bar. No other changes needed — `ScrollView` with `contentContainerStyle` handles this automatically.

If a sticky save bar is added as part of the 3-tab restructure (a bottom `View` with "Kaydet" button, `position: 'absolute'`, `bottom: 0`, `height: 72`), `paddingBottom` must be at minimum `72 + 16 + safeAreaInsets.bottom` at runtime, computed via `useSafeAreaInsets()` from `react-native-safe-area-context` (already in deps). Use a computed value rather than the hardcoded `120` constant if a real sticky bar is added. For now, `120` is the conservative fixed value that handles the nav-bar-only case.

**File touches:**
- `mobile/app/(app)/cards/edit/[id].tsx` line 452: change `paddingBottom: 48` to `paddingBottom: 120`

---

## Sequencing

Implement in this order — each step is independently testable before the next:

1. Fix 4 (paddingBottom) — one line, zero risk. Verify last section is reachable.
2. Fix 3 (mini-card color chip) — isolated to `HexRow` and `BrandColorsSection`. Verify both chips update live on hex input.
3. Fix 1A (horizontal carousel) — replaces vertical FlatList inside `TemplateSection`. Verify scroll no longer fights parent. Verify copper border on selected item.
4. Fix 1B (template preview modal) — new file + route registration. Verify modal opens on tap, Apply sets `templateId`, Cancel leaves selection unchanged.
5. Fix 2 (Preview FAB) — add after Fix 1 so the Tasarim tab structure (from 3-tab brief) is in place. Verify FAB appears on Tasarim tab only, preview URL includes current draft params.

Do NOT build between steps. Build once after all 5 steps are complete and test on device (Samsung S23 or equivalent Android).

---

## Risks

- **WebView dep for Fix 2:** `react-native-webview` may not be in `mobile/package.json`. If absent, fall back to `Linking.openURL(previewUrl)` (system browser) for V1 and defer the bottom sheet to a follow-up sprint. Do not install unvetted native packages without confirming they build cleanly with SDK 54.
- **Server `?preview=1` param support:** Fix 2 depends on the web viewer reading query-param overrides without a DB write. If this is not yet implemented on the server, the FAB preview will show the published state (not the draft), which is misleading. In that case, suppress the FAB until the server side is confirmed — better to have no preview than a wrong one.
- **Template preview modal horizontal swipe:** Passing the full template list via router params risks exceeding URL length limits. Load `listTemplates()` fresh inside the modal instead (it is a 5-minute cached endpoint — the second call within a session will be instant).
- **`paddingBottom: 120` is hardcoded:** If a floating bottom bar is added later, this must be updated to a computed value. Leave a `// TODO: replace with computed safeArea + barHeight` comment on that line.
