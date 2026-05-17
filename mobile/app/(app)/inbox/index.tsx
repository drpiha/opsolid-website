import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Mail,
  UserPlus,
  FileText,
  Calendar,
  Send,
  Users,
  MessageSquare,
  Mailbox,
} from 'lucide-react-native';
import { listInbox, resolveAction } from '../../../src/lib/api/inbox';
import type { InboxItem, InboxActionStatus } from '../../../src/lib/api/inbox';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { accent } from '../../../src/lib/theme/tokens';
import { typography } from '../../../src/lib/theme/typography';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { API_BASE } from '../../../src/lib/api/client';
import { Button } from '../../../src/components/ui/Button';
import { AppBar } from '../../../src/components/ui/AppBar';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Chip } from '../../../src/components/ui/Chip';
import { Row, RowGroup } from '../../../src/components/ui/Row';
import { SectionLabel } from '../../../src/components/ui/SectionLabel';
import { Card } from '../../../src/components/ui/Card';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';

type Filter = 'pending' | 'accepted' | 'all';

export default function InboxScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).inbox;

  const [filter] = useState<Filter>('all');
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

  async function handleResolve(id: string, status: 'accepted' | 'declined') {
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

  function typeIcon(type: string, color: string) {
    const size = 18;
    switch (type) {
      case 'request_contact':
        return <UserPlus size={size} color={color} />;
      case 'request_quote':
        return <FileText size={size} color={color} />;
      case 'request_meeting':
        return <Calendar size={size} color={color} />;
      case 'send_card':
        return <Send size={size} color={color} />;
      case 'ask_collaboration':
        return <Users size={size} color={color} />;
      case 'give_feedback':
        return <MessageSquare size={size} color={color} />;
      default:
        return <Mailbox size={size} color={color} />;
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

  const pendingItems = items.filter((i) => i.status === 'pending');
  const mutualItems = items.filter(
    (i) => i.status === 'accepted' && i.connectionId,
  );
  // Event notifications are not yet wired; keep as empty section placeholder
  const eventItems: InboxItem[] = [];

  function photoUri(item: InboxItem): string | undefined {
    const path = item.sender.photoPath;
    if (!path) return undefined;
    return path.startsWith('http') ? path : `${API_BASE}${path}`;
  }

  function renderConnectionRequestRow(item: InboxItem) {
    const name = item.sender.name ?? item.sender.slug ?? '—';
    const isResolving = resolving === item.id;

    return (
      <Row
        key={item.id}
        divider={pendingItems.indexOf(item) > 0}
        title={name}
        subtitle={`${typeLabel(item.type)} · ${formatRelativeTime(item.createdAt)}`}
        leading={
          <Avatar
            name={name}
            imageUri={photoUri(item)}
            size={36}
            shape="circle"
          />
        }
        trailing={
          <View style={styles.requestActions}>
            <Button
              label={t.declineCta}
              size="sm"
              variant="ghost"
              fullWidth={false}
              disabled={isResolving}
              loading={isResolving && resolving === item.id}
              onPress={() => void handleResolve(item.id, 'declined')}
            />
            <Button
              label={t.acceptCta}
              size="sm"
              variant="accent"
              fullWidth={false}
              disabled={isResolving}
              loading={isResolving && resolving === item.id}
              onPress={() => void handleResolve(item.id, 'accepted')}
            />
          </View>
        }
        onPress={() => {
          if (item.connectionId) {
            router.push(`/(app)/inbox/${item.connectionId}` as never);
          } else if (item.sender.slug) {
            router.push(`/(app)/public/${item.sender.slug}` as never);
          }
        }}
      />
    );
  }

  function renderMutualSaveRow(item: InboxItem) {
    const name = item.sender.name ?? item.sender.slug ?? '—';

    return (
      <Row
        key={item.id}
        divider={mutualItems.indexOf(item) > 0}
        title={name}
        subtitle={t.types.send_card}
        leading={
          <Avatar
            name={name}
            imageUri={photoUri(item)}
            size={36}
            shape="circle"
          />
        }
        trailing={
          <Chip
            label={t.viewCta}
            variant="accent"
            onPress={() => {
              if (item.connectionId) {
                router.push(`/(app)/inbox/${item.connectionId}` as never);
              } else if (item.sender.slug) {
                router.push(`/(app)/public/${item.sender.slug}` as never);
              }
            }}
          />
        }
        onPress={() => {
          if (item.connectionId) {
            router.push(`/(app)/inbox/${item.connectionId}` as never);
          } else if (item.sender.slug) {
            router.push(`/(app)/public/${item.sender.slug}` as never);
          }
        }}
      />
    );
  }

  function renderContent() {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={[typography.body, { color: theme.signalErr, textAlign: 'center' }]}>
            {error}
          </Text>
          <Button
            label={t.retry}
            onPress={() => void load('initial', filter)}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      );
    }

    if (items.length === 0) {
      return (
        <View style={styles.emptyWrap}>
          <Card variant="flat" style={styles.emptyCard}>
            <View style={styles.emptyInner}>
              <View style={[styles.emptyIconRing, { backgroundColor: theme.accentSoft }]}>
                <Mail size={40} color={accent} strokeWidth={1.5} />
              </View>
              <Text style={[typography.title2, { color: theme.text, textAlign: 'center', marginTop: 16 }]}>
                {t.emptyTitle}
              </Text>
              <Text style={[typography.bodySmall, { color: theme.textMuted, textAlign: 'center', marginTop: 6 }]}>
                {t.emptyHintCard}
              </Text>
            </View>
          </Card>
        </View>
      );
    }

    return (
      <FlatList
        data={[{ key: 'content' }]}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <View style={styles.sections}>
            {/* CONNECTION REQUESTS */}
            {pendingItems.length > 0 ? (
              <View style={styles.section}>
                <SectionLabel style={styles.sectionLabelSpacing}>
                  {t.connectionRequestsLabel}
                </SectionLabel>
                <RowGroup>
                  {pendingItems.map(renderConnectionRequestRow)}
                </RowGroup>
              </View>
            ) : null}

            {/* MUTUAL SAVES */}
            {mutualItems.length > 0 ? (
              <View style={styles.section}>
                <SectionLabel style={styles.sectionLabelSpacing}>
                  {t.mutualSavesLabel}
                </SectionLabel>
                <RowGroup>
                  {mutualItems.map(renderMutualSaveRow)}
                </RowGroup>
              </View>
            ) : null}

            {/* EVENT NOTIFICATIONS */}
            <View style={styles.section}>
              <SectionLabel style={styles.sectionLabelSpacing}>
                {t.eventNotificationsLabel}
              </SectionLabel>
              {eventItems.length === 0 ? (
                <RowGroup>
                  <Row
                    divider={false}
                    title="No event activity"
                    subtitle="Event invitations will appear here"
                    leading={
                      <Calendar size={20} color={theme.textFaint} />
                    }
                  />
                </RowGroup>
              ) : null}
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void load('refresh', filter)}
            tintColor={accent}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <ScreenContainer padded={false} edges={['left', 'right', 'bottom']}>
      <AppBar
        variant="large"
        title={t.title}
        subtitle={t.subtitle}
      />
      {renderContent()}
    </ScreenContainer>
  );
}

/** Minimal relative time without a dependency */
function formatRelativeTime(iso: string | undefined | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyCard: {
    alignItems: 'center',
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
    flexGrow: 1,
    paddingBottom: 20,
  },
  sections: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionLabelSpacing: {
    paddingHorizontal: 4,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 6,
  },
});
