import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { BrandHeader } from '../../src/components/ui/BrandHeader';
import { Button } from '../../src/components/ui/Button';
import { CardDeck } from '../../src/components/cards/CardDeck';
import { CardDeckList } from '../../src/components/cards/CardDeckList';
import { CardDeckEmpty } from '../../src/components/cards/CardDeckEmpty';
import { CardDeckFAB } from '../../src/components/cards/CardDeckFAB';
import { PaywallModal } from '../../src/components/billing/PaywallModal';
import { listCards } from '../../src/lib/api/cards';
import type { ApiCard } from '../../src/lib/api/types';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { teal } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { useOnboardingDraftStore } from '../../src/store/onboardingDraftStore';
import { useFirstRunStore } from '../../src/store/firstRunStore';
import { useTour } from '../../src/components/tour/TourContext';
import { useAuthStore } from '../../src/lib/auth/store';
import { fetchMe } from '../../src/lib/auth/api';

const FREE_TIER_LIMIT = 1;

// Deck visual works well for 1-4 cards (the four stacked layers fit naturally).
// At 5+ cards the deck would need an overflow gesture to reveal hidden cards,
// which is a discoverability tax — switch to a plain scrollable list instead.
const LIST_THRESHOLD = 5;

export default function CardsListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const tAll = useTranslations(detectLocale());
  const t = tAll.cards;
  const tTour = tAll.tour;

  const mounted = useRef(false);
  const [items, setItems] = useState<ApiCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const everPublished = useOnboardingDraftStore((s) => s.everPublished);
  const user = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // M7 Wave 2 — Tour A (first-card) gating.
  // We track these on `firstRunStore` (separate from `onboardingDraftStore`'s
  // `everPublished`, which gates the wizard auto-redirect). The tour-side
  // flag is set when we observe sorted.length > 0 OR when the wizard's
  // publish handler completes — both paths feed `markEverPublished(true)`.
  const { startTour } = useTour();
  const seenTours = useFirstRunStore((s) => s.seenTours);
  const tourEverPublished = useFirstRunStore((s) => s.everPublished);

  // Anchor refs for Tour A spotlight cutouts. Wrapped around the empty-state
  // hero and the FAB respectively — measureInWindow needs a measurable native
  // View, and the components themselves render Pressables which can be flaky
  // to measure on Android. The wrappers are pure layout (no styling).
  const cardDeckEmptyRef = useRef<View>(null);
  const cardDeckFABRef = useRef<View>(null);

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (mode === 'initial') setLoading(true);
      setError(null);
      try {
        // Pull a healthy first page — list view kicks in past 10 anyway.
        const res = await listCards({ limit: 50 });
        setItems(res.items);
      } catch {
        setError(t.errorLoad);
      } finally {
        setLoading(false);
      }
    },
    [t.errorLoad],
  );

  useEffect(() => {
    void load('initial');
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      void load('refresh');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // Sort cards by updatedAt desc — most-recently edited card is top of deck.
  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aT = Date.parse(a.updatedAt) || 0;
        const bT = Date.parse(b.updatedAt) || 0;
        return bT - aT;
      }),
    [items],
  );

  // M7 Wave 2 — once we observe the user has at least one card, mark the
  // tour-side `everPublished` flag. This handles the reinstall case: the
  // wizard's `everPublished` lives in onboardingDraftStore (cleared on
  // SecureStore wipe) but if the server still has cards, we don't want to
  // re-run Tour A. The check is idempotent inside `markEverPublished`.
  useEffect(() => {
    if (sorted.length > 0 && !tourEverPublished) {
      useFirstRunStore.getState().markEverPublished(true);
    }
  }, [sorted.length, tourEverPublished]);

  // M7 Wave 2 — Tour A (first-card) trigger. Fires when:
  //   - the cards list has finished loading (no spinner / no error)
  //   - the deck is empty (no cards yet — the empty-state hero is mounted)
  //   - the user hasn't seen / skipped this tour before
  //   - the user has never published a card (reinstall guard)
  // The 600ms delay lets the focus animation + initial layout pass settle so
  // measureInWindow returns finite, non-zero coords for the empty hero ref.
  useFocusEffect(
    useCallback(() => {
      if (loading) return;
      if (sorted.length > 0) return;
      if (seenTours['first-card']) return;
      if (tourEverPublished) return;

      const timer = setTimeout(() => {
        startTour({
          tourId: 'first-card',
          steps: [
            {
              key: 'A-1',
              targetRef: cardDeckEmptyRef,
              title: tTour.firstCardTitle1,
              body: tTour.firstCardBody1,
              ctaLabel: tTour.next,
            },
            {
              key: 'A-2',
              targetRef: cardDeckFABRef,
              title: tTour.firstCardTitle2,
              body: tTour.firstCardBody2,
              ctaLabel: tTour.firstCardCta2,
              action: async () => goCreate(),
            },
            {
              key: 'A-3',
              targetRef: null,
              title: tTour.firstCardTitle3,
              body: tTour.firstCardBody3,
              ctaLabel: tTour.done,
            },
          ],
        });
      }, 600);

      return () => clearTimeout(timer);
      // goCreate is stable enough for our purposes — reading from
      // route/router/state inside the closure is fine; we rely on the
      // outer `seenTours['first-card']` to keep this from re-firing.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, sorted.length, seenTours, tourEverPublished, startTour]),
  );

  function goCreate() {
    // M5 — free-tier 1-card cap. When the user already has 1+ cards AND isn't
    // Pro, replace the navigation with the paywall modal. The server enforces
    // the same gate (POST /api/v1/cards returns 402 pro_required) — this
    // client-side check is purely for UX, the server is the source of truth.
    const isProUser = Boolean(user?.isPro);
    if (!isProUser && sorted.length >= FREE_TIER_LIMIT) {
      setPaywallOpen(true);
      return;
    }
    // Always start from the wizard if the user has never published. The
    // wizard sets everPublished:true on success; once that's set the user
    // is past the "calm onboarding" need and lands directly in the full
    // create form.
    if (!everPublished) {
      router.push('/(app)/onboarding' as never);
    } else {
      router.push('/(app)/cards/create' as never);
    }
  }

  // After a checkout return, refresh /auth/me so the isPro flag updates.
  async function handlePaywallReturned() {
    try {
      const me = await fetchMe();
      setAuthUser(me);
    } catch {
      // ignore — next mount will refresh
    }
  }

  const renderError = () => (
    <View style={styles.empty}>
      <Text style={[styles.errText, { color: theme.signalErr }]}>{error}</Text>
      <Button
        label={t.retry}
        onPress={() => void load('initial')}
        variant="secondary"
        style={{ marginTop: 16 }}
      />
    </View>
  );

  const isEmpty = !loading && !error && sorted.length === 0;
  const isList = sorted.length >= LIST_THRESHOLD;

  return (
    <>
      {/* The screen-header "+" is gone — FAB is the new entry point. */}
      <Stack.Screen options={{ title: t.title }} />
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
        <ScreenContainer style={styles.zeroPad}>
          <BrandHeader />
          <View style={styles.body}>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color={teal[500]} />
              </View>
            ) : error && sorted.length === 0 ? (
              renderError()
            ) : isEmpty ? (
              <View
                ref={cardDeckEmptyRef}
                collapsable={false}
                style={styles.tourAnchorFlex}
              >
                <CardDeckEmpty
                  onPress={goCreate}
                  headline={t.emptyHeadline}
                  subline={t.emptySubline}
                />
              </View>
            ) : isList ? (
              <CardDeckList cards={sorted} />
            ) : (
              <CardDeck cards={sorted} />
            )}
          </View>
        </ScreenContainer>

        {/* FAB stays mounted on every state (empty / deck / list). Pulses on
            empty to draw attention to the primary CTA. Positioned at the
            screen-root level (outside ScreenContainer) so its 24pt right
            inset is measured from the screen edge, not the container padding. */}
        {!loading && (
          <CardDeckFAB
            ref={cardDeckFABRef}
            onPress={goCreate}
            pulse={sorted.length === 0}
          />
        )}
      </View>
      <PaywallModal
        visible={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        reason="card_limit"
        onReturned={() => void handlePaywallReturned()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  zeroPad: {
    padding: 0,
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errText: {
    fontSize: 16,
    textAlign: 'center',
  },
  tourAnchorFlex: {
    flex: 1,
  },
});
