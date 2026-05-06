import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { CardListItem } from '../../src/components/cards/CardListItem';
import { listCards } from '../../src/lib/api/cards';
import type { ApiCard } from '../../src/lib/api/types';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { copper } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';

export default function CardsListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).cards;

  const mounted = useRef(false);
  const [items, setItems] = useState<ApiCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setLoadingMore(true);
      setError(null);
      try {
        const c = mode === 'more' ? (cursor ?? undefined) : undefined;
        const res = await listCards({ limit: 20, cursor: c });
        setItems((prev) =>
          mode === 'more' ? [...prev, ...res.items] : res.items,
        );
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
    void load('initial');
    // Run once on mount — intentionally omitting `load` from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh when screen regains focus after create/edit — skip initial mount
  useFocusEffect(
    useCallback(() => {
      if (!mounted.current) { mounted.current = true; return; }
      void load('refresh');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: theme.ink[100] }]}>
        {t.empty}
      </Text>
      <Text style={[styles.emptyHint, { color: theme.ink[400] }]}>
        {t.emptyHint}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: '#B8514B' }]}>{error}</Text>
      <Button
        label={t.retry}
        onPress={() => void load('initial')}
        variant="secondary"
        style={{ marginTop: 16 }}
      />
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t.title,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/(app)/cards/create' as never)}
              style={{ paddingHorizontal: 4 }}
            >
              <Text style={{ color: copper[500], fontSize: 24, lineHeight: 28 }}>+</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScreenContainer>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={copper[500]} />
          </View>
        ) : error && items.length === 0 ? (
          renderError()
        ) : (
          <FlatList
            data={items}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => <CardListItem card={item} />}
            ListEmptyComponent={renderEmpty()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => void load('refresh')}
                tintColor={copper[500]}
              />
            }
            onEndReached={() => {
              if (cursor && !loadingMore) void load('more');
            }}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  color={copper[500]}
                  style={{ marginVertical: 16 }}
                />
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
    </>
  );
}

const styles = StyleSheet.create({
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
});
