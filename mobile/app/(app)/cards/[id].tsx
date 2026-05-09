import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, QrCode, Share2, X } from 'lucide-react-native';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { Button } from '../../../src/components/ui/Button';
import { QrCodeModal } from '../../../src/components/cards/QrCodeModal';
import { getCard, deleteCard } from '../../../src/lib/api/cards';
import type { ApiCard } from '../../../src/lib/api/types';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper, teal } from '../../../src/lib/theme/tokens';
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
  // The onboarding publish handler sets `pendingCelebration` on
  // firstRunStore right before navigating here. We snapshot it once on mount
  // so a second-by-second re-render of the store doesn't blink the banner;
  // dismissing it (via X, the share button, or simply navigating away)
  // clears the persisted flag.
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

  const handleOpenWeb = () => {
    if (!card?.slug) return;
    void Linking.openURL(`https://opsolid.de/c/${card.slug}`);
  };

  const handleShare = useCallback(async () => {
    if (!card?.slug) return;
    const url = `https://opsolid.de/c/${card.slug}`;
    try {
      await Share.share({ message: url, url });
    } catch {
      // User cancelled or platform refused — non-fatal.
    }
  }, [card?.slug]);

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
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={copper[500]} />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !card) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={{ color: '#B8514B' }}>{error ?? t.errorLoad}</Text>
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
  const title = (card.cardData?.title as string | undefined) ?? '';
  const company = (card.cardData?.company as string | undefined) ?? '';
  const email = (card.cardData?.email as string | undefined) ?? '';
  const phone = (card.cardData?.phone as string | undefined) ?? '';

  const canShowQr = !!card.slug && card.status === 'PUBLISHED';

  return (
    <>
      <Stack.Screen
        options={{
          title: t.detailTitle,
          headerBackTitle: t.title,
          headerRight: canShowQr
            ? () => (
                <Pressable
                  onPress={() => setQrOpen(true)}
                  style={styles.headerBtn}
                  hitSlop={8}
                >
                  <QrCode size={22} color={copper[500]} />
                </Pressable>
              )
            : undefined,
        }}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { backgroundColor: theme.bg[0] },
        ]}
      >
        {/* M7 Wave 2 — first-publish celebration. Renders once when the
            onboarding publish handler set pendingCelebration on the store.
            The share-icon button reuses the system share sheet (same URL the
            "Open on the web" button uses). The X dismisses without sharing. */}
        {showCelebration ? (
          <View
            style={[
              styles.celebration,
              {
                backgroundColor: teal[500] + '20',
                borderColor: teal[500],
              },
            ]}
          >
            <View style={styles.celebrationIcon}>
              <CheckCircle size={24} color="#FFFFFF" />
            </View>
            <View style={styles.celebrationText}>
              <Text style={[styles.celebrationTitle, { color: theme.ink[100] }]}>
                {tCardLive.title}
              </Text>
              <Text style={[styles.celebrationBody, { color: theme.ink[300] }]}>
                {tCardLive.body}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                void handleShare();
              }}
              style={styles.celebrationBtn}
              accessibilityLabel="Share"
            >
              <Share2 size={20} color={teal[600]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={dismissCelebration}
              style={styles.celebrationBtn}
              accessibilityLabel="Dismiss"
            >
              <X size={18} color={theme.ink[400]} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Hero card */}
        <View
          style={[
            styles.hero,
            { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          ]}
        >
          <Text style={[styles.heroName, { color: theme.ink[100] }]}>
            {contactName}
          </Text>
          {!!title && (
            <Text style={[styles.heroTitle, { color: theme.ink[300] }]}>
              {title}
            </Text>
          )}
          {!!company && (
            <Text style={[styles.heroCompany, { color: theme.ink[400] }]}>
              {company}
            </Text>
          )}
        </View>

        {/* Contact fields */}
        {!!email && (
          <View
            style={[
              styles.field,
              { borderColor: theme.line.DEFAULT },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              Email
            </Text>
            <Text style={[styles.fieldValue, { color: theme.ink[100] }]}>
              {email}
            </Text>
          </View>
        )}
        {!!phone && (
          <View
            style={[
              styles.field,
              { borderColor: theme.line.DEFAULT },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              Phone
            </Text>
            <Text style={[styles.fieldValue, { color: theme.ink[100] }]}>
              {phone}
            </Text>
          </View>
        )}
        {card.slug ? (
          <View
            style={[
              styles.field,
              { borderColor: theme.line.DEFAULT },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              URL
            </Text>
            <Text style={[styles.fieldValue, { color: theme.ink[100] }]}>
              opsolid.de/c/{card.slug}
            </Text>
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label={t.edit}
            onPress={() => router.push(`/(app)/cards/edit/${card.id}` as never)}
            variant="secondary"
          />
          {card.slug && card.status === 'PUBLISHED' ? (
            <Button
              label={t.openWeb}
              onPress={handleOpenWeb}
              variant="primary"
              style={{ marginTop: 12 }}
            />
          ) : null}
          <Button
            label={t.delete}
            onPress={handleDelete}
            variant="ghost"
            loading={deleting}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
      {canShowQr && card.slug ? (
        <QrCodeModal
          visible={qrOpen}
          slug={card.slug}
          onClose={() => setQrOpen(false)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: 16,
    paddingBottom: 48,
    gap: 12,
  },
  hero: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
    marginBottom: 4,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 14,
  },
  heroCompany: {
    fontSize: 13,
  },
  field: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 15,
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
  headerBtn: {
    paddingRight: 4,
  },
  celebration: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  celebrationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: teal[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationText: {
    flex: 1,
  },
  celebrationTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  celebrationBody: {
    fontSize: 13,
    marginTop: 2,
  },
  celebrationBtn: {
    padding: 8,
  },
});
