import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ChevronRight, Users as UsersIcon, X as XIcon } from 'lucide-react-native';
import { discoverCards, getSuggestions } from '../../src/lib/api/discover';
import type { DiscoverCard, SuggestionItem } from '../../src/lib/api/discover';
import { listEvents } from '../../src/lib/api/events';
import type { EventListItem } from '../../src/lib/api/events';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { accent } from '../../src/lib/theme/tokens';
import { typography } from '../../src/lib/theme/typography';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { API_BASE } from '../../src/lib/api/client';
import { Button } from '../../src/components/ui/Button';
import { Avatar } from '../../src/components/ui/Avatar';
import { Chip } from '../../src/components/ui/Chip';
import { Card } from '../../src/components/ui/Card';
import { AppBar } from '../../src/components/ui/AppBar';
import { SectionLabel } from '../../src/components/ui/SectionLabel';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { EventCover } from '../../src/components/events/EventCover';
import { formatEventDateRange } from '../../src/lib/events/format';
import { CURATED_TAG_SLUGS } from '../../src/lib/discover/tags';

// "all" is a sentinel — when active, the discover query omits the `tag`
// filter. Stored separately from the curated slugs so the API contract stays
// clean (we never POST `tag=all` to the server).
const ALL_TAG = 'all' as const;

