import { useEffect, useRef, useState } from 'react';
import { Tabs, Redirect, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useAuthStore } from '../../src/lib/auth/store';
import {
  authenticateBiometric,
  isBiometricEnabled,
} from '../../src/lib/auth/biometric';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { accent } from '../../src/lib/theme/tokens';
import { BottomNav } from '../../src/components/ui/BottomNav';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { useOnboardingDraftStore } from '../../src/store/onboardingDraftStore';
import { usePendingReferralStore } from '../../src/store/pendingReferralStore';
import { useFirstRunStore } from '../../src/store/firstRunStore';
import { TourProvider } from '../../src/components/tour/TourContext';
import { listCards } from '../../src/lib/api/cards';
import { redeemReferral } from '../../src/lib/api/referrals';
import { registerForPushAsync } from '../../src/lib/push/register';
import {
  House,
  CalendarDays,
  CreditCard,
  Compass,
  Users,
  Mail,
  Settings as SettingsIcon,
} from 'lucide-react-native';

export default function AppLayout() {
  const status = useAuthStore((s) => s.status);
  const theme = useTheme();
  const t = useTranslations(detectLocale());
  const router = useRouter();

  const [unlocked, setUnlocked] = useState(false);

  // Onboarding redirect — runs once after auth is hydrated and the biometric
  // gate has resolved. Skipped if either guard flag is true (skipped or
  // everPublished). Doesn't block tab render — Tabs mount immediately and
  // the redirect happens in-flight, which avoids a white flash.
  const checkedOnboarding = useRef(false);
  const onboardingHydrated = useOnboardingDraftStore((s) => s.hydrated);
  const onboardingSkipped = useOnboardingDraftStore((s) => s.skipped);
  const onboardingEverPublished = useOnboardingDraftStore((s) => s.everPublished);
  const hydrateOnboarding = useOnboardingDraftStore((s) => s.hydrate);
  const hydrateFirstRun = useFirstRunStore((s) => s.hydrate);

  // M3 — pending referral attribution. The pendingReferralStore is populated
  // by the deep-link handler (verso://onboarding?ref=…) before the user has
  // an authenticated session; once status flips to `authenticated`, fire one
  // redeem call and clear. Idempotent on the server, so a duplicate call from
  // a re-entrant mount is harmless.
  const pendingRef = usePendingReferralStore((s) => s.ref);
  const pendingRefHydrated = usePendingReferralStore((s) => s.hydrated);
  const hydratePendingRef = usePendingReferralStore((s) => s.hydrate);
  const clearPendingRef = usePendingReferralStore((s) => s.setRef);
  const redeemFired = useRef(false);

  useEffect(() => {
    if (!onboardingHydrated) {
      void hydrateOnboarding();
    }
    if (!pendingRefHydrated) {
      void hydratePendingRef();
    }
    void hydrateFirstRun();
  }, [
    onboardingHydrated,
    hydrateOnboarding,
    pendingRefHydrated,
    hydratePendingRef,
    hydrateFirstRun,
  ]);

  useEffect(() => {
    if (redeemFired.current) return;
    if (status !== 'authenticated') return;
    if (!pendingRefHydrated) return;
    if (!pendingRef) return;
    redeemFired.current = true;
    void redeemReferral(pendingRef)
      .catch(() => {
        // Don't surface — referral attribution is best-effort and never
        // blocks the user. The server is idempotent so a future redeem from
        // a different surface still works.
      })
      .finally(() => {
        void clearPendingRef(null);
      });
  }, [status, pendingRef, pendingRefHydrated, clearPendingRef]);

  // M4 — push registration. Fires once per authenticated session. The call
  // is fire-and-forget (`registerForPushAsync` swallows its own errors) so
  // the OS permission prompt doesn't block any of the rendering branches
  // below — most importantly, it doesn't interfere with the root layout's
  // 10s safety timer that drives the black-screen fallback. If the user
  // never resolves the permission dialog (rare; airplane-mode + suspend),
  // the rest of the app proceeds with no push devices registered, which is
  // the same as a fresh install where the user denies.
  const pushFired = useRef(false);
  useEffect(() => {
    if (pushFired.current) return;
    if (status !== 'authenticated') return;
    pushFired.current = true;
    void registerForPushAsync();
  }, [status]);

  // Fix 1.8 — claim deep-link handler. Listens for
  // opsolid://claim?token=X&orderId=Y both at cold-start and runtime.
  // Navigates to the claim screen with pre-filled params. The handler
  // runs inside (app)/_layout (not the root layout) so the router is
  // mounted and auth is already resolved before navigation fires.
  const claimHandled = useRef(false);
  useEffect(() => {
    if (status !== 'authenticated') return;

    function handleClaimUrl(url: string | null) {
      if (!url) return;
      if (!/opsolid:\/\/claim($|\?)/i.test(url)) return;
      const queryIdx = url.indexOf('?');
      if (queryIdx < 0) return;
      const params = new URLSearchParams(url.slice(queryIdx + 1));
      const rawToken = params.get('token') ?? '';
      const rawOrderId = params.get('orderId') ?? '';
      if (!rawToken || !rawOrderId) return;
      const safe = (s: string) =>
        s.slice(0, 128).replace(/[^A-Za-z0-9_\-]/g, '');
      const token = safe(rawToken);
      const orderId = safe(rawOrderId);
      if (!token || !orderId) return;
      router.push(
        `/(app)/cards/claim?token=${encodeURIComponent(token)}&orderId=${encodeURIComponent(orderId)}` as never,
      );
    }

    // Cold-start: if the app was opened via opsolid://claim, the initial URL
    // is available immediately after the auth gate resolves. Guard once per
    // session — prevents double-navigation on re-renders.
    if (!claimHandled.current) {
      claimHandled.current = true;
      void Linking.getInitialURL().then(handleClaimUrl);
    }

    // Runtime: user taps the link while the app is already open.
    const sub = Linking.addEventListener('url', ({ url }) =>
      handleClaimUrl(url),
    );
    return () => sub.remove();
  }, [status, router]);

  useEffect(() => {
    void isBiometricEnabled().then(async (enabled) => {
      if (!enabled) {
        setUnlocked(true);
        return;
      }
      const ok = await authenticateBiometric('Unlock Verso');
      setUnlocked(ok);
    });
  }, []);

  useEffect(() => {
    if (checkedOnboarding.current) return;
    if (status !== 'authenticated') return;
    if (!unlocked) return;
    if (!onboardingHydrated) return;
    if (onboardingSkipped || onboardingEverPublished) {
      checkedOnboarding.current = true;
      return;
    }
    checkedOnboarding.current = true;

    // Fire a lightweight check. Don't block the tab render — it stays mounted
    // and the redirect happens in-flight. If the user already has cards
    // (signed up earlier, restored a session) we leave them on the deck.
    void listCards({ limit: 1 })
      .then((res) => {
        if (res.items.length === 0) {
          router.replace('/(app)/onboarding' as never);
        }
      })
      .catch(() => {
        // Network failure — don't redirect. The user can manually tap "+" to
        // enter the wizard once the network recovers, and the guard flags
        // remain unchanged so they'll be re-checked on next mount.
      });
  }, [
    status,
    unlocked,
    onboardingHydrated,
    onboardingSkipped,
    onboardingEverPublished,
    router,
  ]);

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  if (!unlocked) return null;

  return (
    <TourProvider>
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.pageBg },
        headerTitleStyle: { color: theme.text },
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: theme.textMuted,
      }}
    >
      {/* Tab 1 — Home dashboard (new landing screen) */}
      <Tabs.Screen
        name="home"
        options={{
          title: t.home.title,
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: t.cards.title,
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t.discover.title,
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      {/* Events — hidden from tab bar (M5 will merge into Discover rail).
          Still reachable via router.push('/(app)/events/index'). */}
      <Tabs.Screen
        name="events/index"
        options={{
          href: null,
          title: t.events.title,
          tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
        }}
      />
      {/* Contacts — hidden from tab bar (M5 will merge into Inbox).
          Still reachable via router.push('/(app)/contacts'). */}
      <Tabs.Screen
        name="contacts"
        options={{
          href: null,
          title: t.contacts.title,
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox/index"
        options={{
          title: t.inbox.title,
          tabBarIcon: ({ color, size }) => <Mail size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.settings.title,
          tabBarIcon: ({ color, size }) => <SettingsIcon size={size} color={color} />,
        }}
      />

      {/* Hidden routes — reachable via router.push, not shown in tab bar */}
      <Tabs.Screen name="cards/[id]" options={{ href: null, title: t.cards.detailTitle }} />
      <Tabs.Screen name="cards/create" options={{ href: null, title: t.cards.createTitle }} />
      <Tabs.Screen name="cards/edit/[id]" options={{ href: null, title: t.cards.editTitle }} />
      {/* Share Center — navigated from card detail or celebration banner. */}
      <Tabs.Screen name="cards/share/[id]" options={{ href: null, title: '' }} />
      {/* Fix 1.8 — claim a card screen. Hidden from tab bar; reached via
          Settings → "Claim a card" or the deep-link opsolid://claim. */}
      <Tabs.Screen name="cards/claim" options={{ href: null, title: t.claimCard.title }} />
      {/* cards/template-preview removed — both edit and create now use an inline
          Modal for the template picker, which avoids the Tabs back-navigation
          bug where router.back() returned to the tab index. */}
      <Tabs.Screen name="public/[slug]" options={{ href: null, title: '' }} />
      {/* Sprint F2 — event detail. Tab is `events/index`; deep route is hidden. */}
      <Tabs.Screen name="events/[slug]" options={{ href: null, title: '' }} />
      {/* Sprint F4 — inbox thread. Tab is `inbox/index`; per-connection
          thread route is hidden from the tab bar. */}
      <Tabs.Screen name="inbox/[connectionId]" options={{ href: null, title: '' }} />
      {/* M6 — push notification preferences subpage. Reached from settings.tsx. */}
      <Tabs.Screen name="settings/notifications" options={{ href: null, title: '' }} />
      {/* Sprint 7 — first-run wizard. Hidden from tab bar; reached via the
          0-card redirect in the effect above, or via the FAB on /cards
          when `everPublished` hasn't been set yet. */}
      <Tabs.Screen
        name="onboarding/index"
        options={{ href: null, headerShown: false, title: '' }}
      />
      {/* Coming Soon stubs — Phase 6+/7 features. Hidden from tab bar;
          reached via router.push from Settings or feature entry points. */}
      <Tabs.Screen name="coming-soon/crm" options={{ href: null, title: '' }} />
      <Tabs.Screen name="coming-soon/nfc-wallet" options={{ href: null, title: '' }} />
      <Tabs.Screen name="coming-soon/workspace-admin" options={{ href: null, title: '' }} />
      <Tabs.Screen name="coming-soon/domain-manager" options={{ href: null, title: '' }} />
    </Tabs>
    </TourProvider>
  );
}
