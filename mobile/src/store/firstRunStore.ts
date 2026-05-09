// -----------------------------------------------------------------------
// firstRunStore — Zustand atom tracking which coaching tours the user has
// already seen (or explicitly skipped).
//
// Mirrors the persistence pattern used by `onboardingDraftStore.ts`: the
// long-lived guard map (`seenTours`) is mirrored to `expo-secure-store`
// under a single JSON-encoded key so the controller can short-circuit
// `startTour(...)` calls for tours the user already dismissed.
//
// Auto-skip: `markEverPublished(true)` flips the `first-card` tour to
// "seen" without prompting — if the user already has cards, the empty-deck
// coaching marks would feel patronizing on first launch of a new build.
// It also sets a separate `everPublished` flag so the cards screen can
// short-circuit Tour A even before the persisted `seenTours` map writes.
//
// Wave 2 additions (M7):
//   - `everPublished` — boolean mirror of `markEverPublished(true)` so a
//     re-installer who already has cards doesn't see Tour A. Persists.
//   - `pendingCelebration` / `markPendingCelebration` — set by the
//     onboarding publish handler immediately before navigating to the
//     newly-created card detail screen. The card detail screen reads it
//     once on mount, renders the celebration banner, and clears the flag.
//     Persists so a kill-the-app-mid-publish user still sees the banner
//     when they re-open.
// -----------------------------------------------------------------------

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

import type { TourId } from '../lib/tour/types';

const STORAGE_KEY = 'verso.firstrun.seenTours';
const STORAGE_KEY_EVER_PUBLISHED = 'verso.firstrun.everPublished';
const STORAGE_KEY_PENDING_CELEBRATION = 'verso.firstrun.pendingCelebration';

export type SeenToursMap = Record<TourId, boolean>;

const INITIAL_SEEN: SeenToursMap = {
  'first-card': false,
  'edit-screen': false,
  'discover': false,
  'contacts': false,
  'sharing': false,
};

type FirstRunStore = {
  seenTours: SeenToursMap;
  /** Mirror flag — true once the user has ever had a published card on
   *  this device. Survives card deletion (i.e. it's never reset) so a
   *  user who deletes their only card still doesn't re-enter Tour A. */
  everPublished: boolean;
  /** Set by the onboarding publish handler. The card detail screen
   *  consumes it once on mount and clears it. */
  pendingCelebration: boolean;
  hydrated: boolean;
  /** Read the persisted map. Idempotent. */
  hydrate: () => Promise<void>;
  /** Mark a tour seen. Persists synchronously-fire-and-forget to SecureStore. */
  dismissTour: (id: TourId) => void;
  /** Dev only — clears the persisted map and resets in-memory state. */
  resetAll: () => void;
  /**
   * Auto-dismiss the `first-card` tour when the user already has cards.
   * Called from the cards-list screen after the first successful fetch.
   * Pass `false` to leave state alone (no-op for symmetry).
   */
  markEverPublished: (value: boolean) => void;
  /**
   * Toggle the "show celebration banner on next card detail mount" flag.
   * Onboarding publish handler calls `(true)`. Card detail mount calls
   * `(false)` after rendering the banner.
   */
  markPendingCelebration: (value: boolean) => void;
};

function persist(seen: SeenToursMap): void {
  // SecureStore writes are async/unbounded — fire and forget. A failed write
  // means the user re-sees the tour next launch; that's worse than ideal but
  // never a crash.
  try {
    SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(seen)).catch(() => {});
  } catch {
    // SecureStore call itself can throw on some emulators; swallow.
  }
}

function persistFlag(key: string, value: boolean): void {
  try {
    if (value) {
      SecureStore.setItemAsync(key, '1').catch(() => {});
    } else {
      SecureStore.deleteItemAsync(key).catch(() => {});
    }
  } catch {
    // ignore
  }
}

export const useFirstRunStore = create<FirstRunStore>((set, get) => ({
  seenTours: { ...INITIAL_SEEN },
  everPublished: false,
  pendingCelebration: false,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const [raw, everPublished, pendingCelebration] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEY),
        SecureStore.getItemAsync(STORAGE_KEY_EVER_PUBLISHED),
        SecureStore.getItemAsync(STORAGE_KEY_PENDING_CELEBRATION),
      ]);
      let merged: SeenToursMap = { ...INITIAL_SEEN };
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<SeenToursMap>;
          // Merge defensively — older builds may have shipped without all five
          // tour ids. Any missing key falls back to `false` (= unseen).
          merged = { ...INITIAL_SEEN, ...parsed };
        } catch {
          // Corrupt JSON → start fresh on the seen map but keep the flags below.
        }
      }
      set({
        seenTours: merged,
        everPublished: everPublished === '1',
        pendingCelebration: pendingCelebration === '1',
        hydrated: true,
      });
    } catch {
      // SecureStore failure → start fresh. The user re-sees the tour, which
      // is acceptable.
      set({ hydrated: true });
    }
  },

  dismissTour: (id) => {
    const current = get().seenTours;
    if (current[id]) return; // idempotent
    const next: SeenToursMap = { ...current, [id]: true };
    set({ seenTours: next });
    persist(next);
  },

  resetAll: () => {
    set({
      seenTours: { ...INITIAL_SEEN },
      everPublished: false,
      pendingCelebration: false,
    });
    try {
      SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
      SecureStore.deleteItemAsync(STORAGE_KEY_EVER_PUBLISHED).catch(() => {});
      SecureStore.deleteItemAsync(STORAGE_KEY_PENDING_CELEBRATION).catch(() => {});
    } catch {
      // ignore
    }
  },

  markEverPublished: (value) => {
    if (!value) return;
    const state = get();
    // Update both the seenTours short-circuit AND the explicit everPublished
    // flag — different consumers use different gates.
    if (!state.everPublished) {
      set({ everPublished: true });
      persistFlag(STORAGE_KEY_EVER_PUBLISHED, true);
    }
    if (!state.seenTours['first-card']) {
      const next: SeenToursMap = { ...state.seenTours, 'first-card': true };
      set({ seenTours: next });
      persist(next);
    }
  },

  markPendingCelebration: (value) => {
    const current = get().pendingCelebration;
    if (current === value) return;
    set({ pendingCelebration: value });
    persistFlag(STORAGE_KEY_PENDING_CELEBRATION, value);
  },
}));
