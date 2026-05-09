import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { Locale } from './locale';

const STORAGE_KEY = 'verso.localeOverride';

export type LocaleOverride = Locale | null;

type LocaleStore = {
  override: LocaleOverride;
  hydrated: boolean;
  setOverride: (l: LocaleOverride) => void;
  hydrate: () => Promise<void>;
};

function isValidLocale(v: string | null): v is Locale {
  return (
    v === 'en' ||
    v === 'de' ||
    v === 'tr' ||
    v === 'es' ||
    v === 'it' ||
    v === 'fr' ||
    v === 'ar'
  );
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  override: null,
  hydrated: false,
  setOverride: (l) => {
    set({ override: l });
    if (l === null) {
      SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
    } else {
      SecureStore.setItemAsync(STORAGE_KEY, l).catch(() => {});
    }
  },
  hydrate: async () => {
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (isValidLocale(stored)) {
        set({ override: stored, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },
}));

/** Synchronous read of the current override — used by `detectLocale()`. */
export function getLocaleOverride(): LocaleOverride {
  return useLocaleStore.getState().override;
}
