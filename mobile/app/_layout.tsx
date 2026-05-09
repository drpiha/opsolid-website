import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
    // A stuck splash is the #1 cause of "app doesn't open" reports. After the
    // safety timer fires we ALSO force the auth store to 'unauthenticated' so
    // the loading branch below unblocks and the auth screens render — without
    // this, splash hides but the layout still returns null, leaving the user
    // staring at a black screen (Build #20 regression).
    const safetyTimer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
      const s = useAuthStore.getState();
      if (s.status === 'idle' || s.status === 'loading') {
        s.setUser(null);
      }
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

  // Render a deterministic fallback while auth is resolving. Returning null
  // here was the Build #20 black-screen regression: once the safety timer
  // hides the splash, null leaves the host window empty. A flat brand-color
  // surface + spinner proves the app is alive even if hydrate hangs.
  if (status === 'idle' || status === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#1AA6B7',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color="#fff" />
      </View>
    );
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
