// -----------------------------------------------------------------------
// Inbox Thread / Connection Detail — Verso v2 refactor.
//
// M5: layout, stub UI, connection hero card, notes, tags, activity,
//     message section (UI only — composer present).
// M6: wire to /api/v1/connections/[id]/messages (GET + POST).
//
// Polling: 5s foreground interval via useFocusEffect. Stops on blur.
// Optimistic: append on send → re-fetch on settle.
// -----------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
} from 'expo-router';
import {
  ChevronLeft,
  MoreVertical,
  Plus,
} from 'lucide-react-native';
import {
  listMessages,
  sendMessage,
} from '../../../src/lib/api/messages';
import type {
  ChatMessage,
  ChatOtherParty,
  ChatPendingAction,
} from '../../../src/lib/api/messages';
import { resolveAction } from '../../../src/lib/api/inbox';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { accent } from '../../../src/lib/theme/tokens';
import { typography } from '../../../src/lib/theme/typography';
import {
  useTranslations,
  detectLocale,
  type Locale,
} from '../../../src/lib/i18n/locale';
import { API_BASE } from '../../../src/lib/api/client';
import { useAuthStore } from '../../../src/lib/auth/store';
import { AppBar, AppBarIconButton } from '../../../src/components/ui/AppBar';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { Chip } from '../../../src/components/ui/Chip';
import { Input } from '../../../src/components/ui/Input';
import { Row, RowGroup } from '../../../src/components/ui/Row';
import { SectionLabel } from '../../../src/components/ui/SectionLabel';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';

const FOREGROUND_POLL_INTERVAL_MS = 5_000;
const MAX_BODY_LEN = 2000;

