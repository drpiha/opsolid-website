// -----------------------------------------------------------------------
// Sprint F2 — Events tab.
//
// Lists upcoming fairs / conferences / meetups, sorted by startAt asc.
// Each row: cover (or initials gradient if coverPath null) + title +
// city/venue/date + attendee count badge. Tap → /(app)/events/[slug].
// -----------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';
import { listEvents } from '../../../src/lib/api/events';
import type { EventListItem } from '../../../src/lib/api/events';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper, teal } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { Button } from '../../../src/components/ui/Button';
import { BrandHeader } from '../../../src/components/ui/BrandHeader';
import { EventCover } from '../../../src/components/events/EventCover';
import { formatEventDateRange } from '../../../src/lib/events/format';

export default function EventsListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).events;

  const [items, setItems] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function renderItem({ item }: { item: EventListItem }) {
    const dateLine = formatEventDateRange(item.startAt, item.endAt, locale);
    const placeLine = [item.city, item.venue].filter(Boolean).join(' · ');
    const countLabel =
      item.attendeeCount === 1
        ? t.attendeeCountOne
        : t.attendeeCount.replace('{count}', String(item.attendeeCount));

    return (
      <Pressable
        onPress={() => router.push(`/(app)/events/${item.slug}` as never)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.bg[1],
            borderColor: theme.line.DEFAULT,
          },
          pressed && styles.pressed,
        ]}
      >
        <EventCover
          slug={item.slug}
          name={item.name}
          coverPath={item.coverPath}
          width={88}
          height={88}
          borderRadius={12}
        />

        <View style={styles.body}>
          <Text style={[styles.name, { color: theme.ink[100] }]} numberOfLines={2}>
            {item.name}
          </Text>
          {placeLine ? (
            <Text style={[styles.sub, { color: theme.ink[400] }]} numberOfLines={1}>
              {placeLine}
            </Text>
          ) : null}
          <Text style={[styles.date, { color: theme.ink[300] }]} numberOfLines={1}>
            {dateLine}
          </Text>
          <View style={styles.countRow}>
            <View style={[styles.countBadge, { backgroundColor: teal[50] }]}>
              <Users size={11} color={teal[700]} />
              <Text style={[styles.countText, { color: teal[700] }]}>
                {countLabel}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen options={{ title: t.title }} />
      <BrandHeader />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={copper[500]} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.emptyTitle, { color: '#B8514B' }]}>{error}</Text>
          <Button
            label={t.retry}
            onPress={() => void load('initial')}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(e) => e.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.emptyTitle, { color: theme.ink[100] }]}>
                {t.empty}
              </Text>
              <Text style={[styles.emptyHint, { color: theme.ink[400] }]}>
                {t.emptyHint}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load('refresh')}
              tintColor={copper[500]}
            />
          }
          contentContainerStyle={
            items.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : { paddingVertical: 12, paddingHorizontal: 16 }
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyHint: { fontSize: 14, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  pressed: { opacity: 0.7 },
  body: {
    flex: 1,
    gap: 4,
    justifyContent: 'space-between',
  },
  name: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
  sub: { fontSize: 13 },
  date: { fontSize: 12, fontWeight: '500' },
  countRow: { flexDirection: 'row', marginTop: 4 },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  countText: { fontSize: 11, fontWeight: '600' },
});
