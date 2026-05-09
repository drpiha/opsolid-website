# Onboarding Wizard — Implementation Brief

**Goal:** A new authenticated user with zero cards is intercepted before landing on the empty cards list and walked through a focused 5-step card-creation wizard. The wizard removes all intimidation: one decision per screen, forward momentum at every tap.

---

## 1. File Map

```
mobile/
  app/
    (app)/
      onboarding/
        index.tsx          # Wizard shell: step router, progress bar, Back/Skip chrome
      _layout.tsx          # ADD: Tabs.Screen name="onboarding" options={{ href: null, headerShown: false }}
  src/
    store/
      onboardingDraftStore.ts   # NEW — Zustand atom for wizard draft + skipped flag
  lib/
    i18n/
      locale.ts            # ADD: onboarding.* keys (all three locales en/de/tr)
```

**Approach: single-file state machine inside `index.tsx` (not separate step-N files).**
Reason: 5 steps share the same draft store, progress bar, and animation wrapper. Separate files would require prop-drilling or a context bridge for no routing benefit — Expo Router's `Stack` adds a hardware-back animation the wizard does not need. One file keeps the step render loop in ~250 lines; each step is a pure inner component receiving draft slice + setter.

---

## 2. State Machine

| Step | Name        | Fields written to draft              | Advance trigger                              | Skip allowed |
|------|-------------|--------------------------------------|----------------------------------------------|--------------|
| 1    | Photo       | `photoUri`, `photoMimeType`          | Tap "Next" (always enabled)                  | Yes (link)   |
| 2    | Identity    | `name`, `jobTitle`                   | `name.trim().length > 0` → "Next" enabled    | No           |
| 3    | Contact     | `contactChip`, `contactValue`        | `contactValue.trim().length > 0` OR skip chip | Yes (chip skip tap) |
| 4    | Style       | `templateId` (one of 1, 6, 14, 84)  | Tap card thumbnail — auto-advances           | No (always has a default) |
| 5    | Preview     | — (read-only display)                | "Publish" → POST + navigate away             | No (but "Edit details" exits) |

`contactChip`: `'phone' | 'email' | 'whatsapp'`. Default selection: `'email'`. Tapping a chip replaces the input field with the matching `keyboardType` (`phone-pad` for phone/whatsapp, `email-address` for email).

---

## 3. Zustand Store — `onboardingDraftStore.ts`

```ts
type OnboardingDraft = {
  photoUri: string | null;
  photoMimeType: string;
  name: string;
  jobTitle: string;
  contactChip: 'phone' | 'email' | 'whatsapp';
  contactValue: string;
  templateId: number;
  skipped: boolean;          // once true, wizard never auto-shows again
  everPublished: boolean;    // once true, wizard never auto-shows again (survives card deletion)
};
type OnboardingDraftStore = OnboardingDraft & {
  set: (patch: Partial<OnboardingDraft>) => void;
  reset: () => void;
};
```

Persist via `zustand/middleware` `persist` with `expo-secure-store` (same pattern as `localeStore`). Key: `'opsolid.onboardingDraft'`. On `reset()` clear photoUri/name/jobTitle/contactValue only — preserve `skipped` and `everPublished`.

---

## 4. Routing Rules

**Interception point — `app/(app)/_layout.tsx`:**

After `unlocked === true` and before returning `<Tabs>`, check:

```
if (status === 'authenticated'
    && !draft.skipped
    && !draft.everPublished) {
  // fire listCards() — lightweight, cached in memory for this session
  // if result.items.length === 0 → router.replace('/(app)/onboarding')
}
```

Implementation note: run `listCards({ limit: 1 })` inside a `useEffect` with a `checkedRef` guard (run once per mount, not on every re-render). Do not block the Tabs render while the check is in-flight — show Tabs immediately and redirect if the check resolves to 0. This avoids a white flash.

**Exit paths from wizard:**

| User action | Result |
|-------------|--------|
| Tap "Skip wizard" (top-right) | `set({ skipped: true })` → `router.replace('/(app)/cards')` |
| Publish success | `set({ everPublished: true })` → `router.replace('/(app)/cards')` |
| Tap "Edit details" (Step 5) | `router.replace('/(app)/cards/create')` — draft is NOT cleared, but the existing `create.tsx` screen does not read from this store |
| Hardware back at Step 1 | Goes back to the app (cards list), no draft change |

**Re-entry from My Cards empty state:** The `+` FAB in `cards.tsx` already navigates to `/(app)/cards/create`. To offer wizard re-entry specifically when 0 cards AND `!draft.everPublished`: replace the `+` header button target with `/(app)/onboarding` instead of `/(app)/cards/create`. Do not show this re-entry if `draft.everPublished` is true.

---

## 5. Progress Chrome

Top of wizard screen (outside the step content `View`, inside a fixed header):

- Thin row of 5 segments, height 3pt, borderRadius 2pt.
- Inactive: `theme.bg[3]`. Active + completed: `copper[500]`.
- Fill animation: `useSharedValue` → `withTiming(1, { duration: 200 })` on step advance.
- Left: `<TouchableOpacity>` wrapping a back-chevron (`ChevronLeft` from lucide-react-native). Hidden on Step 1. Tapping decrements `step` by 1, preserves all draft state.
- Right: `<TouchableOpacity>` with label `t.onboarding.skip` — visible only on Steps 1 and 3. Tapping sets `skipped: true` and navigates to cards.

---

## 6. Animation

