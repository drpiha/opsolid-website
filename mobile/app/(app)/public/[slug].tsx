import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  UserPlus,
  QrCode,
  Send,
  Star,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react-native';
import { getPublicCard } from '../../../src/lib/api/discover';
import { listCards } from '../../../src/lib/api/cards';
import { saveCard, unsaveCard, checkSaved } from '../../../src/lib/api/contacts';
import { saveCardToDeviceContacts } from '../../../src/lib/contacts/native';
import { sendCardExchange, getFeedbackAggregate } from '../../../src/lib/api/crm';
import type { FeedbackAggregate } from '../../../src/lib/api/crm';
import { logShareEvent } from '../../../src/lib/api/share-events';
import type { ApiCard } from '../../../src/lib/api/types';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { useAuthStore } from '../../../src/lib/auth/store';
import { useContactsRefreshStore } from '../../../src/store/contactsRefreshStore';
import { API_BASE } from '../../../src/lib/api/client';
import { Button } from '../../../src/components/ui/Button';
import { QrCodeModal } from '../../../src/components/cards/QrCodeModal';
import { LeadFormModal } from '../../../src/components/cards/LeadFormModal';
import {
  FeedbackModal,
  FeedbackBreakdownModal,
} from '../../../src/components/cards/FeedbackModal';

// JS injected before content load — hides the "Create your own card" banner
// and any bottom-floater CTAs that the web page renders for anonymous visitors.
// The ?preview=1 param is the server-side gate; this is a belt-and-suspenders
// client-side guard for anything rendered after hydration.
const HIDE_WEB_CHROME_JS = `
  (function() {
    var style = document.createElement('style');
    style.textContent = '[data-create-yours-banner]{display:none!important}[data-preview-hide]{display:none!important}';
    document.head.appendChild(style);
  })();
  true;
`;

