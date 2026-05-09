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
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { discoverCards } from '../../src/lib/api/discover';
import type { DiscoverCard } from '../../src/lib/api/discover';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { copper } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { API_BASE } from '../../src/lib/api/client';
import { Button } from '../../src/components/ui/Button';
import { BrandHeader } from '../../src/components/ui/BrandHeader';

export default function DiscoverScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).discover;

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<DiscoverCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen options={{ title: t.title }} />
      <BrandHeader />

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
});
