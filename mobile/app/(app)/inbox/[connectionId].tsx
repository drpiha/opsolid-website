// -----------------------------------------------------------------------
// Sprint F4 — Inbox messaging thread view.
//
// Header:  the OTHER side's avatar + name + (optional) request type pill
//          with accept / decline buttons when a pending action is attached
//          to this connection and the requester is its receiver.
// Body:    scrollable messages list. Sent messages right-aligned in teal
//          bubbles, received messages left-aligned in bg[2] bubbles.
//          Timestamp shows short time, plus weekday when not today.
// Footer:  TextInput + send button inside a KeyboardAvoidingView.
//
// Polling: refetches every 15s while mounted so the receiver sees new
// inbound messages without push notifications (deferred). Cleanly stops
// on unmount via clearInterval. Optimistic append on send → re-fetch on
// settle so server-derived ids/timestamps replace the optimistic row.
// -----------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Stack,
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
} from 'expo-router';
import { Send } from 'lucide-react-native';
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
import { copper, signal, teal } from '../../../src/lib/theme/tokens';
import {
  useTranslations,
  detectLocale,
  type Locale,
} from '../../../src/lib/i18n/locale';
import { API_BASE } from '../../../src/lib/api/client';
import { useAuthStore } from '../../../src/lib/auth/store';

