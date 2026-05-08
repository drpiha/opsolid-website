import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/lib/theme/ThemeProvider';
import { useAuthStore } from '../src/lib/auth/store';
import { useThemeStore } from '../src/lib/theme/themeStore';
import { useLocaleStore } from '../src/lib/i18n/localeStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const status = useAuthStore((s) => s.status);
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const hydrateLocale = useLocaleStore((s) => s.hydrate);

  useEffect(() => {
    // Belt-and-suspenders: hide splash even if hydrate hangs longer than 10s.
    // A stuck splash is the #1 cause of "app doesn't open" reports.
    const safetyTimer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 10000);
    // Theme + locale hydrate independently of auth — fire them in parallel
    // so the UI settles to the user's chosen mode before the first paint
    // (after auth resolves). Failures are non-fatal; both stores fall back
    // to in-memory defaults.
    void hydrateTheme();
    void hydrateLocale();
    hydrate().finally(() => {
      clearTimeout(safetyTimer);
      SplashScreen.hideAsync().catch(() => {});
    });
    return () => clearTimeout(safetyTimer);
  }, [hydrate, hydrateTheme, hydrateLocale]);

  // Hold splash open while hydrating
  if (status === 'idle' || status === 'loading') {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
