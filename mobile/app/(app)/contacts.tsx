// contacts.tsx — Verso v2 polish.
// Screen is hidden from tab bar but reachable via router.push.
// The /(app)/contacts route must remain live so existing push calls don't 404.

import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Star, Users } from 'lucide-react-native';
import {
  listContacts,
  unsaveCard,
  seedSampleContacts,
} from '../../src/lib/api/contacts';
import type { SavedContact } from '../../src/lib/api/contacts';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { accent } from '../../src/lib/theme/tokens';
import { typography } from '../../src/lib/theme/typography';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { API_BASE } from '../../src/lib/api/client';
import { Button } from '../../src/components/ui/Button';
import { AppBar } from '../../src/components/ui/AppBar';
import { Avatar } from '../../src/components/ui/Avatar';
import { Card } from '../../src/components/ui/Card';
import { Chip } from '../../src/components/ui/Chip';
import { Row } from '../../src/components/ui/Row';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
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
  const [search, setSearch] = useState('');

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
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
    },
    [t.errorLoad],
  );

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
      await load('refresh');
      if (res.created > 0) {
        Alert.alert('', t.seedSuccess.replace('{count}', String(res.created)));
      } else if (res.alreadyHad > 0) {
        Alert.alert('', t.seedAllAlready);
      } else {
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

  function photoUri(item: SavedContact): string | undefined {
    const path = item.card.photoPath;
    if (!path) return undefined;
    return path.startsWith('http') ? path : `${API_BASE}${path}`;
  }

  const filtered = search.trim()
    ? items.filter((c) => {
        const name = (c.card.name ?? c.card.slug ?? '').toLowerCase();
        const role = (c.card.title ?? '').toLowerCase();
        const company = (c.card.company ?? '').toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || role.includes(q) || company.includes(q);
      })
    : items;

  function renderItem({ item, index }: { item: SavedContact; index: number }) {
    const displayName = item.card.name ?? item.card.slug ?? '—';
    const subtitle = [item.card.title, item.card.company].filter(Boolean).join(' · ');

    return (
      <Row
        divider={index > 0}
        title={displayName}
        subtitle={subtitle || undefined}
        leading={
          <Avatar
            name={displayName}
            imageUri={photoUri(item)}
            size={36}
            shape="circle"
          />
        }
        trailing={
          <View style={styles.rowTrailing}>
            {item.starred ? (
              <Star size={14} color={accent} fill={accent} />
            ) : null}
            {item.tags.length > 0 ? (
              <Chip label={item.tags[0]} variant="outline" />
            ) : null}
            <Pressable
              onPress={() => confirmUnsave(item)}
              hitSlop={8}
              style={[styles.unsaveBtn, { borderColor: theme.line.DEFAULT }]}
            >
              <Text style={[typography.buttonSmall, { color: theme.textMuted }]}>
                {t.unsave}
              </Text>
            </Pressable>
          </View>
        }
        onPress={() => {
          if (item.card.slug) {
            router.push(`/(app)/public/${item.card.slug}` as never);
          }
        }}
      />
    );
  }

  return (
    <ScreenContainer padded={false} edges={['left', 'right', 'bottom']}>
      <AppBar variant="large" title={t.title} />

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
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <>
          {/* Search bar */}
          <View style={[styles.searchWrap, { borderBottomColor: theme.line.DEFAULT }]}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search contacts…"
              placeholderTextColor={theme.textFaint}
              style={[
                styles.searchInput,
                typography.body,
                {
                  color: theme.text,
                  backgroundColor: theme.surface,
                  borderColor: theme.line.firm,
                },
              ]}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(c) => c.id}
            renderItem={renderItem}
            ListEmptyComponent={
              items.length === 0 ? (
                <View style={styles.center}>
                  <Card variant="flat" style={styles.emptyCard}>
                    <View style={styles.emptyInner}>
                      <View style={[styles.emptyIconRing, { backgroundColor: theme.accentSoft }]}>
                        <Users size={40} color={accent} strokeWidth={1.5} />
                      </View>
                      <Text
                        style={[
                          typography.title2,
                          { color: theme.text, textAlign: 'center', marginTop: 16 },
                        ]}
                      >
                        {t.emptyHeadline}
                      </Text>
                      <Text
                        style={[
                          typography.bodySmall,
                          { color: theme.textMuted, textAlign: 'center', marginTop: 6, marginBottom: 20 },
                        ]}
                      >
                        {t.emptySubline}
                      </Text>
                      {isAuthenticated ? (
                        <Button
                          label={t.seedCta}
                          variant="accent"
                          loading={seeding}
                          onPress={() => void handleSeedSamples()}
                          style={{ minWidth: 200 }}
                        />
                      ) : null}
                    </View>
                  </Card>
                </View>
              ) : (
                <View style={styles.center}>
                  <Text style={[typography.bodySmall, { color: theme.textMuted }]}>
                    No results for "{search}"
                  </Text>
                </View>
              )
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => void load('refresh')}
                tintColor={accent}
              />
            }
            contentContainerStyle={
              filtered.length === 0
                ? { flex: 1 }
                : styles.listContent
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  searchWrap: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 360,
  },
  emptyInner: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 20,
  },
  rowTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unsaveBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
