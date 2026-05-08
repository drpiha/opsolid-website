# Verso Edit Form — Simplification & Theme Brief
**Authored by:** Scout (UX/UI research agent)
**Target maker:** general-purpose implementation agent
**Status:** Ready for implementation

---

## Context

Two complaints from Hasan after hands-on use of the Verso mobile app:

1. The card edit screen (`mobile/app/(app)/cards/edit/[id].tsx`) renders 14 sections in a single endless scroll. On a real phone this feels like a form, not a card-building experience. The repeater rows (Services / Custom Buttons / FAQs) in `mobile/src/components/cards/CardRepeaterSections.tsx` are particularly confusing — users cannot tell where one section ends and the next begins.

2. The app currently calls `useColorScheme()` in `mobile/src/lib/theme/ThemeProvider.tsx` (line 10) and auto-follows OS preference. On most Android handsets the OS default is dark. Hasan wants light as default, with a manual override persisted in `expo-secure-store`. The existing `lightTheme` object in `mobile/src/lib/theme/tokens.ts` (lines 154-180) needs two small token adjustments so it reads "premium business" rather than "blank iOS Settings".

---

## Part A — Edit Form Reorganization

### Chosen structure: 3-tab segmented control ("Profil / Tasarim / Gelismis")

**Why tabs, not a stepper and not progressive disclosure:**

A stepper wizard enforces linear completion order — wrong for editing an existing card where users jump to specific fields. Progressive disclosure (accordion-only) reduces scroll depth but keeps 14 sections on one canvas, which is the root confusion. A top-anchored segmented control gives three named regions, each independently scrollable, with instant context-switching and zero cognitive overhead on which step you are on. This pattern maps to the established "Info / Customize / Advanced" three-column split used across professional form apps and is implementable with a simple `activeTab` state variable — no router changes, no new libraries.

### Tab layout

**Tab 0 — Profil** (what goes on the card — identity and content)
- Photo picker (currently at edit `[id].tsx` lines 393-412 — keep as is, always visible at top)
- `BasicFieldsSection` (name, title, position, company, email, phone, whatsapp, website, address, bio)
- `SocialsSection` (already collapsible with ChevronDown at `CardFormSections.tsx` lines 161-172 — keep that behavior)
- `ServicesSection`
- `CustomButtonsSection`
- `FaqsSection`

**Tab 1 — Tasarim** (how the card looks)
- `TemplateSection`
- `LayoutSection`
- `ThemeSection`
- `BrandColorsSection`
- `QrStyleSection`

**Tab 2 — Gelismis** (publishing, discovery, live features)
- `StatusBannerSection`
- `FeedbackSection`
- `VisibilitySection`
- `DiscoverySection`
- Published status row (currently edit `[id].tsx` lines 436-443)

### Tab component spec

Add a `TabBar` component inline at the top of `edit/[id].tsx` (do not make it a separate file — it is 30 lines and only used once):

```
type Tab = 'profil' | 'tasarim' | 'gelismis';

const [activeTab, setActiveTab] = useState<Tab>('profil');
```

Styling: `flexDirection: 'row'`, full-width, `height: 44`, background `theme.bg[1]`, bottom border `theme.line.DEFAULT` at 1px. Each tab pill: `flex: 1`, centered text, `fontSize: 13`, `fontWeight: '600'`, `textTransform: 'uppercase'`, `letterSpacing: 0.5`. Active tab: bottom border 2px `teal[500]` (`#1AA6B7`), text `teal[500]`. Inactive: text `theme.ink[400]`. No background fill on active (the underline is the indicator). Touch target is the full tab width (already 44pt height — WCAG compliant).

Apply the tab bar immediately after `<Stack.Screen>` and above `<KeyboardAvoidingView>` so it stays outside the scroll region. The `ScrollView` inside `KeyboardAvoidingView` then renders only the sections belonging to `activeTab`.

### Save button behavior — unchanged

`handleSave()` at edit `[id].tsx` line 280 collects ALL state variables regardless of which tab is active. This must not change. State initialization (lines 156-181) and the `useEffect` hydration block (lines 195-254) are also unchanged. The tab split is purely a rendering partition.

### Repeater row improvements (Services / Custom Buttons / FAQs)

The current `addBtn` style in `CardRepeaterSections.tsx` lines 402-412 is a dashed-border full-width row — this is already a reasonable pattern. Do NOT replace it with a floating FAB (a FAB overlaps scroll content and is harder to reach on tall Android phones with gesture navigation).

Instead, three targeted improvements to the repeater cards (applicable to all three repeater sections at `CardRepeaterSections.tsx`):

1. **Section count badge.** In the `sectionHeaderRow`, change the `sectionHint` text to show `{items.length} / {MAX}` (e.g. "2 / 12") instead of just the static hint string. This tells users how many items exist without counting cards. Keep the static hint as a `numberOfLines={1}` secondary line below the count, or remove it entirely if it exceeds the row.