Each step content is wrapped in a `<Animated.View>` using `useSharedValue(0)` → `withTiming(1, { duration: 300 })` with `interpolate` for both opacity (0→1) and translateX (24→0). Run the animation in a `useEffect` keyed on `step`. This is a one-direction enter animation — no exit animation needed to keep the 300ms budget and avoid layout jank.

Haptics: `expo-haptics` is already a transitive dep via expo-av. Import `impactAsync(ImpactFeedbackStyle.Light)` on each step advance. On Publish tap: `notificationAsync(NotificationFeedbackType.Success)`.

---

## 7. Step 4 — Template Thumbnails

Use template IDs 1, 6, 14, 84. Render as a 2-column grid of pressable cards (width `(screenWidth - 48) / 2`, aspect ratio 1.6 to simulate a card). Each thumbnail is a `View` with a border: inactive `theme.line.DEFAULT`, active `copper[500]` (2pt). Show the template name as a small label below. No live preview render — static colored rectangles with the template name are sufficient here; a real preview would require a WebView and block the flow.

Tapping a thumbnail writes `templateId` to draft and immediately advances to Step 5 (no explicit "Next" button needed — selection IS confirmation). This is the fastest possible interaction for this step.

**Open product question #1:** Should Step 4 also expose theme (aurora/editorial/cinema) or layout (bento/accordion) as secondary choices? Recommendation: no — the 3-tab form in `create.tsx` is the right place for those. The wizard picks a template only; everything else defaults.

---

## 8. Step 5 — Preview + Publish

Render a simplified card preview as a `View` (not a WebView — no slug yet). Show: circular photo or placeholder circle, `name`, `jobTitle`, `contactValue`, template name chip, copper accent bar. This is a "promise of what the card will look like" — accuracy is secondary to momentum.

Primary CTA: `t.onboarding.publish` — full-width copper button. On tap:

1. `setSaving(true)`
2. POST `/api/v1/cards` with assembled payload (same structure as `handleCreate` in `create.tsx`, using `templateId` from draft, `name`/`jobTitle`/`email|phone|whatsapp` from draft fields)
3. If `photoUri` is set: call `uploadPhoto(uri, mimeType)` → PATCH card with `photoPath`
4. On success: `set({ everPublished: true })`, `reset()`, `router.replace('/(app)/cards')`
5. On network error: show inline error text, keep user on Step 5, retry is just tapping Publish again

Photo upload failure (network only): keep `photoUri` in draft, continue to success screen with a soft toast "Card published — photo will upload when you retry." Do not block publish on photo.

Secondary CTA: `t.onboarding.editDetails` — ghost style. Navigates to `/(app)/cards/create`. Draft is cleared first so `create.tsx` starts fresh (it does not read this store).

---

## 9. Error States

| Scenario | Handling |
|----------|----------|
| Photo pick — permission denied | Show inline text under photo circle: `t.onboarding.photoPermissionDenied`. Do not alert. |
| Name field empty at Step 2 | "Next" button disabled, subtle red border on field. |
| Contact field empty at Step 3 | "Next" button disabled. Chip tapped with no value → border highlight only, no alert. |
| Publish network error | Inline error row below CTA. No Alert.alert (interrupts flow). |
| Publish API error (non-network) | Same inline row, text from API error message or fallback `t.errors.network`. |

---

## 10. i18n Keys (add to all three locales in `locale.ts`)

```
onboarding: {
  step1Title: string        // "Add a photo"
  step1Hint: string         // "A face builds trust. You can skip this."
  step1Next: string         // "Next"
  step1Skip: string         // "Skip photo"
  step2Title: string        // "What's your name?"
  step2NamePlaceholder: string  // "Full name"
  step2TitlePlaceholder: string // "e.g. Founder, Designer"
  step2Next: string         // "Next"
  step3Title: string        // "Best way to reach you?"
  step3ChipPhone: string    // "Phone"
  step3ChipEmail: string    // "Email"
  step3ChipWhatsApp: string // "WhatsApp"
  step3Next: string         // "Next"
  step3Skip: string         // "Skip for now"
  step4Title: string        // "Choose a style"
  step5Title: string        // "Here's your card"
  step5Hint: string         // "You can change everything later."
  publish: string           // "Looks great — publish"
  editDetails: string       // "Edit details"
  publishingError: string   // "Could not publish. Tap to retry."
  photoPermissionDenied: string // "Gallery access needed — tap to allow"
  skip: string              // "Skip wizard"
  progressLabel: string     // "Step {n} of 5"
}
```

TR equivalents follow the existing pattern in `locale.ts`. DE equivalents likewise.

---

## 11. Open Product Questions

1. **Template colors at Step 4:** Should the wizard expose `brandPrimaryHex` / `brandAccentHex` as a color picker after the user picks a template? Recommendation: defer to `create.tsx`; adds ~2 steps and breaks the "calm" promise.
2. **Wizard re-entry after card deletion:** Current spec: once `everPublished` is true, wizard never auto-shows (even if user deletes all cards). Is this the right behavior, or should it reset if card count drops to 0 again? This affects the `_layout.tsx` check condition.
3. **Slug generation:** The backend assigns a slug on POST. The preview at Step 5 cannot show the final URL until after publish. The brief assumes this is acceptable. Confirm.

---

## Ready?

This brief is ready for Judge review. The maker agent can begin with `onboardingDraftStore.ts` (no UI dependencies), then `index.tsx` step shell, then step content components in order. No new native modules required. All deps (`expo-image-picker`, `expo-haptics`, `react-native-reanimated`, `zustand`) are already in `package.json`.
