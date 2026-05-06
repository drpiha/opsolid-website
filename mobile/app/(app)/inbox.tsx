import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { listInbox, resolveAction } from '../../src/lib/api/inbox';
import type { InboxItem, InboxActionStatus } from '../../src/lib/api/inbox';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { copper, signal } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { API_BASE } from '../../src/lib/api/client';
import { Button } from '../../src/components/ui/Button';

type Filter = 'pending' | 'accepted' | 'all';

export default function InboxScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).inbox;

  const [filter, setFilter] = useState<Filter>('pending');
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);

  const load = useCallback(
    async (mode: 'initial' | 'refresh', f: Filter) => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      setError(null);
      try {
        const status = f === 'all' ? 'all' : f;
        const res = await listInbox(status);
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

  useFocusEffect(
    useCallback(() => {
      void load('initial', filter);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]),
  );

  function handleFilterChange(f: Filter) {
    setFilter(f);
    void load('initial', f);
  }

  async function handleResolve(id: string, status: 'accepted' | 'declined' | 'archived') {
    setResolving(id);
    try {
      await resolveAction(id, status);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: status as InboxActionStatus } : item,
        ),
      );
    } catch {
      Alert.alert('', t.errorLoad);
    } finally {
      setResolving(null);
    }
  }

  function typeLabel(type: string): string {
    const map: Record<string, string> = {
      request_contact: t.types.request_contact,
      request_quote: t.types.request_quote,
      request_meeting: t.types.request_meeting,
      send_card: t.types.send_card,
      ask_collaboration: t.types.ask_collaboration,
      give_feedback: t.types.give_feedback,
    };
    return map[type] ?? type;
  }

  function statusColor(status: string): string {
    if (status === 'accepted') return signal.ok;
    if (status === 'declined') return '#B8514B';
    if (status === 'archived') return '#6B717B';
    return copper[500]; // pending
  }

  function renderItem({ item }: { item: InboxItem }) {
    const senderName = item.sender.name ?? item.sender.slug ?? '—';
    const photoUri = item.sender.photoPath
      ? item.sender.photoPath.startsWith('http')
        ? item.sender.photoPath
        : `${API_BASE}${item.sender.photoPath}`
      : null;
    const isPending = item.status === 'pending';

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
        ]}
      >
        <Pressable
          onPress={() => {
            if (item.sender.slug) router.push(`/(app)/public/${item.sender.slug}` as never);
          }}
          style={styles.cardHeader}
        >
          <View style={[styles.avatar, { backgroundColor: theme.bg[2] }]}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImg} />
            ) : (
              <Text style={[styles.avatarInitial, { color: theme.ink[300] }]}>
                {senderName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <View style={styles.headerBody}>
            <Text style={[styles.senderName, { color: theme.ink[100] }]} numberOfLines={1}>
              {senderName}
            </Text>
            {(item.sender.title || item.sender.company) ? (
              <Text style={[styles.senderSub, { color: theme.ink[400] }]} numberOfLines={1}>
                {[item.sender.title, item.sender.company].filter(Boolean).join(' · ')}
              </Text>
            ) : null}
            <Text style={[styles.typeLabel, { color: copper[600] }]}>
              {typeLabel(item.type)}
            </Text>
          </View>

          <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
        </Pressable>

        {item.message ? (
          <Text style={[styles.message, { color: theme.ink[300], borderTopColor: theme.line.DEFAULT }]}>
            {item.message}
          </Text>
        ) : null}

        {isPending && (
          <View style={[styles.actions, { borderTopColor: theme.line.DEFAULT }]}>
            <Pressable
              onPress={() => void handleResolve(item.id, 'declined')}
              disabled={resolving === item.id}
              style={[styles.actionBtn, styles.declineBtn, { borderColor: theme.line.DEFAULT }]}
            >
              {resolving === item.id ? (
                <ActivityIndicator size="small" color={theme.ink[400]} />
              ) : (
                <Text style={[styles.actionBtnText, { color: theme.ink[300] }]}>{t.decline}</Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => void handleResolve(item.id, 'accepted')}
              disabled={resolving === item.id}
              style={[styles.actionBtn, styles.acceptBtn]}
            >
              {resolving === item.id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.actionBtnText, { color: '#fff' }]}>{t.accept}</Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'pending', label: t.pending },
    { key: 'accepted', label: t.accepted },
    { key: 'all', label: t.all },
  ];

  return (
    <>
      <Stack.Screen options={{ title: t.title }} />
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.filterRow, { borderBottomColor: theme.line.DEFAULT }]}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => handleFilterChange(f.key)}
              style={[
                styles.chip,
                filter === f.key
                  ? { backgroundColor: copper[500] }
                  : { backgroundColor: theme.bg[1], borderWidth: StyleSheet.hairlineWidth, borderColor: theme.line.DEFAULT },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: filter === f.key ? '#fff' : theme.ink[300] },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={copper[500]} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={[styles.emptyTitle, { color: '#B8514B' }]}>{error}</Text>
            <Button
              label={t.retry}
              onPress={() => void load('initial', filter)}
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
                onRefresh={() => void load('refresh', filter)}
                tintColor={copper[500]}
              />
            }
            contentContainerStyle={
              items.length === 0
                ? { flex: 1, justifyContent: 'center' }
                : { paddingVertical: 8, paddingHorizontal: 16 }
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  filterRow: {
    flexShrink: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: { fontSize: 17, fontWeight: '500', marginBottom: 6, textAlign: 'center' },
  emptyHint: { fontSize: 14, textAlign: 'center' },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { fontSize: 18, fontWeight: '600' },
  headerBody: { flex: 1, gap: 2 },
  senderName: { fontSize: 15, fontWeight: '500' },
  senderSub: { fontSize: 12 },
  typeLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  message: {
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: { borderWidth: StyleSheet.hairlineWidth },
  acceptBtn: { backgroundColor: copper[500] },
  actionBtnText: { fontSize: 13, fontWeight: '600' },
});
