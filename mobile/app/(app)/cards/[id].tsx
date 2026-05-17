import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  MoreVertical,
  CheckCircle,
  Share2,
  X,
  Eye,
  Bookmark,
  Users,
} from 'lucide-react-native';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { Chip } from '../../../src/components/ui/Chip';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Row, RowGroup } from '../../../src/components/ui/Row';
import { SectionLabel } from '../../../src/components/ui/SectionLabel';
import { AppBar, AppBarIconButton } from '../../../src/components/ui/AppBar';
import { QrCodeModal } from '../../../src/components/cards/QrCodeModal';
import { getCard, deleteCard } from '../../../src/lib/api/cards';
import type { ApiCard } from '../../../src/lib/api/types';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { accent, accentCredit } from '../../../src/lib/theme/tokens';
import { typography } from '../../../src/lib/theme/typography';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { useFirstRunStore } from '../../../src/store/firstRunStore';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const tAll = useTranslations(detectLocale());
  const t = tAll.cards;
  const tCardLive = tAll.cardLive;

  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  // M7 Wave 2 — first-publish celebration banner.
  const [showCelebration, setShowCelebration] = useState(() =>
    useFirstRunStore.getState().pendingCelebration,
  );
  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    useFirstRunStore.getState().markPendingCelebration(false);
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const c = await getCard(id);
      setCard(c);
    } catch {
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  }, [id, t.errorLoad]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = () => {
    if (!card) return;
    const body = t.deleteConfirmBody.replace('{slug}', card.slug ?? card.id);
    Alert.alert(t.deleteConfirm, body, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteCard(card.id);
            router.back();
          } catch {
            Alert.alert(t.errorLoad);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <ScreenContainer padded={false}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !card) {
    return (
      <ScreenContainer padded={false}>
        <AppBar
          variant="default"
          title=""
          leading={
            <AppBarIconButton ghost onPress={() => router.back()}>
              <ChevronLeft size={20} color={theme.text} />
            </AppBarIconButton>
          }
        />
        <View style={styles.center}>
          <Text style={{ color: theme.signalErr }}>{error ?? t.errorLoad}</Text>
          <Button
            label={t.retry}
            onPress={() => void load()}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      </ScreenContainer>
    );
  }

  const contactName =
    (card.cardData?.name as string | undefined) ??
    card.slug ??
    card.id.slice(0, 8);
  const jobTitle = (card.cardData?.title as string | undefined) ?? '';
  const company = (card.cardData?.company as string | undefined) ?? '';
  const email = (card.cardData?.email as string | undefined) ?? '';
  const phone = (card.cardData?.phone as string | undefined) ?? '';
  const website = (card.cardData?.website as string | undefined) ?? '';
  const bio = (card.cardData?.bio as string | undefined) ?? '';
  const industry = (card.cardData?.industry as string | undefined) ?? '';
  const city = (card.cardData?.city as string | undefined) ?? '';
  const photoPath = (card.cardData?.photoPath as string | undefined) ?? undefined;

  const roleSubtitle = [jobTitle, company].filter(Boolean).join(' · ');
  const isPublished = card.status === 'PUBLISHED';

  return (
    <ScreenContainer padded={false}>
      {/* Top chrome */}
      <AppBar
        variant="default"
        title=""
        leading={
          <AppBarIconButton ghost onPress={() => router.back()}>
            <ChevronLeft size={20} color={theme.text} />
          </AppBarIconButton>
        }
        trailing={
          <AppBarIconButton ghost onPress={() => setQrOpen(true)}>
            <MoreVertical size={20} color={theme.text} />
          </AppBarIconButton>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { backgroundColor: theme.pageBg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* M7 Wave 2 — first-publish celebration */}
        {showCelebration ? (
          <View
            style={[
              styles.celebration,
              {
                backgroundColor: theme.accentSoft,
                borderColor: accent + '40',
              },
            ]}
          >
            <View style={[styles.celebrationIcon, { backgroundColor: accent }]}>
              <CheckCircle size={22} color="#FFFFFF" />
            </View>
            <View style={styles.celebrationText}>
              <Text style={[typography.bodyMedium, { color: theme.text }]}>
                {tCardLive.title}
              </Text>
              <Text style={[typography.bodySmall, { color: theme.textMuted, marginTop: 2 }]}>
                {tCardLive.body}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                dismissCelebration();
                router.push(`/(app)/cards/share/${card.id}` as never);
              }}
              style={styles.celebrationBtn}
              accessibilityLabel="Share"
            >
              <Share2 size={18} color={accent} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={dismissCelebration}
              style={styles.celebrationBtn}
              accessibilityLabel="Dismiss"
            >
              <X size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Hero card */}
        <Card variant="glow" padded={20} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Avatar
              name={contactName}
              imageUri={photoPath}
              size={64}
              shape="square"
            />
            <View style={styles.heroInfo}>
              <Text style={[typography.display2, { color: theme.text }]}>
                {contactName}
              </Text>
              {!!roleSubtitle && (
                <Text style={[typography.lead, { color: theme.textSecondary, marginTop: 2 }]}>
                  {roleSubtitle}
                </Text>
              )}
            </View>
          </View>

          {/* Chips row */}
          <View style={styles.chipsRow}>
            {!!industry && (
              <Chip label={industry} variant="accent" />
            )}
            {!!city && (
              <Chip label={city} variant="default" />
            )}
            {isPublished && (
              <Chip label="Live" variant="success" dot="live" />
            )}
          </View>

          {/* by OpSolid credit */}
          <Text style={[typography.caption, { color: accentCredit, fontStyle: 'italic', marginTop: 12 }]}>
            by OpSolid
          </Text>
        </Card>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <Card variant="flat" padded={12} style={styles.statTile}>
            <Eye size={16} color={theme.textMuted} />
            <Text style={[typography.title1, { color: theme.text, marginTop: 6 }]}>—</Text>
            <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>Views</Text>
            <Text style={[typography.caption, { color: theme.textFaint }]}>last 30 days</Text>
          </Card>
          <Card variant="flat" padded={12} style={styles.statTile}>
            <Bookmark size={16} color={theme.textMuted} />
            <Text style={[typography.title1, { color: theme.text, marginTop: 6 }]}>—</Text>
            <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>Saves</Text>
          </Card>
          <Card variant="flat" padded={12} style={styles.statTile}>
            <Users size={16} color={theme.textMuted} />
            <Text style={[typography.title1, { color: theme.text, marginTop: 6 }]}>—</Text>
            <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>Connections</Text>
          </Card>
        </View>

        {/* Primary actions */}
        <View style={styles.actions}>
          <Button
            label={t.share ?? 'Share card'}
            onPress={() => router.push(`/(app)/cards/share/${card.id}` as never)}
            variant="accent"
          />
          <Button
            label={t.edit}
            onPress={() => router.push(`/(app)/cards/edit/${card.id}` as never)}
            variant="secondary"
            style={{ marginTop: 12 }}
          />
        </View>

        {/* About section */}
        {!!bio && (
          <View style={styles.section}>
            <SectionLabel style={styles.sectionLabelSpacing}>ABOUT</SectionLabel>
            <Text style={[typography.body, { color: theme.text }]}>{bio}</Text>
          </View>
        )}

        {/* Contact section */}
        {(!!email || !!phone || !!website || !!card.slug) && (
          <View style={styles.section}>
            <SectionLabel style={styles.sectionLabelSpacing}>CONTACT</SectionLabel>
            <RowGroup>
              {!!email && (
                <Row
                  title={email}
                  subtitle="Email"
                  divider={false}
                />
              )}
              {!!phone && (
                <Row
                  title={phone}
                  subtitle="Phone"
                  divider={!!email}
                />
              )}
              {!!website && (
                <Row
                  title={website}
                  subtitle={tAll.publicCard.website}
                  divider={!!(email || phone)}
                />
              )}
              {!!card.slug && (
                <Row
                  title={`opsolid.de/c/${card.slug}`}
                  subtitle="URL"
                  divider={!!(email || phone || website)}
                />
              )}
            </RowGroup>
          </View>
        )}

        {/* Delete action */}
        <Button
          label={t.delete}
          onPress={handleDelete}
          variant="ghost"
          loading={deleting}
          style={styles.deleteBtn}
        />
      </ScrollView>

      {card.slug ? (
        <QrCodeModal
          visible={qrOpen}
          slug={card.slug}
          onClose={() => setQrOpen(false)}
        />
      ) : null}
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
  scroll: {
    padding: 16,
    paddingBottom: 48,
    gap: 16,
  },
  heroCard: {
    gap: 0,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 14,
  },
  heroInfo: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    alignItems: 'flex-start',
  },
  actions: {
    gap: 0,
  },
  section: {
    gap: 0,
  },
  sectionLabelSpacing: {
    marginBottom: 10,
  },
  deleteBtn: {
    marginTop: 8,
  },
  celebration: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  celebrationIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationText: {
    flex: 1,
  },
  celebrationBtn: {
    padding: 6,
  },
});