export default function InboxThreadScreen() {
  const { connectionId } = useLocalSearchParams<{ connectionId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).inbox;
  const me = useAuthStore((s) => s.user);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [other, setOther] = useState<ChatOtherParty | null>(null);
  const [pending, setPending] = useState<ChatPendingAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState<'accepted' | 'declined' | null>(null);
  const [draft, setDraft] = useState('');
  // Notes state (UI only — hook into updateNote API when wired)
  const [note, setNote] = useState('');
  const [noteDirty, setNoteDirty] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  // Tags state
  const [tags, setTags] = useState<string[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  const typeLabel = useCallback(
    (type: string): string => {
      const map: Record<string, string> = {
        request_contact: t.types.request_contact,
        request_quote: t.types.request_quote,
        request_meeting: t.types.request_meeting,
        send_card: t.types.send_card,
        ask_collaboration: t.types.ask_collaboration,
        give_feedback: t.types.give_feedback,
      };
      return map[type] ?? type;
    },
    [t.types],
  );

  const fetchOnce = useCallback(
    async (mode: 'initial' | 'silent') => {
      if (!connectionId) return;
      if (mode === 'initial') setLoading(true);
      try {
        const res = await listMessages(connectionId);
        setMessages(res.messages);
        setOther(res.other);
        setPending(res.pendingAction);
        setError(null);
      } catch {
        if (mode === 'initial') setError(t.errorLoad);
      } finally {
        if (mode === 'initial') setLoading(false);
      }
    },
    [connectionId, t.errorLoad],
  );

  useEffect(() => {
    void fetchOnce('initial');
  }, [fetchOnce]);

  useFocusEffect(
    useCallback(() => {
      const id = setInterval(() => {
        void fetchOnce('silent');
      }, FOREGROUND_POLL_INTERVAL_MS);
      return () => clearInterval(id);
    }, [fetchOnce]),
  );

  useEffect(() => {
    if (messages.length === 0) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  async function onSend() {
    const trimmed = draft.trim();
    if (!trimmed || !connectionId || !me) return;
    if (trimmed.length > MAX_BODY_LEN) return;

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticRow: ChatMessage = {
      id: optimisticId,
      senderUserId: me.id,
      body: trimmed,
      sentAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimisticRow]);
    setDraft('');
    setSending(true);

    try {
      await sendMessage(connectionId, trimmed);
      // M6: wire to /api/v1/connections/[id]/messages
      await fetchOnce('silent');
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setDraft(trimmed);
      Alert.alert('', t.thread.errorSend);
    } finally {
      setSending(false);
    }
  }

  async function onResolve(status: 'accepted' | 'declined') {
    if (!pending) return;
    setResolving(status);
    try {
      await resolveAction(pending.id, status);
      setPending(null);
    } catch {
      Alert.alert('', t.errorLoad);
    } finally {
      setResolving(null);
    }
  }

  async function onSaveNote() {
    if (!noteDirty) return;
    setSavingNote(true);
    // API call signature preserved — updateNote hook goes here when wired
    try {
      // await updateNote(connectionId, note);
      setNoteDirty(false);
    } catch {
      Alert.alert('', t.errorLoad);
    } finally {
      setSavingNote(false);
    }
  }

  const formatStamp = useMemo(() => makeStampFormatter(locale), [locale]);

  const otherName = other?.name ?? other?.slug ?? '—';
  const otherSubtitle = [other?.title, other?.company].filter(Boolean).join(' · ');
  const resolvedPhotoUri = other?.photoPath
    ? other.photoPath.startsWith('http')
      ? other.photoPath
      : `${API_BASE}${other.photoPath}`
    : undefined;

  // Derive connection date from first message or now
  const connectedDate = useMemo(() => {
    if (messages.length > 0) {
      return new Date(messages[0].sentAt).toLocaleDateString();
    }
    return new Date().toLocaleDateString();
  }, [messages]);

  // Derive chip variant from pending action status
  function statusChipVariant(): 'success' | 'accent' | 'outline' {
    if (!pending) return 'success';
    if (pending.type === 'request_contact') return 'accent';
    return 'outline';
  }

  function openOptions() {
    Alert.alert('Options', 'Archive or mute — coming in M6');
  }

  if (loading) {
    return (
      <ScreenContainer padded={false} edges={['left', 'right', 'bottom']}>
        <AppBar
          variant="default"
          title=""
          leading={
            <AppBarIconButton ghost onPress={() => router.back()} accessibilityLabel="Back">
              <ChevronLeft size={20} color={theme.text} />
            </AppBarIconButton>
          }
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer padded={false} edges={['left', 'right', 'bottom']}>
        <AppBar
          variant="default"
          title=""
          leading={
            <AppBarIconButton ghost onPress={() => router.back()} accessibilityLabel="Back">
              <ChevronLeft size={20} color={theme.text} />
            </AppBarIconButton>
          }
        />
        <View style={styles.center}>
          <Text style={[typography.body, { color: theme.signalErr, textAlign: 'center' }]}>
            {error}
          </Text>
          <Button
            label={t.retry}
            onPress={() => void fetchOnce('initial')}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.pageBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      {/* Top chrome */}
      <AppBar
        variant="default"
        title={otherName}
        leading={
          <AppBarIconButton ghost onPress={() => router.back()} accessibilityLabel="Back">
            <ChevronLeft size={20} color={theme.text} />
          </AppBarIconButton>
        }
        trailing={
          <AppBarIconButton ghost onPress={openOptions} accessibilityLabel="Options">
            <MoreVertical size={20} color={theme.text} />
          </AppBarIconButton>
        }
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* Connection hero card */}
        <Card variant="elevated" style={styles.heroCard}>
          <View style={styles.heroInner}>
            <Avatar
              name={otherName}
              imageUri={resolvedPhotoUri}
              size={64}
              shape="circle"
            />
            <View style={styles.heroBody}>
              <Text style={[typography.title1, { color: theme.text }]} numberOfLines={1}>
                {otherName}
              </Text>
              {otherSubtitle ? (
                <Text style={[typography.lead, { color: theme.textSecondary, marginTop: 4 }]} numberOfLines={2}>
                  {otherSubtitle}
                </Text>
              ) : null}
              {/* Connection source chip */}
              {pending ? (
                <View style={{ marginTop: 10 }}>
                  <Chip
                    label={typeLabel(pending.type)}
                    variant={statusChipVariant()}
                  />
                </View>
              ) : null}
            </View>
          </View>

          {/* Status row */}
          <View style={[styles.statusRow, { borderTopColor: theme.line.DEFAULT }]}>
            {pending ? (
              <>
                <Chip label={typeLabel(pending.type)} variant="accent" />
                <View style={styles.resolveActions}>
                  <Button
                    label={t.declineCta}
                    size="sm"
                    variant="ghost"
                    fullWidth={false}
                    disabled={resolving !== null}
                    loading={resolving === 'declined'}
                    onPress={() => void onResolve('declined')}
                  />
                  <Button
                    label={t.acceptCta}
                    size="sm"
                    variant="accent"
                    fullWidth={false}
                    disabled={resolving !== null}
                    loading={resolving === 'accepted'}
                    onPress={() => void onResolve('accepted')}
                  />
                </View>
              </>
            ) : (
              <Chip label="Connected" variant="success" dot="live" />
            )}
          </View>
        </Card>

        {/* Notes section */}
        <View style={styles.section}>
          <SectionLabel>{t.notesLabel}</SectionLabel>
          <Input
            placeholder="Add a note…"
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={(v) => {
              setNote(v);
              setNoteDirty(true);
            }}
            style={styles.notesInput}
            autoCapitalize="sentences"
          />
          {noteDirty ? (
            <Button
              label="Save note"
              size="sm"
              variant="secondary"
              fullWidth={false}
              loading={savingNote}
              onPress={() => void onSaveNote()}
              style={{ alignSelf: 'flex-end', marginTop: 6 }}
            />
          ) : null}
        </View>

        {/* Tags row — always shown; "+" chip lets users add the first tag. */}
        <View style={styles.section}>
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} variant="outline" />
            ))}
            <Chip
              label="+"
              variant="outline"
              onPress={() => {
                Alert.prompt?.('Add tag', '', (text) => {
                  if (text && text.trim()) {
                    setTags((prev) => [...prev, text.trim()]);
                  }
                });
              }}
              leadingIcon={<Plus size={12} color={theme.textSecondary} />}
            />
          </View>
        </View>

        {/* Activity timeline */}
        <View style={styles.section}>
          <SectionLabel>{t.activityLabel}</SectionLabel>
          <RowGroup>
            <Row
              divider={false}
              title={t.connectedOn.replace('{date}', connectedDate)}
            />
          </RowGroup>
        </View>

        {/* Messages section — M6 wires real GET/POST */}
        <View style={styles.section}>
          <SectionLabel>{t.messagesLabel}</SectionLabel>
          {/* M6: wire to /api/v1/connections/[id]/messages */}
          <Card variant="flat" padded={false} style={styles.messagesCard}>
            {/* Message list */}
            <FlatList
              data={messages}
              keyExtractor={(m) => m.id}
              scrollEnabled={false}
              contentContainerStyle={styles.messageList}
              ListEmptyComponent={
                <View style={styles.emptyThread}>
                  <Text style={[typography.bodySmall, { color: theme.textMuted, textAlign: 'center' }]}>
                    {t.empty_thread.title}
                  </Text>
                  <Text style={[typography.caption, { color: theme.textFaint, textAlign: 'center', marginTop: 4 }]}>
                    {t.empty_thread.body}
                  </Text>
                </View>
              }
              renderItem={({ item: m, index: i }) => {
                const mine = me ? m.senderUserId === me.id : false;
                const stamp = formatStamp(m.sentAt);
                const prev = i > 0 ? messages[i - 1] : null;
                const showStamp =
                  !prev ||
                  new Date(m.sentAt).getTime() - new Date(prev.sentAt).getTime() > 15 * 60 * 1000;
                return (
                  <View key={m.id} style={styles.bubbleRow}>
                    {showStamp ? (
                      <Text style={[typography.caption, { color: theme.textFaint, textAlign: 'center', marginVertical: 4 }]}>
                        {stamp}
                      </Text>
                    ) : null}
                    <View
                      style={[
                        styles.bubble,
                        mine
                          ? [styles.bubbleMine, { backgroundColor: accent }]
                          : [styles.bubbleTheirs, { backgroundColor: theme.surfaceMuted }],
                      ]}
                    >
                      <Text
                        style={[
                          typography.body,
                          mine ? { color: '#FFFFFF' } : { color: theme.text },
                        ]}
                      >
                        {m.body}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />

            {/* Composer */}
            <View style={[styles.composer, { borderTopColor: theme.line.DEFAULT }]}>
              <Input
                value={draft}
                onChangeText={setDraft}
                placeholder={t.messagePlaceholder}
                multiline
                maxLength={MAX_BODY_LEN}
                style={styles.composerInput}
                autoCapitalize="sentences"
                containerStyle={styles.composerInputContainer}
              />
              <Button
                label={t.sendCta}
                size="sm"
                variant="accent"
                fullWidth={false}
                disabled={sending || draft.trim().length === 0}
                loading={sending}
                onPress={() => void onSend()}
              />
            </View>
          </Card>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStampFormatter(locale: Locale) {
  const tag =
    locale === 'de'
      ? 'de-DE'
      : locale === 'tr'
      ? 'tr-TR'
      : locale === 'es'
      ? 'es-ES'
      : locale === 'it'
      ? 'it-IT'
      : locale === 'fr'
      ? 'fr-FR'
      : locale === 'ar'
      ? 'ar'
      : 'en-GB';
  const time = new Intl.DateTimeFormat(tag, { hour: 'numeric', minute: '2-digit' });
  const dayTime = new Intl.DateTimeFormat(tag, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
  return (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    return sameDay ? time.format(d) : dayTime.format(d);
  };
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 24,
  },
  heroCard: {
    gap: 0,
    padding: 0,
    overflow: 'hidden',
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
  },
  heroBody: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  resolveActions: {
    flexDirection: 'row',
    gap: 6,
  },
  section: {
    gap: 10,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  messagesCard: {
    overflow: 'hidden',
  },
  messageList: {
    padding: 12,
    gap: 4,
    minHeight: 80,
  },
  emptyThread: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bubbleRow: {
    width: '100%',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginVertical: 1,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  composerInputContainer: {
    flex: 1,
  },
  composerInput: {
    minHeight: 36,
    maxHeight: 100,
  },
});
