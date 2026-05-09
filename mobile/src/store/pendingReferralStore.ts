// =============================================================================
// M3 — Pending referral store.
//
// When the app is opened via a deep-link that carries `?ref=<code-or-slug>`
// (either `verso://onboarding?ref=…` or the universal-link signup CTA on the
// public viewer), we stash the value here. Once the auth store flips to
// `authenticated`, the redeem hook fires and clears the value.
//
// Persisted to SecureStore so a magic-link flow that toggles between the mail
// app and Verso doesn't drop the ref midway.
// =============================================================================

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'verso.pendingRef';

type State = {
  ref: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setRef: (ref: string | null) => Promise<void>;
};

export const usePendingReferralStore = create<State>((set) => ({
  ref: null,
  hydrated: false,
  hydrate: async () => {
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      set({ ref: stored, hydrated: true });
    } catch {
      set({ ref: null, hydrated: true });
    }
  },
  setRef: async (ref) => {
    set({ ref });
    try {
      if (ref) await SecureStore.setItemAsync(STORAGE_KEY, ref);
      else await SecureStore.deleteItemAsync(STORAGE_KEY);
    } catch {
      // Best-effort persistence; in-memory state still has the value.
    }
  },
}));
