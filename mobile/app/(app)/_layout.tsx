import { useEffect, useRef, useState } from 'react';
import { Tabs, Redirect, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/lib/auth/store';
import {
  authenticateBiometric,
  isBiometricEnabled,
} from '../../src/lib/auth/biometric';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { copper } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { useOnboardingDraftStore } from '../../src/store/onboardingDraftStore';
import { usePendingReferralStore } from '../../src/store/pendingReferralStore';
import { useFirstRunStore } from '../../src/store/firstRunStore';
import { TourProvider } from '../../src/components/tour/TourContext';
import { listCards } from '../../src/lib/api/cards';
import { redeemReferral } from '../../src/lib/api/referrals';
import { registerForPushAsync } from '../../src/lib/push/register';
import {
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
      screenOptions={{
        headerStyle: { backgroundColor: theme.bg[0] },
        headerTitleStyle: { color: theme.ink[100] },
        tabBarStyle: {
          backgroundColor: theme.bg[1],
          borderTopColor: theme.line.DEFAULT,
        },
        tabBarActiveTintColor: copper[500],
        tabBarInactiveTintColor: theme.ink[400],
      }}
    >
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
      <Tabs.Screen
        name="events/index"
        options={{
          title: t.events.title,
          tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
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
      {/* Sprint 6 — full-screen template preview reachable from the edit form's
          template carousel. Header is rendered inside the screen itself so
          it can place its own close button + page indicator. */}
      <Tabs.Screen
        name="cards/template-preview"
        options={{ href: null, headerShown: false, title: '' }}
      />
      <Tabs.Screen name="public/[slug]" options={{ href: null, title: '' }} />
      {/* Sprint F2 — event detail. Tab is `events/index`; deep route is hidden. */}
      <Tabs.Screen name="events/[slug]" options={{ href: null, title: '' }} />
      {/* Sprint F4 — inbox thread. Tab is `inbox/index`; per-connection
          thread route is hidden from the tab bar. */}
      <Tabs.Screen name="inbox/[connectionId]" options={{ href: null, title: '' }} />
      {/* Sprint 7 — first-run wizard. Hidden from tab bar; reached via the
          0-card redirect in the effect above, or via the FAB on /cards
          when `everPublished` hasn't been set yet. */}
      <Tabs.Screen
        name="onboarding/index"
        options={{ href: null, headerShown: false, title: '' }}
      />
    </Tabs>
    </TourProvider>
  );
}