// M4 — foreground polling drops to 5s while the screen is active; push
// notifications cover the gap when the screen is unfocused or backgrounded.
// `useFocusEffect` starts the interval on focus and clears on blur, so an
// inbox thread parked behind another tab incurs zero polling cost.
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
  const [resolving, setResolving] = useState<'accepted' | 'declined' | null>(
    null,
  );
  const [draft, setDraft] = useState('');

  const scrollRef = useRef<ScrollView>(null);

  // Type-label map mirrors the inbox row labels.
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

  // M4 — Polling now uses `useFocusEffect`. While the screen is focused we
  // tick at 5s; on blur we tear the interval down completely so a backgrounded
  // tab incurs no network cost. Push notifications cover the unfocused gap.
  useFocusEffect(
    useCallback(() => {
      const id = setInterval(() => {
        void fetchOnce('silent');
      }, FOREGROUND_POLL_INTERVAL_MS);
      return () => clearInterval(id);
    }, [fetchOnce]),
  );

  // Auto-scroll to bottom when message count grows.
  useEffect(() => {
    if (messages.length === 0) return;
    // Defer to next tick so the layout pass completes first.
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  async function onSend() {
    const trimmed = draft.trim();
    if (!trimmed || !connectionId || !me) return;
    if (trimmed.length > MAX_BODY_LEN) return;

    // Optimistic append. Replace the row on settle from `fetchOnce`. The
    // optimistic id is namespaced with `optimistic-` so a server message
    // never collides.
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
      // Refetch so we replace the optimistic row with the canonical one.
      await fetchOnce('silent');
    } catch {
      // Roll back the optimistic row, restore the draft.
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

  const formatStamp = useMemo(
    () => makeStampFormatter(locale),
    [locale],
  );

  const otherName = other?.name ?? other?.slug ?? '—';
  const otherSubtitle = [other?.title, other?.company]
    .filter(Boolean)
    .join(' · ');
  const photoUri = other?.photoPath
    ? other.photoPath.startsWith('http')
      ? other.photoPath
      : `${API_BASE}${other.photoPath}`
    : null;

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <ActivityIndicator size="large" color={copper[500]} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <Text style={[styles.errorText, { color: '#B8514B' }]}>{error}</Text>
        <Pressable
          onPress={() => void fetchOnce('initial')}
          style={[styles.retryBtn, { backgroundColor: copper[500] }]}
        >
          <Text style={styles.retryBtnText}>{t.retry}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.bg[0] }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <Stack.Screen options={{ title: otherName, headerBackTitle: ' ' }} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.bg[1],
            borderBottomColor: theme.line.DEFAULT,
          },
        ]}
      >
        <Pressable
          style={styles.headerLeft}
          onPress={() => {
            if (other?.slug) {
              router.push(`/(app)/public/${other.slug}` as never);
            }
          }}
        >
          <View style={[styles.avatar, { backgroundColor: theme.bg[2] }]}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImg} />
            ) : (
              <Text
                style={[styles.avatarInitial, { color: theme.ink[300] }]}
              >
                {otherName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.headerBody}>
            <Text
              style={[styles.headerName, { color: theme.ink[100] }]}
              numberOfLines={1}
            >
              {otherName}
            </Text>
            {otherSubtitle ? (
              <Text
                style={[styles.headerSub, { color: theme.ink[400] }]}
                numberOfLines={1}
              >
                {otherSubtitle}
              </Text>
            ) : null}
          </View>
        </Pressable>

        {/* Pending request pill — only when a pending CardAction is attached
            and the user is its receiver. Resolving here closes the pill. */}
        {pending ? (
          <View style={styles.pendingRow}>
            <View
              style={[
                styles.pendingPill,
                {
                  backgroundColor: theme.bg[2],
                  borderColor: theme.line.DEFAULT,
                },
              ]}
            >
              <Text style={[styles.pendingType, { color: copper[600] }]}>
                {typeLabel(pending.type)}
              </Text>
            </View>
            <View style={styles.pendingActions}>
              <Pressable
                onPress={() => void onResolve('declined')}
                disabled={resolving !== null}
                style={[
                  styles.actionBtn,
                  styles.declineBtn,
                  { borderColor: theme.line.DEFAULT },
                ]}
              >
                {resolving === 'declined' ? (
                  <ActivityIndicator size="small" color={theme.ink[400]} />
                ) : (
                  <Text
                    style={[styles.actionBtnText, { color: theme.ink[300] }]}
                  >
                    {t.decline}
                  </Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => void onResolve('accepted')}
                disabled={resolving !== null}
                style={[styles.actionBtn, styles.acceptBtn]}
              >
                {resolving === 'accepted' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.actionBtnText, { color: '#fff' }]}>
                    {t.accept}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>

      {/* Body — messages list */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
      >
        {messages.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyTitle, { color: theme.ink[100] }]}>
              {t.empty_thread.title}
            </Text>
            <Text style={[styles.emptyBody, { color: theme.ink[300] }]}>
              {t.empty_thread.body}
            </Text>
          </View>
        ) : (
          messages.map((m, i) => {
            const mine = me ? m.senderUserId === me.id : false;
            const stamp = formatStamp(m.sentAt);
            // Show the timestamp only when there's a meaningful gap (>15 min)
            // from the previous message, OR on the very first message. Keeps
            // the scroll lean when bursts come in.
            const prev = i > 0 ? messages[i - 1] : null;
            const showStamp =
              !prev ||
              new Date(m.sentAt).getTime() -
                new Date(prev.sentAt).getTime() >
                15 * 60 * 1000;
            return (
              <View key={m.id} style={styles.bubbleRow}>
                {showStamp ? (
                  <Text
                    style={[styles.stamp, { color: theme.ink[400] }]}
                  >
                    {stamp}
                  </Text>
                ) : null}
                <View
                  style={[
                    styles.bubble,
                    mine
                      ? [styles.bubbleMine, { backgroundColor: teal[500] }]
                      : [
                          styles.bubbleTheirs,
                          { backgroundColor: theme.bg[2] },
                        ],
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      mine
                        ? styles.bubbleTextMine
                        : { color: theme.ink[100] },
                    ]}
                  >
                    {m.body}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Footer — composer */}
      <View
        style={[
          styles.composer,
          {
            backgroundColor: theme.bg[1],
            borderTopColor: theme.line.DEFAULT,
          },
        ]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={t.thread.placeholder}
          placeholderTextColor={theme.ink[400]}
          multiline
          maxLength={MAX_BODY_LEN}
          style={[
            styles.input,
            {
              color: theme.ink[100],
              backgroundColor: theme.bg[0],
              borderColor: theme.line.DEFAULT,
            },
          ]}
        />
        <Pressable
          onPress={() => void onSend()}
          disabled={sending || draft.trim().length === 0}
          style={[
            styles.sendBtn,
            {
              backgroundColor:
                sending || draft.trim().length === 0
                  ? theme.bg[2]
                  : teal[500],
            },
          ]}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={18} color="#fff" />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

/**
 * Build a per-locale "short time, plus weekday when not today" formatter.
 * Cached at the call site via useMemo so we don't re-instantiate two
 * Intl.DateTimeFormat instances on every render.
 */
function makeStampFormatter(locale: Locale) {
  // Mapping to the Intl-recognized BCP-47 codes the device supports.
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
  const time = new Intl.DateTimeFormat(tag, {
    hour: 'numeric',
    minute: '2-digit',
  });
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

// Suppress unused-import warning when signal isn't referenced (kept around in
// case the screen later surfaces accepted/declined visual states).
void signal;

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: { fontSize: 16, textAlign: 'center' },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryBtnText: { color: '#fff', fontWeight: '600' },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { fontSize: 17, fontWeight: '600' },
  headerBody: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '600' },
  headerSub: { fontSize: 12, marginTop: 2 },

  pendingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pendingPill: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pendingType: { fontSize: 12, fontWeight: '500' },
  pendingActions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: { borderWidth: StyleSheet.hairlineWidth },
  acceptBtn: { backgroundColor: copper[500] },
  actionBtnText: { fontSize: 12, fontWeight: '600' },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 12, gap: 6 },
  emptyWrap: { alignItems: 'center', paddingTop: 64, paddingHorizontal: 24 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyBody: { fontSize: 13, textAlign: 'center', lineHeight: 18 },

  bubbleRow: { width: '100%' },
  stamp: {
    fontSize: 11,
    textAlign: 'center',
    marginVertical: 6,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginVertical: 2,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 19 },
  bubbleTextMine: { color: '#FFFFFF' },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