2. **Numbered heading per card.** Inside each `repeaterCard`, add a `Text` at the very top (above the Trash icon) showing `#{idx + 1}` in `theme.ink[400]`, `fontSize: 11`, `fontWeight: '600'`. This anchors position in the list.

3. **Visual separator between the add button and the section below.** The sections currently bleed into each other because `section` gap (16pt) matches the `repeaterCard` gap (16pt). Add `marginBottom: 8` to the `addBtn` style and increase `marginTop` of the `section` style from 24 to 32 so the boundary is readable.

No API shape changes. `cleanServices`, `cleanCustomButtons`, `cleanFaqs` normalizers are untouched.

### Files modified for Part A

- `mobile/app/(app)/cards/edit/[id].tsx` — add `activeTab` state, `TabBar` inline component, wrap section renders in conditional blocks
- `mobile/app/(app)/cards/create.tsx` — same tab structure, same section mapping (create screen currently has identical flat layout)
- `mobile/src/components/cards/CardRepeaterSections.tsx` — count badge, numbered heading, spacing adjustments

---

## Part B — Theme Rework

### 1. Default = light, persist override in expo-secure-store

**Current behavior** (`mobile/src/lib/theme/ThemeProvider.tsx` lines 9-12):
```ts
const scheme = useColorScheme();
const theme = getTheme(scheme === 'dark' ? 'dark' : 'light');
```
This always defers to OS.

**New behavior — three steps:**

**Step 1 — Add a theme store.**
Create `mobile/src/lib/theme/themeStore.ts` using zustand (already in deps). Shape:

```ts
type AppThemeMode = 'light' | 'dark' | 'system';
type ThemeStore = {
  mode: AppThemeMode;
  setMode: (m: AppThemeMode) => void;
};
```

Persist `mode` to `expo-secure-store` key `'verso_theme_mode'`. Default = `'light'` (not `'system'`). Use zustand `persist` middleware with a custom `expo-secure-store` storage adapter — the adapter is a ~15-line wrapper converting the synchronous zustand persist interface to SecureStore's async API using `getItemAsync`/`setItemAsync`. The same pattern is already used by `mobile/src/lib/auth/store.ts` (zustand + SecureStore) — copy that storage adapter.

**Step 2 — Update ThemeProvider.**
`ThemeProvider` reads `mode` from the store and `osScheme` from `useColorScheme()`. Resolution:

```ts
const resolvedMode = mode === 'system' ? (osScheme ?? 'light') : mode;
const theme = getTheme(resolvedMode);
```

When `mode` is `'light'` or `'dark'` — OS scheme is ignored. When `mode` is `'system'` — falls back to OS, with `'light'` as the null-guard.

**Step 3 — Expose mode + setMode from useTheme (or a new hook).**
Two options:

- Option A (simpler): export `useThemeMode` hook directly from `themeStore.ts`. Settings screen uses it independently of `useTheme()`.
- Option B: add `mode` and `setMode` to `ThemeTokens` type and inject from `ThemeProvider`.

Recommend Option A — does not widen the `ThemeTokens` type (which is a pure visual token set and should stay that way).

### 2. Settings screen — Appearance row

`mobile/app/(app)/settings.tsx` currently has Account / Security / About sections. Add an "Appearance" section between Account and Security (or between Security and About if Security section is conditionally absent):

```
<Text style="section header">Appearance</Text>
<View style="card">
  <AppearanceSegment />
</View>
```

`AppearanceSegment` is a three-option segmented control: Light | System | Dark.
- Same segmented pill style as `VisibilitySection` in `CardFormSections.tsx` lines 278-318 (reuse exact style pattern — `segmentRow`, `segmentPill`, `segmentText` with active background `teal[500]` instead of `copper[500]`).
- Label strings: `'Light'` / `'System'` / `'Dark'` — hardcode in English for now (i18n can follow later; the locale system is not blocking this).
- Active state uses `teal.DEFAULT` (`#1AA6B7`) for fill and white text, matching the Verso brand. Do not use `copper[500]` here — copper is reserved for OpSolid credit badge.
- Calls `setMode('light' | 'system' | 'dark')` from the theme store.

### 3. Light theme token adjustments — "premium business" warmth

The current `lightTheme` in `mobile/src/lib/theme/tokens.ts` lines 154-180 is clean but feels sterile because `bg[1]` (`#FAFAF7`) and `bg[0]` (`#DCD7CC`) have a muted cool-neutral bias. The existing `surface.light` token (`#F4F1EC`, line 57) is warmer but unused in the light theme. Three specific token changes:

**Change 1 — bg[1]: from `#FAFAF7` to `#F9F6F0`**
The page background shifts from a near-white with a faint gray cast to a slightly warmer ivory. Difference is subtle but removes the "blank settings screen" association. Still WCAG AA for all text colors in the ink scale.

**Change 2 — bg[0]: from `#DCD7CC` to `#E8E2D9`**
The deepest surface (used as header background via `theme.bg[0]` at edit `[id].tsx` line 351 and line 368) lightens slightly and warms. This makes the navigation chrome feel like parchment rather than cooled concrete.

