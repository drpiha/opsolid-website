import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, ChevronRight, Users as UsersIcon } from 'lucide-react-native';
import { discoverCards } from '../../src/lib/api/discover';
import type { DiscoverCard } from '../../src/lib/api/discover';
import { listEvents } from '../../src/lib/api/events';
import type { EventListItem } from '../../src/lib/api/events';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { copper, teal } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { API_BASE } from '../../src/lib/api/client';
import { Button } from '../../src/components/ui/Button';
import { BrandHeader } from '../../src/components/ui/BrandHeader';
import { EventCover } from '../../src/components/events/EventCover';
import { formatEventDateRange } from '../../src/lib/events/format';

export default function DiscoverScreen() {
  const router = useRouter();
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).discover;
  const tEvents = useTranslations(locale).events;

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<DiscoverCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sprint F2 — events rail. Independent fetch from cards (cheap public GET,
  // 120s cache on the server). Rail is hidden if the rail-fetch fails or
  // returns empty so the search experience stays clean.
  const [events, setEvents] = useState<EventListItem[]>([]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeQuery = useRef('');

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'more', q: string) => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setLoadingMore(true);
      setError(null);

      try {
        const c = mode === 'more' ? (cursor ?? undefined) : undefined;
        const res = await discoverCards({ q: q.trim() || undefined, cursor: c, limit: 20 });
        setItems((prev) => (mode === 'more' ? [...prev, ...res.items] : res.items));
        setCursor(res.nextCursor);
      } catch {
        setError(t.errorLoad);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cursor],
  );

  useEffect(() => {
    activeQuery.current = '';
    void load('initial', '');
    // Fire-and-forget — rail is silent on failure, never blocks search.
    void listEvents({ limit: 6 })
      .then((res) => setEvents(res.items))
      .catch(() => setEvents([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleQueryChange(text: string) {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      activeQuery.current = text;
      void load('initial', text);
    }, 400);
  }

  function handleRefresh() {
    void load('refresh', activeQuery.current);
  }

  function handleEndReached() {
    if (cursor && !loadingMore) {
      void load('more', activeQuery.current);
    }
  }

  function renderItem({ item }: { item: DiscoverCard }) {
    const displayName = item.name ?? item.slug ?? '—';
    const photoUri = item.photoPath
      ? item.photoPath.startsWith('http')
        ? item.photoPath
        : `${API_BASE}${item.photoPath}`
      : null;

    return (
      <Pressable
        onPress={() => {
          if (item.slug) router.push(`/(app)/public/${item.slug}` as never);
        }}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: theme.bg[2] }]}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImg} />
          ) : (
            <Text style={[styles.avatarInitial, { color: theme.ink[300] }]}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.name, { color: theme.ink[100] }]} numberOfLines={1}>
            {displayName}
          </Text>
          {(item.title || item.company) ? (
            <Text style={[styles.sub, { color: theme.ink[400] }]} numberOfLines={1}>
              {[item.title, item.company].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
          {item.city ? (
            <Text style={[styles.location, { color: theme.ink[500] }]} numberOfLines={1}>
              {item.city}{item.country ? `, ${item.country}` : ''}
            </Text>
          ) : null}
        </View>

        <View style={styles.badges}>
          {item.openToNetworking && (
            <View style={[styles.badge, { backgroundColor: copper[50] }]}>
              <Text style={[styles.badgeText, { color: copper[700] }]}>
                {t.networking}
              </Text>
            </View>
          )}
          {item.acceptingClients && (
            <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.badgeText, { color: '#1D4ED8' }]}>
                {t.clients}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  // Sprint F2 — horizontal events rail. Above the search field per spec.
  // Tile dimensions: 220×140 cover-on-top, 64px text block under. Total height
  // ~204px including margins. 4 tiles visible side-by-side on standard widths;
  // user scrolls horizontally for the rest. Tap → /(app)/events/[slug].
  function renderEventsRail() {
    if (events.length === 0) return null;
    return (
      <View style={styles.railWrap}>
        <View style={styles.railHeader}>
          <Text style={[styles.railTitle, { color: theme.ink[100] }]}>
            {t.upcomingEvents}
          </Text>
          <Pressable
            onPress={() => router.push('/(app)/events' as never)}
            hitSlop={8}
            style={styles.railSeeAll}
          >
            <Text style={[styles.railSeeAllText, { color: teal[600] }]}>
              {t.seeAllEvents}
            </Text>
            <ChevronRight size={14} color={teal[600]} />
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.railScroll}
        >
          {events.map((ev) => {
            const dateLine = formatEventDateRange(ev.startAt, ev.endAt, locale);
            return (
              <Pressable
                key={ev.id}
                onPress={() => router.push(`/(app)/events/${ev.slug}` as never)}
                style={({ pressed }) => [
                  styles.railTile,
                  {
                    backgroundColor: theme.bg[1],
                    borderColor: theme.line.DEFAULT,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <EventCover
                  slug={ev.slug}
                  name={ev.name}
                  coverPath={ev.coverPath}
                  width={200}
                  height={108}
                  borderRadius={10}
                  initialsFontSize={42}
                />
                <View style={styles.railTileBody}>
                  <Text
                    style={[styles.railTileName, { color: theme.ink[100] }]}
                    numberOfLines={1}
                  >
                    {ev.name}
                  </Text>
                  <Text
                    style={[styles.railTileMeta, { color: theme.ink[400] }]}
                    numberOfLines={1}
                  >
                    {ev.city} · {dateLine}
                  </Text>
                  <View style={styles.railTileFoot}>
                    <UsersIcon size={11} color={teal[700]} />
                    <Text style={[styles.railTileCount, { color: teal[700] }]}>
                      {ev.attendeeCount === 1
                        ? tEvents.attendeeCountOne
                        : tEvents.attendeeCount.replace(
                            '{count}',
                            String(ev.attendeeCount),
                          )}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen options={{ title: t.title }} />
      <BrandHeader />

      {/* Sprint F2 — events rail. Above the search field per spec. Rail
          is hidden when there are no upcoming events so the screen falls
          back to the original search-first layout. */}
      {renderEventsRail()}

      {/* Search bar */}
      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: theme.bg[1],
            borderBottomColor: theme.line.DEFAULT,
          },
        ]}
      >
        <Search size={16} color={theme.ink[400]} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.ink[100] }]}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={theme.ink[500]}
          value={query}
          onChangeText={handleQueryChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={copper[500]} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.emptyTitle, { color: '#B8514B' }]}>{error}</Text>
          <Button
            label={t.retry}
            onPress={() => void load('initial', activeQuery.current)}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(c) => c.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.emptyTitle, { color: theme.ink[100] }]}>{t.empty}</Text>
              <Text style={[styles.emptyHint, { color: theme.ink[400] }]}>{t.emptyHint}</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={copper[500]}
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={copper[500]} style={{ marginVertical: 16 }} />
            ) : null
          }
          contentContainerStyle={
            items.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : { paddingVertical: 8, paddingHorizontal: 16 }
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
  },
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
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  pressed: { opacity: 0.7 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { fontSize: 20, fontWeight: '600' },
  cardBody: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '500' },
  sub: { fontSize: 13 },
  location: { fontSize: 12 },
  badges: { gap: 4, alignItems: 'flex-end' },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '600' },
  // ---------- Events rail (Sprint F2) ----------
  railWrap: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  railHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  railTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  railSeeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  railSeeAllText: { fontSize: 13, fontWeight: '600' },
  railScroll: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 10,
  },
  railTile: {
    width: 220,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginRight: 0,
  },
  railTileBody: {
    padding: 10,
    gap: 3,
  },
  railTileName: { fontSize: 14, fontWeight: '600', lineHeight: 17 },
  railTileMeta: { fontSize: 11 },
  railTileFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  railTileCount: { fontSize: 11, fontWeight: '600' },
});
