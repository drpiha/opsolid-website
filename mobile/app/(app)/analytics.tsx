// =============================================================================
// M5 — Pro card analytics screen.
//
// Lists the user's cards in a horizontal picker; tapping one fetches
// /api/v1/cards/[id]/analytics and renders the 30-day stat block. Free-tier
// users get a paywall (the server returns 402 pro_required which we surface
// directly).
// =============================================================================

import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { teal, copper } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { listCards } from '../../src/lib/api/cards';
import { getCardAnalytics, type CardAnalytics } from '../../src/lib/api/billing';
import type { ApiCard } from '../../src/lib/api/types';
import { useAuthStore } from '../../src/lib/auth/store';
import { PaywallModal } from '../../src/components/billing/PaywallModal';
import { fetchMe } from '../../src/lib/auth/api';

export default function AnalyticsScreen() {
  const theme = useTheme();
  const tAll = useTranslations(detectLocale());
  const t = tAll.pro;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);

  const [cards, setCards] = useState<ApiCard[] | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [data, setData] = useState<CardAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const isProUser = Boolean(user?.isPro);

  // List cards once.
  useEffect(() => {
    void (async () => {
      try {
        const res = await listCards({ limit: 50 });
        setCards(res.items);
        if (res.items[0]) setActiveCardId(res.items[0].id);
      } catch {
        setCards([]);
      }
    })();
  }, []);

  const loadAnalytics = useCallback(
    async (cardId: string) => {
      setLoading(true);
      setErr(null);
      setData(null);
      try {
        const res = await getCardAnalytics(cardId);
        setData(res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        if (msg.includes('pro_required')) {
          setPaywallOpen(true);
        } else {
          setErr(t.analyticsError);
        }
      } finally {
        setLoading(false);
      }
    },
    [t.analyticsError],
  );

  useEffect(() => {
    if (!activeCardId) return;
    if (!isProUser) {
      // Open paywall immediately — don't waste a 402 on the server.
      setPaywallOpen(true);
      return;
    }
    void loadAnalytics(activeCardId);
  }, [activeCardId, isProUser, loadAnalytics]);

  async function handlePaywallReturned() {
    try {
      const me = await fetchMe();
      setAuthUser(me);
      if (me.isPro && activeCardId) await loadAnalytics(activeCardId);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: t.analyticsTitle }} />
      <ScreenContainer scrollable>
        {/* Card picker */}
        {cards === null ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <ActivityIndicator color={teal[500]} />
          </View>
        ) : cards.length === 0 ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ color: theme.ink[400], textAlign: 'center' }}>
              {t.analyticsEmpty}
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.label, { color: theme.ink[300] }]}>
              {t.analyticsPickCard}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
            >
              {cards.map((c) => {
                const active = c.id === activeCardId;
                const name =
                  (c.cardData as { name?: string })?.name ?? c.slug ?? c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setActiveCardId(c.id)}
                    activeOpacity={0.85}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? teal[500] : theme.bg[1],
                        borderColor: active ? teal[500] : theme.line.DEFAULT,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? '#fff' : theme.ink[200],
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      {String(name).slice(0, 20)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* Body */}
        {loading ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <ActivityIndicator color={teal[500]} />
            <Text style={[styles.muted, { color: theme.ink[400] }]}>
              {t.analyticsLoading}
            </Text>
          </View>
        ) : err ? (
          <Text style={[styles.muted, { color: '#B8514B', padding: 24 }]}>
            {err}
          </Text>
        ) : data ? (
          <>
            <Text style={[styles.window, { color: theme.ink[400] }]}>
              {t.analyticsWindow.replace('{days}', String(data.windowDays))}
            </Text>
            <View style={styles.statsGrid}>
              <Stat
                theme={theme}
                label={t.analyticsViews}
                value={data.totals.views}
                accent={teal[500]}
              />
              <Stat
                theme={theme}
                label={t.analyticsUnique}
                value={data.totals.uniqueVisitors}
                accent={teal[500]}
              />
              <Stat
                theme={theme}
                label={t.analyticsLeads}
                value={data.totals.leads}
                accent={copper[500]}
              />
              <Stat
                theme={theme}
                label={t.analyticsSaves}
                value={data.totals.saves}
                accent={copper[500]}
              />
              <Stat
                theme={theme}
                label={t.analyticsMutual}
                value={data.totals.mutualSaves}
                accent={copper[500]}
              />
              <Stat
                theme={theme}
                label={t.analyticsShares}
                value={data.totals.shares}
                accent={copper[500]}
              />
            </View>

            <Text style={[styles.section, { color: theme.ink[100] }]}>
              {t.analyticsByChannel}
            </Text>
            <View style={[styles.card, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}>
              {Object.entries(data.shareEventsByChannel).map(([channel, count]) => {
                const max = Math.max(
                  1,
                  ...Object.values(data.shareEventsByChannel),
                );
                const pct = Math.round((count / max) * 100);
                return (
                  <View key={channel} style={styles.barRow}>
                    <Text style={[styles.barLabel, { color: theme.ink[300] }]}>
                      {channel.replace('_', ' ')}
                    </Text>
                    <View
                      style={[
                        styles.barTrack,
                        { backgroundColor: theme.bg[2] },
                      ]}
                    >
                      <View
                        style={[
                          styles.barFill,
                          {
                            backgroundColor: copper[500],
                            width: `${count === 0 ? 0 : Math.max(8, pct)}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barValue, { color: theme.ink[200] }]}>
                      {count}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <Text style={[styles.muted, { color: theme.ink[400], padding: 24 }]}>
            {t.analyticsEmpty}
          </Text>
        )}

      </ScreenContainer>

      <PaywallModal
        visible={paywallOpen}
        onClose={() => {
          setPaywallOpen(false);
          // If the user dismissed without upgrading, get them out of the
          // analytics screen — there's nothing else to show.
          if (!user?.isPro) router.back();
        }}
        reason="analytics"
        onReturned={() => void handlePaywallReturned()}
      />
    </>
  );
}

function Stat({
  theme,
  label,
  value,
  accent,
}: {
  theme: ReturnType<typeof useTheme>;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <View
      style={[
        styles.stat,
        { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
      ]}
    >
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.ink[300] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  window: {
    fontSize: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    minWidth: '47%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.6,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  barLabel: {
    width: 86,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  barValue: {
    width: 32,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
  },
  muted: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
});
