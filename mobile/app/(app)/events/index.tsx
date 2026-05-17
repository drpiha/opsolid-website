// -----------------------------------------------------------------------
// Verso v2 — Events list screen.
//
// AppBar large + filter chip row + event cards list.
// Reachable via deep-link or Discover rail (hidden from tab bar).
// -----------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarDays, Users } from 'lucide-react-native';
import { listEvents } from '../../../src/lib/api/events';
import type { EventListItem } from '../../../src/lib/api/events';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { accent } from '../../../src/lib/theme/tokens';
import { typography } from '../../../src/lib/theme/typography';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import type { Locale } from '../../../src/lib/i18n/locale';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { Chip } from '../../../src/components/ui/Chip';
import { AppBar } from '../../../src/components/ui/AppBar';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { EventCover } from '../../../src/components/events/EventCover';
import { formatEventDateRange } from '../../../src/lib/events/format';

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------
type FilterKey = 'all' | 'upcoming' | 'live';

function isLiveNow(startAt: string, endAt: string): boolean {
  const now = Date.now();
  return new Date(startAt).getTime() <= now && new Date(endAt).getTime() >= now;
}

function isUpcoming(startAt: string): boolean {
  return new Date(startAt).getTime() > Date.now();
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function EventsListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).events;

  const [items, setItems] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      setError(null);
      try {
        const res = await listEvents();
        setItems(res.items);
      } catch {
        setError(t.errorLoad);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [t.errorLoad],
  );

  useEffect(() => {
    void load('initial');
  }, [load]);

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'live') return isLiveNow(item.startAt, item.endAt);
    if (activeFilter === 'upcoming') return isUpcoming(item.startAt);
    return true;
  });

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: t.allFilter },
    { key: 'upcoming', label: t.upcomingFilter },
    { key: 'live', label: t.liveFilter },
  ];

  return (
    <ScreenContainer padded={false} edges={['bottom']}>
      <AppBar
        variant="large"
        title={t.title}
        subtitle={t.subtitle}
      />

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {filters.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            variant={activeFilter === f.key ? 'accent' : 'default'}
            onPress={() => setActiveFilter(f.key)}
          />
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[typography.body, { color: theme.signalErr, textAlign: 'center' }]}>
            {error}
          </Text>
          <Button
            label={t.retry}
            onPress={() => void load('initial')}
            variant="secondary"
            fullWidth={false}
            style={styles.retryBtn}
          />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              locale={locale}
              t={t}
              onPress={() => router.push(`/(app)/events/${item.slug}` as never)}
            />
          )}
          ListEmptyComponent={<EmptyState t={t} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load('refresh')}
              tintColor={accent}
            />
          }
          contentContainerStyle={
            filteredItems.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Translations type alias (used across sub-components)
// ---------------------------------------------------------------------------
type EventsT = ReturnType<typeof useTranslations>['events'];

// ---------------------------------------------------------------------------
// Event card
// ---------------------------------------------------------------------------
function EventCard({
  item,
  locale,
  t,
  onPress,
}: {
  item: EventListItem;
  locale: Locale;
  t: EventsT;
  onPress: () => void;
}) {
  const theme = useTheme();
  const dateLine = formatEventDateRange(item.startAt, item.endAt, locale);
  const placeLine = [item.city, item.venue].filter(Boolean).join(' · ');
  const live = isLiveNow(item.startAt, item.endAt);

  const tRaw = t as unknown as Record<string, string>;
  const countLabel =
    item.attendeeCount === 1
      ? tRaw.attendeeCountOne
      : tRaw.attendeeCount.replace('{count}', String(item.attendeeCount));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={item.name}
    >
      <Card variant="elevated" padded={false} style={styles.card}>
        {/* Cover image */}
        <View style={styles.coverWrap}>
          <EventCover
            slug={item.slug}
            name={item.name}
            coverPath={item.coverPath}
            width="100%"
            height={140}
            borderRadius={0}
          />
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <Text
            style={[typography.title1, { color: theme.text }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {placeLine ? (
            <Text
              style={[typography.body, { color: theme.textSecondary, marginTop: 4 }]}
              numberOfLines={1}
            >
              {placeLine}
            </Text>
          ) : null}

          <Text
            style={[typography.bodySmall, { color: theme.textMuted, marginTop: 2 }]}
            numberOfLines={1}
          >
            {dateLine}
          </Text>

          {/* Status chips */}
          <View style={styles.chipRow}>
            {live ? (
              <Chip
                label="Live now"
                variant="success"
                dot="live"
              />
            ) : null}
            <Chip
              label={countLabel}
              variant="accent"
              leadingIcon={<Users size={12} color={accent} />}
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState({ t }: { t: EventsT }) {
  const theme = useTheme();
  const tRaw = t as unknown as Record<string, string>;
  return (
    <View style={styles.center}>
      <Card variant="flat" style={styles.emptyCard}>
        <CalendarDays size={32} color={theme.textFaint} />
        <Text style={[typography.title2, { color: theme.text, textAlign: 'center', marginTop: 12 }]}>
          {tRaw.emptyTitle}
        </Text>
        <Text style={[typography.body, { color: theme.textSecondary, textAlign: 'center', marginTop: 6 }]}>
          {tRaw.emptyHint}
        </Text>
      </Card>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  retryBtn: {
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
    gap: 14,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 18,
  },
  coverWrap: {
    width: '100%',
  },
  cardBody: {
    padding: 16,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 28,
    width: '100%',
  },
  pressed: {
    opacity: 0.75,
  },
});