function pickString(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

// Average all category averages into a single score rounded to 1 decimal.
function aggregateMean(averages: Record<string, number>): number {
  const vals = Object.values(averages).filter((v) => typeof v === 'number' && v > 0);
  if (vals.length === 0) return 0;
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(m * 10) / 10;
}

export default function PublicCardScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).publicCard;
  const tCrm = useTranslations(locale).crm;

  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = !!authUser;
  const router = useRouter();

  // Card data — fetched for the native action row. The WebView handles the
  // visual render independently; we need the ApiCard object for save-to-
  // contacts, smart exchange, and to determine own-card state.
  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebView load state — independent of the card data fetch.
  const [webLoading, setWebLoading] = useState(true);
  const [webError, setWebError] = useState(false);

  // Save-to-server state (Bookmark toggle in header).
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Save-to-contacts loading guard so the button shows a spinner on tap.
  const [contactSaving, setContactSaving] = useState(false);

  // Modal open state.
  const [qrOpen, setQrOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  // CRM data.
  const [feedbackAggregate, setFeedbackAggregate] = useState<FeedbackAggregate | null>(null);
  const [ownPublishedCard, setOwnPublishedCard] = useState<ApiCard | null>(null);
  const [exchanging, setExchanging] = useState(false);

  const webViewRef = useRef<InstanceType<typeof WebView>>(null);

  // Card data fetch.
  useEffect(() => {
    if (!slug) return;
    void loadCard(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Feedback aggregate prefetch.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    void getFeedbackAggregate(slug)
      .then((agg) => { if (!cancelled) setFeedbackAggregate(agg); })
      .catch(() => { if (!cancelled) setFeedbackAggregate(null); });
    return () => { cancelled = true; };
  }, [slug]);

  // Visitor's own published card — for smart exchange.
  useEffect(() => {
    if (!isAuthenticated) { setOwnPublishedCard(null); return; }
    let cancelled = false;
    void listCards({ limit: 20 })
      .then((res) => {
        if (cancelled) return;
        const published = res.items.find((c) => c.status === 'PUBLISHED' && !!c.slug);
        setOwnPublishedCard(published ?? null);
      })
      .catch(() => { if (!cancelled) setOwnPublishedCard(null); });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  async function loadCard(s: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicCard(s);
      setCard(res.card);
      try {
        const saveStatus = await checkSaved(s);
        setSaved(saveStatus.saved);
      } catch {
        // Own card or unauthenticated — ignore.
      }
    } catch {
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSave() {
    if (!slug || !card) return;
    setSaving(true);
    try {
      if (saved) {
        await unsaveCard(slug);
        setSaved(false);
        useContactsRefreshStore.getState().markDirty();
      } else {
        await saveCard(slug);
        setSaved(true);
        useContactsRefreshStore.getState().markDirty();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('cannot_save_own_card')) {
        Alert.alert('', t.errorLoad);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveToContacts() {
    if (!card || contactSaving) return;
    setContactSaving(true);
    try {
      // saveCardToDeviceContacts already requests permission internally.
      const result = await saveCardToDeviceContacts(card);
      if (result === 'saved') {
        Alert.alert('', t.contactsSaved);
      } else if (result === 'denied') {
        Alert.alert('', t.contactsDenied);
      } else if (result === 'failed') {
        Alert.alert('', t.errorLoad);
      }
      // 'unsupported' — silently skip (no Contacts API on this platform).
    } finally {
      setContactSaving(false);
    }
  }

  async function handleSmartExchange() {
    if (!slug || !ownPublishedCard?.slug || exchanging) return;
    const ownName =
      pickString((ownPublishedCard.cardData as Record<string, unknown>)?.name) ??
      ownPublishedCard.slug;
    Alert.alert(
      tCrm.exchange.confirmTitle,
      tCrm.exchange.confirmBody.replace('{name}', ownName),
      [
        { text: tCrm.exchange.cancel, style: 'cancel' },
        {
          text: tCrm.exchange.confirmSend,
          onPress: () => {
            setExchanging(true);
            void sendCardExchange(slug, { visitorSlug: ownPublishedCard.slug! })
              .then(() => { Alert.alert('', tCrm.exchange.success); })
              .catch((err) => {
                const msg = err instanceof Error ? err.message : '';
                Alert.alert(
                  '',
                  msg.includes('existing') ? tCrm.exchange.existing : tCrm.exchange.error,
                );
              })
              .finally(() => setExchanging(false));
          },
        },
      ],
    );
  }

  // Derived booleans — need card to be loaded.
  const isOwnCard = !!ownPublishedCard?.slug && ownPublishedCard.slug === card?.slug;
  const showSmartExchange = !!ownPublishedCard?.slug && !isOwnCard;
  const showFeedbackButton =
    isAuthenticated && !isOwnCard && feedbackAggregate?.enabled === true;
  const aggregateAverage =
    feedbackAggregate && feedbackAggregate.count > 0
      ? aggregateMean(feedbackAggregate.averages)
      : null;
  const cardName =
    card ? (pickString((card.cardData as Record<string, unknown>)?.name) ?? slug ?? '') : '';

  // Loading — card data not yet available.
  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={copper[500]} />
        </View>
      </View>
    );
  }

  // Card fetch error.
  if (error || !card) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.signalErr }]}>{error ?? t.errorLoad}</Text>
          <Button
            label={t.retry}
            onPress={() => slug && void loadCard(slug)}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  // Card URL with preview flag so the web page suppresses its own CTAs.
  const cardUrl = `${API_BASE}/c/${slug}?preview=1`;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen
        options={{
          title: cardName,
          headerRight: () => (
            <View style={styles.headerActions}>
              {card.slug ? (
                <Pressable
                  onPress={() => {
                    if (card?.id && isAuthenticated) {
                      void logShareEvent(card.id, 'qr').catch(() => {});
                    }
                    setQrOpen(true);
                  }}
                  style={styles.headerBtn}
                  hitSlop={8}
                >
                  <QrCode size={22} color={copper[500]} />
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => void toggleSave()}
                disabled={saving}
                style={styles.headerBtn}
                hitSlop={8}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={copper[500]} />
                ) : saved ? (
                  <BookmarkCheck size={22} color={copper[500]} />
                ) : (
                  <Bookmark size={22} color={copper[500]} />
                )}
              </Pressable>
            </View>
          ),
        }}
      />

      {/* WebView — authoritative web render (same as /c/[slug] in the browser) */}
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: cardUrl }}
          style={styles.webView}
          // Viewport meta is already set on the web page; scalesPageToFit
          // would override it and shrink the layout on Android.
          scalesPageToFit={false}
          originWhitelist={['https://*']}
          decelerationRate="normal"
          bounces={false}
          // Suppress the "Create your own card" banner and any floaters that
          // the public page mounts post-hydration (belt-and-suspenders on top
          // of ?preview=1 which the server uses to skip the banner server-side).
          injectedJavaScriptBeforeContentLoaded={HIDE_WEB_CHROME_JS}
          // Pull-to-refresh would be confusing inside the action sheet; off.
          pullToRefreshEnabled={false}
          // Hardware back should navigate the app stack, not the WebView
          // history (the card page is single-page, so this is moot, but
          // being explicit prevents edge-case back-stack issues).
          onShouldStartLoadWithRequest={(req: WebViewNavigation) => {
            // Allow the initial card load and same-origin requests only.
            return req.url.startsWith(API_BASE) || req.url === cardUrl;
          }}
          onLoadStart={() => setWebLoading(true)}
          onLoadEnd={() => setWebLoading(false)}
          onError={() => {
            setWebLoading(false);
            setWebError(true);
          }}
        />

        {/* Spinner overlay while WebView is loading */}
        {webLoading ? (
          <View style={styles.webLoadingOverlay}>
            <ActivityIndicator size="large" color={copper[500]} />
          </View>
        ) : null}

        {/* WebView error state */}
        {webError && !webLoading ? (
          <View style={styles.webErrorOverlay}>
            <Text style={[styles.errorText, { color: theme.signalErr }]}>
              {t.errorLoad}
            </Text>
            <Button
              label={t.retry}
              onPress={() => {
                setWebError(false);
                setWebLoading(true);
                webViewRef.current?.reload();
              }}
              variant="secondary"
              style={{ marginTop: 16 }}
            />
          </View>
        ) : null}
      </View>

      {/* Native action row — app-exclusive primitives the web can't provide */}
      <View
        style={[
          styles.actionBar,
          {
            backgroundColor: theme.bg[1],
            borderTopColor: theme.line.DEFAULT,
          },
        ]}
      >
        {/* Save to device contacts (Fix 1.4) */}
        <Pressable
          onPress={() => void handleSaveToContacts()}
          disabled={contactSaving}
          style={styles.actionItem}
          accessibilityLabel={t.saveToContacts}
        >
          {contactSaving ? (
            <ActivityIndicator size="small" color="#0D9488" />
          ) : (
            <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(13,148,136,0.12)' }]}>
              <UserPlus size={20} color="#0D9488" />
            </View>
          )}
          <Text style={[styles.actionLabel, { color: theme.ink[200] }]} numberOfLines={1}>
            {t.saveToContacts}
          </Text>
        </Pressable>

        {/* QR code */}
        {card.slug ? (
          <Pressable
            onPress={() => {
              if (card?.id && isAuthenticated) {
                void logShareEvent(card.id, 'qr').catch(() => {});
              }
              setQrOpen(true);
            }}
            style={styles.actionItem}
            accessibilityLabel={t.qrTitle}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: theme.bg[2] }]}>
              <QrCode size={20} color={copper[500]} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.ink[200] }]} numberOfLines={1}>
              {t.qrTitle}
            </Text>
          </Pressable>
        ) : null}

        {/* Send my info (Lead form) — open to all visitors */}
        {!isOwnCard ? (
          <Pressable
            onPress={() => setLeadOpen(true)}
            style={styles.actionItem}
            accessibilityLabel={tCrm.lead.cta}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: theme.bg[2] }]}>
              <MessageSquare size={20} color={copper[500]} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.ink[200] }]} numberOfLines={1}>
              {tCrm.lead.cta}
            </Text>
          </Pressable>
        ) : null}

        {/* Smart Exchange — only when visitor has own published card */}
        {showSmartExchange ? (
          <Pressable
            onPress={() => void handleSmartExchange()}
            disabled={exchanging}
            style={styles.actionItem}
            accessibilityLabel={tCrm.exchange.cta}
          >
            {exchanging ? (
              <ActivityIndicator size="small" color={copper[500]} />
            ) : (
              <View style={[styles.actionIconWrap, { backgroundColor: theme.bg[2] }]}>
                <Send size={20} color={copper[500]} />
              </View>
            )}
            <Text style={[styles.actionLabel, { color: theme.ink[200] }]} numberOfLines={1}>
              {tCrm.exchange.cta}
            </Text>
          </Pressable>
        ) : null}

        {/* Feedback — logged-in, not own card, feedback enabled */}
        {showFeedbackButton ? (
          <Pressable
            onPress={() => {
              if (aggregateAverage !== null && feedbackAggregate && feedbackAggregate.count > 0) {
                setBreakdownOpen(true);
              } else {
                setFeedbackOpen(true);
              }
            }}
            style={styles.actionItem}
            accessibilityLabel={tCrm.feedback.cta}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: theme.bg[2] }]}>
              <Star size={20} color={copper[500]} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.ink[200] }]} numberOfLines={1}>
              {tCrm.feedback.cta}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Modals */}
      {card.slug ? (
        <QrCodeModal
          visible={qrOpen}
          slug={card.slug}
          onClose={() => setQrOpen(false)}
        />
      ) : null}

      {card.slug ? (
        <LeadFormModal
          visible={leadOpen}
          slug={card.slug}
          onClose={() => setLeadOpen(false)}
          contactForm={
            (card.cardData as Record<string, unknown> | null)?.contactForm as
              | import('../../../src/lib/api/types').ContactFormConfig
              | undefined
          }
        />
      ) : null}

      {card.slug ? (
        <FeedbackModal
          visible={feedbackOpen}
          slug={card.slug}
          onClose={() => setFeedbackOpen(false)}
        />
      ) : null}

      {feedbackAggregate ? (
        <FeedbackBreakdownModal
          visible={breakdownOpen}
          averages={feedbackAggregate.averages}
          count={feedbackAggregate.count}
          onClose={() => setBreakdownOpen(false)}
        />
      ) : null}
    </View>
  );
}

// Fire-and-forget referral store helper — kept for parity, unused in WebView
// mode but preserved in case the unauthenticated floating CTA is re-added.
async function _usePendingReferralStoreSafe(slug: string | null): Promise<void> {
  if (!slug) return;
  try {
    const mod = await import('../../../src/store/pendingReferralStore');
    await mod.usePendingReferralStore.getState().setRef(slug);
  } catch {
    // ignore
  }
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: { fontSize: 16, textAlign: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerBtn: { paddingRight: 4 },

  // WebView takes most of the screen (flex:5 ≈ 83% when action bar is flex:1).
  webViewContainer: {
    flex: 5,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  webLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  webErrorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  // Native action bar — fixed strip at the bottom.
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    paddingHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    // flex: 1 gives it roughly 17% of the screen height when webViewContainer
    // is flex:5. This is fine for a compact icon-label strip.
    minHeight: 80,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
