import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { ThemeProvider } from '../src/lib/theme/ThemeProvider';
import { ToastProvider } from '../src/components/ui/Toast';
import { useAuthStore } from '../src/lib/auth/store';
import { useThemeStore } from '../src/lib/theme/themeStore';
import { useLocaleStore } from '../src/lib/i18n/localeStore';
import { detectLocale } from '../src/lib/i18n/locale';
import { applyRTLForLocale } from '../src/lib/i18n/direction';
import { usePendingReferralStore } from '../src/store/pendingReferralStore';
import { installNotificationHandler } from '../src/lib/push/handler';

// Apply text direction for the resolved locale BEFORE the first render. Once
// the locale store hydrates this re-runs in the layout effect; if the value
// differs from the boot-time guess (e.g. user override is `ar` but OS is
// English) the user is prompted to relaunch from Settings. The race here is
// benign because the override-store hydrate is synchronous-ish (SecureStore)
// and arrives well within the splash window.
applyRTLForLocale(detectLocale());

// Install once at module scope so it runs before the first render. Calling
// `setNotificationHandler` is the React Native equivalent of registering a
// service worker — it must be set before any push arrives.
installNotificationHandler();

// M3 — extract a `ref` query param from any incoming deep-link URL (initial
// or runtime) and stash it in the pending-referral store so the post-auth
// hook can call /redeem. Length-clamp + character allowlist before persisting.
function extractRefParam(url: string): string | null {
  try {
    const queryIdx = url.indexOf('?');
    if (queryIdx < 0) return null;
    const params = new URLSearchParams(url.slice(queryIdx + 1));
    const raw = params.get('ref');
    if (!raw) return null;
    const cleaned = raw.slice(0, 80).replace(/[^A-Za-z0-9_-]/g, '');
    return cleaned || null;
  } catch {
    return null;
  }
}

// Fix 1.8 — extract claim params from opsolid://claim?token=X&orderId=Y.
// Returns null when the URL is not a claim link.
function extractClaimParams(
  url: string,
): { token: string; orderId: string } | null {
  try {
    // Match both opsolid://claim and opsolid://claim? variants.
    if (!/opsolid:\/\/claim($|\?)/i.test(url)) return null;
    const queryIdx = url.indexOf('?');
    if (queryIdx < 0) return null;
    const params = new URLSearchParams(url.slice(queryIdx + 1));
    const token = params.get('token') ?? '';
    const orderId = params.get('orderId') ?? '';
    if (!token || !orderId) return null;
    // Allow-list: tokens and order IDs are alphanumeric + a small set of
    // punctuation chars used by Prisma cuid2 / ULID formats. Anything
    // outside that set is silently dropped to prevent injection into query
    // strings. 128-char hard cap.
    const safe = (s: string) =>
      s.slice(0, 128).replace(/[^A-Za-z0-9_\-]/g, '');
    return { token: safe(token), orderId: safe(orderId) };
  } catch {
    return null;
  }
}

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
    // Re-apply RTL after the locale override hydrates from SecureStore — if
    // the user's saved override differs from the OS-derived locale and the
    // direction changes, this is a no-op for the running session but stages
    // the next-launch direction correctly. The Settings UI handles the
    // restart prompt when the user actively changes the language.
    void hydrateLocale().then(() => {
      applyRTLForLocale(detectLocale());
    });
    hydrate().finally(() => {
      clearTimeout(safetyTimer);
      SplashScreen.hideAsync().catch(() => {});
    });

    // M3 — capture a `?ref=` deep-link param if the app was opened via one.
    // The pending-referral store persists it across auth, and the (app)/_layout
    // post-auth hook fires the redeem call.
    const setPendingRef = usePendingReferralStore.getState().setRef;
    void Linking.getInitialURL().then((initialUrl) => {
      if (!initialUrl) return;
      const ref = extractRefParam(initialUrl);
      if (ref) void setPendingRef(ref);
    });
    const sub = Linking.addEventListener('url', ({ url }) => {
      const ref = extractRefParam(url);
      if (ref) void setPendingRef(ref);
    });

    // M4 — when the user taps a push, route via Linking to the deep-link in
    // the notification's `data.url` field. The handler must live at the root
    // (not inside (app)/_layout) so taps that wake the app from cold start
    // are caught while the auth gate is still resolving — Linking.openURL
    // resolves once the (app) routes are mounted, so this is safe.
    const tapSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as
          | { url?: string }
          | null;
        const url = data?.url;
        if (typeof url === 'string' && url.startsWith('verso://')) {
          void Linking.openURL(url).catch(() => {
            // Unknown deep link — drop it. The user already saw the banner.
          });
        }
      },
    );

    return () => {
      clearTimeout(safetyTimer);
      sub.remove();
      tapSub.remove();
    };
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
        <ToastProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
