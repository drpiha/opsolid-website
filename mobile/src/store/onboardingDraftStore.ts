// -----------------------------------------------------------------------
// onboardingDraftStore — Zustand atom for the first-run wizard.
//
// Mirrors `templatePickerStore.ts` pattern (pure-zustand, no middleware) but
// persists the two long-lived guard flags (`skipped`, `everPublished`) via
// `expo-secure-store` so the route guard in app/(app)/_layout.tsx survives
// app restarts and reinstalls.
//
// Transient draft fields (photoUri, name, jobTitle, contactValue, …) live in
// memory only — there's no compelling reason to persist a half-finished
// wizard across launches; if the user backgrounds and returns hours later,
// starting fresh is more predictable than resuming a stale step.
// -----------------------------------------------------------------------

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type OnboardingContactChip = 'phone' | 'email' | 'whatsapp';

/**
 * M1 — origin tracks which on-ramp the user picked on Step 0:
 *   - 'manual'  → existing 5-step typed flow (default)
 *   - 'scan'    → camera scan, OCR pre-fill, jumps to Step 5
 *   - 'url'     → URL paste, AI scrape pre-fill, jumps to Step 5
 *
 * The wizard renders Step 0 only when origin === null (the user hasn't
 * picked yet). Once they pick, the rest of the flow is driven by the
 * existing per-step components — origin is informational from there on.
 */
export type OnboardingOrigin = 'manual' | 'scan' | 'url';

const STORAGE_KEY_SKIPPED = 'verso.onboarding.skipped';
const STORAGE_KEY_PUBLISHED = 'verso.onboarding.everPublished';

export type OnboardingDraft = {
  /** 0 = pick an on-ramp; 1–5 = the legacy wizard steps. */
  step: 0 | 1 | 2 | 3 | 4 | 5;
  origin: OnboardingOrigin | null;
  photoUri: string | null;
  photoMimeType: string;
  name: string;
  jobTitle: string;
  contactChip: OnboardingContactChip;
  contactValue: string;
  templateId: number;
  /** M1 — extra fields the OCR / URL scrape can pre-fill beyond the basic
   *  3 (name/title/contact). Persisted on publish via cardData. Empty
   *  string means "not pre-filled"; the user can still edit them on the
   *  preview screen before publishing. */
  company: string;
  website: string;
  bio: string;
  /** M7 Wave 2 — Google profile picture URL surfaced by /api/v1/auth/me.
   *  Used as a placeholder avatar in the Step 0 "we found your details"
   *  panel. Per-session only — never persisted to SecureStore so we always
   *  re-read the freshest URL from the auth store on the next launch. */
  prefillAvatarUrl: string | null;
  /** M7 Wave 2 — preset pack selection. The 5 curated packs in
   *  `lib/cards/presets.ts` each bundle a templateId, themeKey, and brand
   *  color pair. Storing the key in the draft lets Step 4 highlight the
   *  selected pack and lets the publish step optionally PATCH the brand
   *  colors after createCard returns. Per-session — not persisted. */
  themeKey: 'light' | 'dark';
  brandPrimaryHex: string;
  brandAccentHex: string;
  presetKey: string | null;
  /** Once true, the wizard never auto-shows again (route guard). */
  skipped: boolean;
  /** Once true, the wizard never auto-shows again (survives card deletion). */
  everPublished: boolean;
  hydrated: boolean;
};

type OnboardingDraftStore = OnboardingDraft & {
  /** Patch any subset of draft fields. Persists `skipped`/`everPublished` to SecureStore. */
  set: (patch: Partial<OnboardingDraft>) => void;
  /** Hydrate `skipped` and `everPublished` from SecureStore. Idempotent. */
  hydrate: () => Promise<void>;
  /**
   * Clear the in-memory draft (photo / name / contact / step) but preserve
   * `skipped` and `everPublished` — those are guard flags, not draft state.
   * Called after a successful publish.
   */
  reset: () => void;
};

const INITIAL_DRAFT: Omit<OnboardingDraft, 'skipped' | 'everPublished' | 'hydrated'> = {
  step: 0,
  origin: null,
  photoUri: null,
  photoMimeType: 'image/jpeg',
  name: '',
  jobTitle: '',
  contactChip: 'email',
  contactValue: '',
  templateId: 1,
  company: '',
  website: '',
  bio: '',
  prefillAvatarUrl: null,
  themeKey: 'light',
  brandPrimaryHex: '#1AA6B7',
  brandAccentHex: '#0B1A1F',
  presetKey: null,
};

export const useOnboardingDraftStore = create<OnboardingDraftStore>((set, get) => ({
  ...INITIAL_DRAFT,
  skipped: false,
  everPublished: false,
  hydrated: false,

  set: (patch) => {
    set(patch);
    // Persist only the long-lived guard flags. Transient draft state stays
    // in memory. SecureStore writes are async/unbounded — fire and forget.
    if ('skipped' in patch) {
      const v = patch.skipped;
      if (v) SecureStore.setItemAsync(STORAGE_KEY_SKIPPED, '1').catch(() => {});
      else SecureStore.deleteItemAsync(STORAGE_KEY_SKIPPED).catch(() => {});
    }
    if ('everPublished' in patch) {
      const v = patch.everPublished;
      if (v) SecureStore.setItemAsync(STORAGE_KEY_PUBLISHED, '1').catch(() => {});
      else SecureStore.deleteItemAsync(STORAGE_KEY_PUBLISHED).catch(() => {});
    }
  },

  hydrate: async () => {
    try {
      const [skipped, published] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEY_SKIPPED),
        SecureStore.getItemAsync(STORAGE_KEY_PUBLISHED),
      ]);
      set({
        skipped: skipped === '1',
        everPublished: published === '1',
        hydrated: true,
      });
    } catch {
      // SecureStore failure → treat as fresh state. The wizard will show; no
      // worse than the first install. Don't surface the error.
      set({ hydrated: true });
    }
  },

  reset: () => {
    const { skipped, everPublished, hydrated } = get();
    set({
      ...INITIAL_DRAFT,
      skipped,
      everPublished,
      hydrated,
    });
  },
}));
