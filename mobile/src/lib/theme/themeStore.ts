import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type AppThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'verso.themeMode';

type ThemeStore = {
  mode: AppThemeMode;
  hydrated: boolean;
  setMode: (m: AppThemeMode) => void;
  hydrate: () => Promise<void>;
};

function isValidMode(v: string | null): v is AppThemeMode {
  return v === 'light' || v === 'dark' || v === 'system';
}

export const useThemeStore = create<ThemeStore>((set) => ({
  // Default = light (NOT system) per Sprint F5 brief.
  mode: 'light',
  hydrated: false,
  setMode: (m) => {
    set({ mode: m });
    // Fire-and-forget; SecureStore.setItemAsync rejects only on serious
    // device errors (storage full / disk corruption). We intentionally do
    // not block the UI on the write — the in-memory state is authoritative
    // for the current session and the next launch reads from disk.
    SecureStore.setItemAsync(STORAGE_KEY, m).catch(() => {});
  },
  hydrate: async () => {
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (isValidMode(stored)) {
        set({ mode: stored, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },
}));

/** Convenience hook — same shape as the previous useTheme() to keep call sites tidy. */
export function useThemeMode(): {
  mode: AppThemeMode;
  setMode: (m: AppThemeMode) => void;
} {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  return { mode, setMode };
}
