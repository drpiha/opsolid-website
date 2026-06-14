import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  QrCode,
  Star,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Mail,
  Phone,
  Globe,
  MapPin,
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
import { accent, accentCredit, accentSoft } from '../../../src/lib/theme/tokens';
import { typography } from '../../../src/lib/theme/typography';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { useAuthStore } from '../../../src/lib/auth/store';
import { useContactsRefreshStore } from '../../../src/store/contactsRefreshStore';
import { API_BASE } from '../../../src/lib/api/client';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { Chip } from '../../../src/components/ui/Chip';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Row, RowGroup } from '../../../src/components/ui/Row';
import { SectionLabel } from '../../../src/components/ui/SectionLabel';
import { AppBar, AppBarIconButton } from '../../../src/components/ui/AppBar';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { QrCodeModal } from '../../../src/components/cards/QrCodeModal';
import { LeadFormModal } from '../../../src/components/cards/LeadFormModal';
import {
  FeedbackModal,
  FeedbackBreakdownModal,
} from '../../../src/components/cards/FeedbackModal';

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
  const router = useRouter();

  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = !!authUser;

  // Card data
  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Save-to-server state
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Save-to-contacts loading guard
  const [contactSaving, setContactSaving] = useState(false);

  // Modal open state
  const [qrOpen, setQrOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  // CRM data
  const [feedbackAggregate, setFeedbackAggregate] = useState<FeedbackAggregate | null>(null);
  const [ownPublishedCard, setOwnPublishedCard] = useState<ApiCard | null>(null);
  const [exchanging, setExchanging] = useState(false);

  // Card data fetch
  useEffect(() => {
    if (!slug) return;
    void loadCard(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Feedback aggregate prefetch
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    void getFeedbackAggregate(slug)
      .then((agg) => { if (!cancelled) setFeedbackAggregate(agg); })
      .catch(() => { if (!cancelled) setFeedbackAggregate(null); });
    return () => { cancelled = true; };
  }, [slug]);

  // Visitor's own published card — for smart exchange
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
      const result = await saveCardToDeviceContacts(card);
      if (result === 'saved') {
        Alert.alert('', t.contactsSaved);
      } else if (result === 'denied') {
        Alert.alert('', t.contactsDenied);
      } else if (result === 'failed') {
        Alert.alert('', t.errorLoad);
      }
    } finally {
      setContactSaving(false);
    }
  }

  async function handleShare() {
    if (!slug) return;
    if (card?.id && isAuthenticated) {
      void logShareEvent(card.id, 'native_share').catch(() => {});
    }
    try {
      await Share.share({ url: `${API_BASE}/c/${slug}` });
    } catch {
      // user cancelled or error
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

  // Derived booleans
  const isOwnCard = !!ownPublishedCard?.slug && ownPublishedCard.slug === card?.slug;
  const showSmartExchange = !!ownPublishedCard?.slug && !isOwnCard;
  const showFeedbackButton =
    isAuthenticated && !isOwnCard && feedbackAggregate?.enabled === true;
  const aggregateAverage =
    feedbackAggregate && feedbackAggregate.count > 0
      ? aggregateMean(feedbackAggregate.averages)
      : null;

  // Derived card fields
  const cardData = card ? (card.cardData as Record<string, unknown>) : null;
  const cardName = pickString(cardData?.name) ?? '';
  const cardTitle = pickString(cardData?.title) ?? '';
  const cardCompany = pickString(cardData?.company) ?? '';
  const cardBio = pickString(cardData?.bio) ?? '';
  const cardEmail = pickString(cardData?.email) ?? '';
  const cardPhone = pickString(cardData?.phone) ?? '';
  const cardWebsite = pickString(cardData?.website) ?? '';
  const cardCity = pickString(cardData?.city) ?? pickString(cardData?.location) ?? '';
  const cardIndustry = pickString(cardData?.industry) ?? '';
  const cardPhotoUrl = pickString(cardData?.photoUrl) ?? pickString(cardData?.avatarUrl) ?? '';
  const roleDisplay = [cardTitle, cardCompany].filter(Boolean).join(' · ');

  // Loading state
  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: theme.pageBg }]}>
        <Stack.Screen options={{ headerShown: false }} />
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
      </View>
    );
  }

  // Error / 404 state
  if (error || !card) {
    return (
      <View style={[styles.root, { backgroundColor: theme.pageBg }]}>
        <Stack.Screen options={{ headerShown: false }} />
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
          <Card variant="flat" style={styles.notFoundCard}>
            <Text style={[typography.title2, { color: theme.text, textAlign: 'center' }]}>
              Card not found
            </Text>
            <Text
              style={[
                typography.body,
                { color: theme.textMuted, textAlign: 'center', marginTop: 8 },
              ]}
            >
              {error ?? t.errorLoad}
            </Text>
            <Button
              label={t.retry}
              onPress={() => slug && void loadCard(slug)}
              variant="secondary"
              style={{ marginTop: 20 }}
            />
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.pageBg }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* AppBar — minimal chrome */}
      <AppBar
        variant="default"
        title=""
        leading={
          <AppBarIconButton ghost onPress={() => router.back()} accessibilityLabel="Back">
            <ChevronLeft size={20} color={theme.text} />
          </AppBarIconButton>
        }
        trailing={
          <View style={styles.appBarTrailing}>
            {card.slug ? (
              <AppBarIconButton
                ghost
                onPress={() => {
                  if (card?.id && isAuthenticated) {
                    void logShareEvent(card.id, 'qr').catch(() => {});
                  }
                  setQrOpen(true);
                }}
                accessibilityLabel={t.qrTitle}
              >
                <QrCode size={20} color={theme.text} />
              </AppBarIconButton>
            ) : null}
            <AppBarIconButton
              ghost
              onPress={() => void toggleSave()}
              accessibilityLabel={saved ? 'Unsave' : 'Save'}
            >
              {saving ? (
                <ActivityIndicator size="small" color={accent} />
              ) : saved ? (
                <BookmarkCheck size={20} color={accent} />
              ) : (
                <Bookmark size={20} color={theme.text} />
              )}
            </AppBarIconButton>
            <AppBarIconButton
              ghost
              onPress={() => void handleShare()}
              accessibilityLabel="Share"
            >
              <Share2 size={20} color={theme.text} />
            </AppBarIconButton>
          </View>
        }
      />

      {/* Scrollable card content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero card */}
        <Card variant="glow" padded={24} style={styles.heroCard}>
          <View style={styles.heroRow}>
            <Avatar
              name={cardName || undefined}
              imageUri={cardPhotoUrl || undefined}
              size={80}
              shape="circle"
            />
            {(cardIndustry || cardCity) ? (
              <View style={styles.heroBadges}>
                {cardIndustry ? (
                  <Chip
                    label={cardIndustry}
                    variant="accent"
                    leadingIcon={<Globe size={12} color={accent} />}
                  />
                ) : null}
                {cardCity ? (
                  <Chip
                    label={cardCity}
                    variant="default"
                    leadingIcon={<MapPin size={12} color={theme.textMuted} />}
                  />
                ) : null}
              </View>
            ) : null}
          </View>

          <Text style={[typography.display2, { color: theme.text, marginTop: 16 }]}>
            {cardName}
          </Text>

          {roleDisplay ? (
            <Text style={[typography.lead, { color: theme.textSecondary, marginTop: 4 }]}>
              {roleDisplay}
            </Text>
          ) : null}

          {/* "by OpSolid" credit */}
          <Text style={[typography.caption, styles.creditLine, { color: theme.textFaint }]}>
            powered by{' '}
            <Text style={{ color: accentCredit, fontStyle: 'italic' }}>OpSo Smart</Text>
          </Text>
        </Card>

        {/* Bio */}
        {cardBio ? (
          <View style={styles.section}>
            <SectionLabel style={styles.eyebrow}>ABOUT</SectionLabel>
            <Text style={[typography.body, { color: theme.textSecondary }]}>
              {cardBio}
            </Text>
          </View>
        ) : null}

        {/* Contact actions */}
        <View style={styles.section}>
          <Button
            label={contactSaving ? '…' : t.saveToContacts}
            onPress={() => void handleSaveToContacts()}
            variant="accent"
            disabled={contactSaving}
            style={{ marginBottom: 8 }}
          />
          {showSmartExchange ? (
            <Button
              label={exchanging ? '…' : tCrm.exchange.cta}
              onPress={() => void handleSmartExchange()}
              variant="secondary"
              disabled={exchanging}
            />
          ) : null}
        </View>

        {/* Contact methods */}
        {(cardEmail || cardPhone || cardWebsite) ? (
          <View style={styles.section}>
            <SectionLabel style={styles.eyebrow}>CONTACT</SectionLabel>
            <RowGroup>
              {cardEmail ? (
                <Row
                  title={cardEmail}
                  subtitle="Email"
                  divider={false}
                  leading={
                    <View style={[styles.rowIcon, { backgroundColor: accentSoft }]}>
                      <Mail size={15} color={accent} />
                    </View>
                  }
                  chevron
                />
              ) : null}
              {cardPhone ? (
                <Row
                  title={cardPhone}
                  subtitle="Phone"
                  divider={!!cardEmail}
                  leading={
                    <View style={[styles.rowIcon, { backgroundColor: accentSoft }]}>
                      <Phone size={15} color={accent} />
                    </View>
                  }
                  chevron
                />
              ) : null}
              {cardWebsite ? (
                <Row
                  title={cardWebsite}
                  subtitle="Website"
                  divider={!!(cardEmail || cardPhone)}
                  leading={
                    <View style={[styles.rowIcon, { backgroundColor: accentSoft }]}>
                      <Globe size={15} color={accent} />
                    </View>
                  }
                  chevron
                />
              ) : null}
            </RowGroup>
          </View>
        ) : null}

        {/* QR / Feedback action row */}
        {(card.slug || showFeedbackButton || !isOwnCard) ? (
          <View style={styles.section}>
            <SectionLabel style={styles.eyebrow}>ACTIONS</SectionLabel>
            <View style={styles.actionRow}>
              {card.slug ? (
                <Pressable
                  onPress={() => {
                    if (card?.id && isAuthenticated) {
                      void logShareEvent(card.id, 'qr').catch(() => {});
                    }
                    setQrOpen(true);
                  }}
                  style={styles.actionTile}
                  accessibilityLabel={t.qrTitle}
                >
                  <View style={[styles.actionIconWrap, { backgroundColor: theme.surfaceMuted }]}>
                    <QrCode size={20} color={theme.text} />
                  </View>
                  <Text style={[typography.caption, { color: theme.textMuted }]} numberOfLines={1}>
                    {t.qrTitle}
                  </Text>
                </Pressable>
              ) : null}

              {!isOwnCard ? (
                <Pressable
                  onPress={() => setLeadOpen(true)}
                  style={styles.actionTile}
                  accessibilityLabel={tCrm.lead.cta}
                >
                  <View style={[styles.actionIconWrap, { backgroundColor: theme.surfaceMuted }]}>
                    <MessageSquare size={20} color={theme.text} />
                  </View>
                  <Text style={[typography.caption, { color: theme.textMuted }]} numberOfLines={1}>
                    {tCrm.lead.cta}
                  </Text>
                </Pressable>
              ) : null}

              {showFeedbackButton ? (
                <Pressable
                  onPress={() => {
                    if (aggregateAverage !== null && feedbackAggregate && feedbackAggregate.count > 0) {
                      setBreakdownOpen(true);
                    } else {
                      setFeedbackOpen(true);
                    }
                  }}
                  style={styles.actionTile}
                  accessibilityLabel={tCrm.feedback.cta}
                >
                  <View style={[styles.actionIconWrap, { backgroundColor: theme.surfaceMuted }]}>
                    <Star size={20} color={theme.text} />
                  </View>
                  <Text style={[typography.caption, { color: theme.textMuted }]} numberOfLines={1}>
                    {tCrm.feedback.cta}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

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

// Fire-and-forget referral store helper — kept for parity.
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
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundCard: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  appBarTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Hero card
  heroCard: {
    marginBottom: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  creditLine: {
    marginTop: 16,
  },

  // Section layout
  section: {
    marginTop: 20,
  },
  eyebrow: {
    marginBottom: 10,
  },

  // Contact row icon
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Action tile strip
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionTile: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomSpacer: {
    height: 16,
  },
});
