import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { Star, UserPlus } from 'lucide-react-native';
import {
  listContacts,
  unsaveCard,
  seedSampleContacts,
} from '../../src/lib/api/contacts';
import type { SavedContact } from '../../src/lib/api/contacts';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { copper } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { API_BASE } from '../../src/lib/api/client';
import { Button } from '../../src/components/ui/Button';
import { BrandHeader } from '../../src/components/ui/BrandHeader';
import { useAuthStore } from '../../src/lib/auth/store';
import { useContactsRefreshStore } from '../../src/store/contactsRefreshStore';

export default function ContactsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).contacts;

  const isAuthenticated = useAuthStore((s) => !!s.user);
  const dirty = useContactsRefreshStore((s) => s.dirty);
  const clearDirty = useContactsRefreshStore((s) => s.clearDirty);

  const [items, setItems] = useState<SavedContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    if (mode === 'initial') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    setError(null);
    try {
      const res = await listContacts();
      setItems(res.items);
    } catch {
      setError(t.errorLoad);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t.errorLoad]);

  // Re-fetch on every focus. The dirty bit set by the public-card viewer is a
  // belt-and-braces hint that we *must* refetch even if the screen had been
  // left mounted; clearing the bit on focus keeps the store tidy regardless
  // of whether dirty was true or false. See contactsRefreshStore.ts.
  useFocusEffect(
    useCallback(() => {
      void load('initial');
      if (dirty) clearDirty();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dirty]),
  );

  async function handleSeedSamples() {
    if (seeding) return;
    setSeeding(true);
    try {
      const res = await seedSampleContacts();
      // Refetch first so the list reflects the new rows immediately.
      await load('refresh');
      if (res.created > 0) {
        Alert.alert('', t.seedSuccess.replace('{count}', String(res.created)));
      } else if (res.alreadyHad > 0) {
        Alert.alert('', t.seedAllAlready);
      } else {
        // Cards weren't published / not found — surface as a generic error so
        // the user knows the action didn't add anything.
        Alert.alert('', t.seedError);
      }
    } catch {
      Alert.alert('', t.seedError);
    } finally {
      setSeeding(false);
    }
  }

  function confirmUnsave(contact: SavedContact) {
    Alert.alert('', t.unsaveConfirm, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.unsave,
        style: 'destructive',
        onPress: async () => {
          if (!contact.card.slug) return;
          try {
            await unsaveCard(contact.card.slug);
            setItems((prev) => prev.filter((c) => c.id !== contact.id));
          } catch {
            Alert.alert('', t.errorLoad);
          }
        },
      },
    ]);
  }

  function renderItem({ item }: { item: SavedContact }) {
    const displayName = item.card.name ?? item.card.slug ?? '—';
    const photoUri = item.card.photoPath
      ? item.card.photoPath.startsWith('http')
        ? item.card.photoPath
        : `${API_BASE}${item.card.photoPath}`
      : null;

    return (
      <Pressable
        onPress={() => {
          if (item.card.slug) router.push(`/(app)/public/${item.card.slug}` as never);
        }}
        style={({ pressed }) => [
          styles.row,
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

        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.ink[100] }]} numberOfLines={1}>
              {displayName}
            </Text>
            {item.starred && (
              <Star size={12} color={copper[500]} fill={copper[500]} />
            )}
          </View>
          {(item.card.title || item.card.company) ? (
            <Text style={[styles.sub, { color: theme.ink[400] }]} numberOfLines={1}>
              {[item.card.title, item.card.company].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
          {item.tags.length > 0 && (
            <View style={styles.tags}>
              {item.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: theme.bg[2] }]}>
                  <Text style={[styles.tagText, { color: theme.ink[400] }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Pressable
          onPress={() => confirmUnsave(item)}
          style={[styles.unsaveBtn, { borderColor: theme.line.DEFAULT }]}
          hitSlop={8}
        >
          <Text style={[styles.unsaveBtnText, { color: theme.ink[400] }]}>{t.unsave}</Text>
        </Pressable>
      </Pressable>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: t.title }} />
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
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
            keyExtractor={(c) => c.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.center}>
                {isAuthenticated ? (
                  <Pressable
                    onPress={() => void handleSeedSamples()}
                    disabled={seeding}
                    style={({ pressed }) => [
                      styles.seedCta,
                      { backgroundColor: copper[500] },
                      pressed && styles.pressed,
                      seeding && { opacity: 0.6 },
                    ]}
                    accessibilityRole="button"
                  >
                    {seeding ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <UserPlus size={16} color="#fff" />
                    )}
                    <Text style={styles.seedCtaText}>{t.seedCta}</Text>
                  </Pressable>
                ) : null}
                <Text style={[styles.emptyTitle, { color: theme.ink[100] }]}>{t.empty}</Text>
                <Text style={[styles.emptyHint, { color: theme.ink[400] }]}>{t.emptyHint}</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: { fontSize: 17, fontWeight: '500', marginBottom: 6, textAlign: 'center' },
  emptyHint: { fontSize: 14, textAlign: 'center' },
  seedCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginBottom: 24,
    minWidth: 240,
  },
  seedCtaText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  row: {
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
  body: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  name: { fontSize: 15, fontWeight: '500', flex: 1 },
  sub: { fontSize: 13 },
  tags: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 11 },
  unsaveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  unsaveBtnText: { fontSize: 12, fontWeight: '500' },
});