export default function DiscoverScreen() {
  const router = useRouter();
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).discover;
  const tEvents = useTranslations(locale).events;
  const tTags = useTranslations(locale).tags;

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>(ALL_TAG);
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

  // M2 — "people you may know" suggestions. Auth-gated endpoint. We fetch
  // once on mount; if the call fails or returns 0 items, the section auto-
  // hides (server returns 0 when the user has no signal yet — no saved
  // contacts, no city, no tags).
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  // The query string we last fetched results for. Drives the
  // "X results for 'foo'" header — distinct from the in-flight `query`
  // input so the header doesn't flicker as the user types.
  const [committedQuery, setCommittedQuery] = useState('');
  const [committedTag, setCommittedTag] = useState<string>(ALL_TAG);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'more', q: string, tag: string) => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setLoadingMore(true);
      setError(null);

      try {
        const c = mode === 'more' ? (cursor ?? undefined) : undefined;
        const res = await discoverCards({
          q: q.trim() || undefined,
          tag: tag === ALL_TAG ? undefined : tag,
          cursor: c,
          limit: 20,
        });
        setItems((prev) => (mode === 'more' ? [...prev, ...res.items] : res.items));
        setCursor(res.nextCursor);
        if (mode !== 'more') {
          setCommittedQuery(q.trim());
          setCommittedTag(tag);
        }
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
    void load('initial', '', ALL_TAG);
    // Fire-and-forget — rail is silent on failure, never blocks search.
    void listEvents({ limit: 6 })
      .then((res) => setEvents(res.items))
      .catch(() => setEvents([]));
    // M2 — suggestions. Auth-gated; on 401 (anonymous browsing) we silently
    // hide the section by leaving `suggestions` empty.
    void getSuggestions()
      .then((res) => setSuggestions(res.items))
      .catch(() => setSuggestions([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleQueryChange(text: string) {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      void load('initial', text, activeTag);
    }, 250);
  }

  function handleTagSelect(tag: string) {
    if (tag === activeTag) return;
    setActiveTag(tag);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    void load('initial', query, tag);
  }

  function handleClear() {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setQuery('');
    setActiveTag(ALL_TAG);
    void load('initial', '', ALL_TAG);
  }

  function handleRefresh() {
    void load('refresh', committedQuery, committedTag);
  }

  function handleEndReached() {
    if (cursor && !loadingMore) {
      void load('more', committedQuery, committedTag);
    }
  }

  function renderItem({ item }: { item: DiscoverCard }) {
    const displayName = item.name ?? item.slug ?? '—';
    const photoUri = item.photoPath
      ? item.photoPath.startsWith('http')
        ? item.photoPath
        : `${API_BASE}${item.photoPath}`
      : undefined;

    return (
      <Pressable
        onPress={() => {
          if (item.slug) router.push(`/(app)/public/${item.slug}` as never);
        }}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <Card variant="flat" padded={12} style={styles.cardItem}>
          <Avatar
            name={displayName}
            imageUri={photoUri}
            size={52}
            shape="square"
          />

          <View style={styles.cardBody}>
            <Text style={[typography.title3, { color: theme.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            {(item.title || item.company) ? (
              <Text
                style={[typography.bodySmall, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {[item.title, item.company].filter(Boolean).join(' · ')}
              </Text>
            ) : null}
            {item.city ? (
              <Text
                style={[typography.caption, { color: theme.textMuted }]}
                numberOfLines={1}
              >
                {item.city}{item.country ? `, ${item.country}` : ''}
              </Text>
            ) : null}
          </View>

          <View style={styles.badges}>
            {item.openToNetworking && (
              <Chip
                label={t.networking}
                variant="success"
              />
            )}
            {item.acceptingClients && (
              <Chip
                label={t.clients}
                variant="accent"
              />
            )}
          </View>
        </Card>
      </Pressable>
    );
  }

  // Sprint F2 — horizontal events rail. Above the search field per spec.
  // Tile dimensions: 220×140 cover-on-top, 64px text block under. Total height
  // ~204px including margins. Tap → /(app)/events/[slug].
  function renderEventsRail() {
    if (events.length === 0) return null;
    return (
      <View style={styles.railWrap}>
        <View style={styles.railHeader}>
          <SectionLabel>{t.upcomingEvents}</SectionLabel>
          <Pressable
            onPress={() => router.push('/(app)/events' as never)}
            hitSlop={8}
            style={styles.railSeeAll}
          >
            <Text style={[typography.buttonSmall, { color: accent }]}>
              {t.seeAllEvents}
            </Text>
            <ChevronRight size={14} color={accent} />
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
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Card variant="elevated" padded={false} style={styles.railTile}>
                  <EventCover
                    slug={ev.slug}
                    name={ev.name}
                    coverPath={ev.coverPath}
                    width={220}
                    height={108}
                    borderRadius={10}
                    initialsFontSize={42}
                  />
                  <View style={styles.railTileBody}>
                    <Text
                      style={[typography.bodyMedium, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {ev.name}
                    </Text>
                    <Text
                      style={[typography.caption, { color: theme.textSecondary }]}
                      numberOfLines={1}
                    >
                      {ev.city} · {dateLine}
                    </Text>
                    <View style={styles.railTileFoot}>
                      <UsersIcon size={11} color={accent} />
                      <Text style={[typography.caption, { color: accent }]}>
                        {ev.attendeeCount === 1
                          ? tEvents.attendeeCountOne
                          : tEvents.attendeeCount.replace(
                              '{count}',
                              String(ev.attendeeCount),
                            )}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // M2 — "People you may know" rail. Hidden when the suggestions endpoint
  // returns 0 items. Each tile is ~120pt wide, compact horizontal carousel.
  function renderSuggestionsRail() {
    if (suggestions.length === 0) return null;
    return (
      <View style={styles.railWrap}>
        <View style={styles.railHeader}>
          <SectionLabel>{t.suggestionsTitle}</SectionLabel>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsScroll}
        >
          {suggestions.map((s) => {
            const photoUri = s.photoPath
              ? s.photoPath.startsWith('http')
                ? s.photoPath
                : `${API_BASE}${s.photoPath}`
              : undefined;
            const sub = [s.title, s.company].filter(Boolean).join(' · ');
            return (
              <Pressable
                key={s.id}
                onPress={() => {
                  if (s.slug) router.push(`/(app)/public/${s.slug}` as never);
                }}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Card variant="elevated" padded={false} style={styles.suggestionTile}>
                  <View style={styles.suggestionInner}>
                    <Avatar
                      name={s.name}
                      imageUri={photoUri}
                      size={56}
                      shape="circle"
                    />
                    <Text
                      style={[typography.bodyMedium, { color: theme.text, textAlign: 'center' }]}
                      numberOfLines={1}
                    >
                      {s.name}
                    </Text>
                    {sub.length > 0 ? (
                      <Text
                        style={[typography.caption, { color: theme.textSecondary, textAlign: 'center' }]}
                        numberOfLines={1}
                      >
                        {sub}
                      </Text>
                    ) : null}
                    {s.city ? (
                      <Text
                        style={[typography.caption, { color: theme.textMuted, textAlign: 'center' }]}
                        numberOfLines={1}
                      >
                        {s.city}
                      </Text>
                    ) : null}
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // M2 — Tag chip strip. Sits above the search bar. The "all" sentinel is
  // first, followed by the curated sectors. Tapping a chip filters the feed.
  function renderTagStrip() {
    const allChips: { key: string; label: string }[] = [
      { key: ALL_TAG, label: t.allTags },
      ...CURATED_TAG_SLUGS.map((slug) => ({
        key: slug,
        label: (tTags.labels as Record<string, string | undefined>)[slug] ?? slug,
      })),
    ];

    return (
      <View style={styles.tagStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagStripScroll}
        >
          {allChips.map((chip) => {
            const isActive = activeTag === chip.key;
            return (
              <Chip
                key={chip.key}
                label={chip.label}
                variant={isActive ? 'accent' : 'default'}
                onPress={() => handleTagSelect(chip.key)}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // Header chip showing "{n} results for 'foo'" (and/or the active tag).
  // Visible whenever the user has typed a query OR picked a non-"all" tag.
  // Includes a Clear button that wipes both.
  function renderResultsHeader() {
    const hasFilter = committedQuery.length > 0 || committedTag !== ALL_TAG;
    if (!hasFilter) return null;

    let label: string;
    if (committedQuery.length > 0 && committedTag !== ALL_TAG) {
      const tagLabel =
        (tTags.labels as Record<string, string | undefined>)[committedTag] ??
        committedTag;
      label = t.resultsForQueryAndTag
        .replace('{count}', String(items.length))
        .replace('{query}', committedQuery)
        .replace('{tag}', tagLabel);
    } else if (committedQuery.length > 0) {
      label = t.resultsForQuery
        .replace('{count}', String(items.length))
        .replace('{query}', committedQuery);
    } else {
      const tagLabel =
        (tTags.labels as Record<string, string | undefined>)[committedTag] ??
        committedTag;
      label = t.resultsForTag
        .replace('{count}', String(items.length))
        .replace('{tag}', tagLabel);
    }

    return (
      <View style={styles.resultsHeader}>
        <Text
          style={[typography.bodySmall, { color: theme.textMuted, flex: 1 }]}
          numberOfLines={1}
        >
          {label}
        </Text>
        <Pressable onPress={handleClear} hitSlop={8} style={styles.resultsClear}>
          <XIcon size={12} color={accent} />
          <Text style={[typography.buttonSmall, { color: accent }]}>
            {t.clearSearch}
          </Text>
        </Pressable>
      </View>
    );
  }

  const subtitle = t.subtitle ?? 'Find people, partners, peers';

  return (
    <ScreenContainer padded={false}>
      <AppBar
        variant="large"
        title={t.title}
        subtitle={subtitle}
      />

      {/* Sprint F2 — events rail (above suggestions per spec ordering). */}
      {renderEventsRail()}

      {/* M2 — "People you may know" — below events, above tag strip + search. */}
      {renderSuggestionsRail()}

      {/* M2 — Tag chip strip. Above the search bar per spec. */}
      {renderTagStrip()}

      {/* Search bar */}
      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.line.DEFAULT,
          },
        ]}
      >
        <Search size={16} color={theme.textFaint} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, typography.body, { color: theme.text }]}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={theme.textFaint}
          value={query}
          onChangeText={handleQueryChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* M2 — "X results for 'query'" header + Clear. Only when filtering. */}
      {!loading && !error && renderResultsHeader()}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[typography.title2, { color: theme.signalErr }]}>{error}</Text>
          <Button
            label={t.retry}
            onPress={() => void load('initial', committedQuery, committedTag)}
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
              <Card variant="flat" style={styles.emptyCard}>
                <Search size={32} color={theme.textFaint} />
                <Text
                  style={[typography.title2, { color: theme.text, marginTop: 12, textAlign: 'center' }]}
                >
                  {t.empty}
                </Text>
                <Text
                  style={[typography.bodySmall, { color: theme.textMuted, marginTop: 6, textAlign: 'center' }]}
                >
                  {t.emptyHint}
                </Text>
              </Card>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={accent}
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={accent} style={{ marginVertical: 16 }} />
            ) : null
          }
          contentContainerStyle={
            items.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : { paddingVertical: 8, paddingHorizontal: 16 }
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
  },
  // ---------- List card ----------
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  pressed: { opacity: 0.7 },
  cardBody: { flex: 1, gap: 2 },
  badges: { gap: 4, alignItems: 'flex-end' },
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
  railSeeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  railScroll: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 10,
  },
  railTile: {
    width: 220,
    overflow: 'hidden',
  },
  railTileBody: {
    padding: 10,
    gap: 3,
  },
  railTileFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  // ---------- Suggestions rail (M2) ----------
  suggestionsScroll: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 10,
  },
  suggestionTile: {
    width: 120,
    overflow: 'hidden',
  },
  suggestionInner: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
  },
  // ---------- Tag chip strip (M2) ----------
  tagStripWrap: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  tagStripScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  // ---------- Results header (M2) ----------
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  resultsClear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
