import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/lib/theme/ThemeProvider';
import { useAuthStore } from '../src/lib/auth/store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    // Belt-and-suspenders: hide splash even if hydrate hangs longer than 10s.
    // A stuck splash is the #1 cause of "app doesn't open" reports.
    const safetyTimer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 10000);
    hydrate().finally(() => {
      clearTimeout(safetyTimer);
      SplashScreen.hideAsync().catch(() => {});
    });
    return () => clearTimeout(safetyTimer);
  }, [hydrate]);

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
