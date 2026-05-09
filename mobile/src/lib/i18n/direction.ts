import { useMemo } from 'react';
import { I18nManager } from 'react-native';
import { getLocales } from 'expo-localization';
import { detectLocale, type Locale } from './locale';
import { useLocaleStore } from './localeStore';

export type TextDirection = 'ltr' | 'rtl';

/**
 * Static map of locale → text direction.
 *
 * `expo-localization` exposes `getLocales()[0].textDirection` on iOS only
 * (Android always returns null in SDK 54). The static map is the source of
 * truth — if we ever add another RTL locale (he, fa, ur) bump this map.
 */
const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(['ar']);

export function directionForLocale(locale: Locale): TextDirection {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
}

/**
 * Try the OS hint first (covers e.g. a German user on an Arabic Android
 * locale who expects RTL); fall back to our static table.
 */
export function detectOsTextDirection(): TextDirection | null {
  try {
    const td = getLocales()[0]?.textDirection;
    if (td === 'ltr' || td === 'rtl') return td;
  } catch {
    // expo-localization may throw in unit-test envs without a device.
  }
  return null;
}

/**
 * Hook used by layout-sensitive components. Re-renders when the override
 * changes because `useLocaleStore` is a zustand subscription.
 */
export function useTextDirection(): TextDirection {
  const override = useLocaleStore((s) => s.override);
  return useMemo(() => {
    const locale = override ?? detectLocale();
    return directionForLocale(locale);
  }, [override]);
}

/**
 * Synchronous reader — used by `_layout.tsx` BEFORE first render to align
 * `I18nManager` with the chosen locale. Returns `true` if a process restart
 * is required to apply the change.
 *
 * SAFETY: We only call `forceRTL` when the new value differs from the
 * current `I18nManager.isRTL` flag, since toggling unconditionally also
 * triggers a restart prompt on Android.
 */
export function applyRTLForLocale(locale: Locale): { restartRequired: boolean } {
  const wantRTL = directionForLocale(locale) === 'rtl';
  const currentRTL = I18nManager.isRTL;
  if (wantRTL === currentRTL) return { restartRequired: false };
  try {
    I18nManager.allowRTL(wantRTL);
    I18nManager.forceRTL(wantRTL);
  } catch {
    // I18nManager is no-op in some test envs.
  }
  return { restartRequired: true };
}

/**
 * Helper for components that want to swap marginStart/marginEnd or
 * flexDirection based on the active text direction. Most React Native
 * 0.81 layout primitives respect `I18nManager.isRTL` automatically once
 * `forceRTL(true)` has been called and the app reloaded; this helper is
 * for the components that DON'T (e.g. absolute-positioned overlays, the
 * card-deck fan offset, custom flex-row layouts using `marginLeft`).
 */
export function rtlFlip<T>(ltr: T, rtl: T, dir: TextDirection): T {
  return dir === 'rtl' ? rtl : ltr;
}
