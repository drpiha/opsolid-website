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
// -----------------------------------------------------------------------

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

import type { TourId } from '../lib/tour/types';

const STORAGE_KEY = 'verso.firstrun.seenTours';

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

export const useFirstRunStore = create<FirstRunStore>((set, get) => ({
  seenTours: { ...INITIAL_SEEN },
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (!raw) {
        set({ hydrated: true });
        return;
      }
      const parsed = JSON.parse(raw) as Partial<SeenToursMap>;
      // Merge defensively — older builds may have shipped without all five
      // tour ids. Any missing key falls back to `false` (= unseen).
      const merged: SeenToursMap = { ...INITIAL_SEEN, ...parsed };
      set({ seenTours: merged, hydrated: true });
    } catch {
      // Corrupt JSON or SecureStore failure → start fresh. The user re-sees
      // the tour, which is acceptable.
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
    set({ seenTours: { ...INITIAL_SEEN } });
    try {
      SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
    } catch {
      // ignore
    }
  },

  markEverPublished: (value) => {
    if (!value) return;
    const current = get().seenTours;
    if (current['first-card']) return;
    const next: SeenToursMap = { ...current, 'first-card': true };
    set({ seenTours: next });
    persist(next);
  },
}));