**Change 3 — line.DEFAULT: from `rgba(21,18,15,0.08)` to `rgba(21,18,15,0.10)`**
The border between form sections and around input fields is currently so faint it disappears on mid-range Android displays. Raising opacity from 0.08 to 0.10 gives borders enough presence to structure the page without becoming heavy. All four line tokens use the same base color `#15120F` so the warmth is already there — only the alpha changes.

No changes to the ink scale. No changes to the dark theme's line tokens (the dark theme uses white-based rgba which has different perceptual weight).

**Do NOT change:** `line.hot` (copper accent border used on brand color inputs — unchanged). `line.soft` or `line.firm` (their relative ratios to DEFAULT must stay proportional — only DEFAULT changes).

### 4. Dark theme — use Verso teal instead of copper warm tints

The dark theme `line.hot` in `tokens.ts` line 203 is `rgba(212,143,88,0.35)` — this is a warm amber/copper tint carried over from the OpSolid web palette. Verso's dark surfaces should use teal warmth instead per the brand spec.

Change `darkTheme.line.hot` from `rgba(212,143,88,0.35)` to `rgba(26,166,183,0.30)` (`teal[500]` at 0.30 alpha). This is the active-border glow used on focused inputs, selected template cells, and segment pills in dark mode.

Also update `darkTheme.bg[1]` from `#0B0E13` to `surface.dark` (`#0B1A1F`, tokens.ts line 58). Currently `darkTheme.bg[1]` and `surface.dark` are accidentally the same value (`#0B0E13` vs `#0B1A1F` — they differ). Use the brand-specified `surface.dark` value to align dark mode page background with the Verso Aegean brand spec.

Note: `surface.dark` is already defined at `tokens.ts` line 58 as `#0B1A1F`. The current `darkTheme.bg[1]` at line 187 is `#0B0E13` — 6 hex steps bluer/darker. The brand-spec value `#0B1A1F` has a very slight blue-teal undertone (the `1A` in the middle channel) that signals Aegean without being saturated. This aligns with the Linear / Things 3 "cool dark" reference mentioned in the tokens.ts comment at lines 53-56.

### Files modified for Part B

- `mobile/src/lib/theme/themeStore.ts` — new file, zustand store with SecureStore persistence
- `mobile/src/lib/theme/ThemeProvider.tsx` — consume themeStore, resolve mode
- `mobile/src/lib/theme/tokens.ts` — 5 token value changes (lightTheme bg[1], bg[0], line.DEFAULT; darkTheme line.hot, bg[1])
- `mobile/app/(app)/settings.tsx` — add Appearance section with segmented control

---

## API contract integrity check

All state variables in `edit/[id].tsx` (lines 156-181) are initialized and updated identically. The `handleSave()` function at line 280 builds `cardData` from all state regardless of active tab — no tab-conditional save logic. The `updateCard` call at line 331 is unchanged. The `cardData` JSON shape is identical to the current implementation.

`CardRepeaterSections.tsx` `cleanServices`, `cleanCustomButtons`, `cleanFaqs` normalizers (lines 333-368) are not modified.

---

## Sequencing recommendation

Implement in this order to keep each step independently testable:

1. Part B token changes (`tokens.ts`) — zero risk, no logic, visually testable in isolation.
2. Part B ThemeProvider + themeStore — functional change but no UI yet.
3. Part B Settings Appearance row — surfaces the store to the user.
4. Part A repeater improvements (`CardRepeaterSections.tsx`) — isolated visual polish.
5. Part A tab bar on edit screen (`edit/[id].tsx`).
6. Part A tab bar on create screen (`create.tsx`) — mirror of step 5.

Do NOT build between steps. Build once after all 6 steps are complete and verify on device.

---

## Risks and constraints

- `expo-secure-store` writes are async. The themeStore's zustand persist adapter must handle the async gap — on cold launch, the stored mode may not be available for the first render. Mitigate by keeping the default `'light'` as the in-memory initial value so the first render is always light, and the stored value (if different) updates on the second render cycle. This produces a brief flash only on users who chose dark mode, which is acceptable given the default is light.
- The `useColorScheme()` hook in ThemeProvider must be kept even when mode is `'light'` or `'dark'` — React Native requires it to be called unconditionally (rules of hooks). Simply keep the call and only use its return value when `mode === 'system'`.
- Tab state in `edit/[id].tsx` is local component state (`useState`). Do not lift it to zustand. If the user navigates away and back, tab resets to `'profil'` — this is acceptable and desirable (user returns to the most common tab by default).
- The `TemplateSection` FlatList inside `Tasarim` tab uses `nestedScrollEnabled` (line 589 of `CardFormSections.tsx`) — this must remain. The tab content is a `ScrollView`; the inner FlatList must keep `nestedScrollEnabled={true}`.
- Do not add `react-native-tab-view` or any new library. The tab bar is a plain `View` with `TouchableOpacity` pills — 30 lines of inline code.
