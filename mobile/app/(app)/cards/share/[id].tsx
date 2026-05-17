import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Clipboard,
  Share,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Link,
  Share2,
  Smartphone,
  Wallet,
} from 'lucide-react-native';
import { ScreenContainer } from '../../../../src/components/ui/ScreenContainer';
import { Card } from '../../../../src/components/ui/Card';
import { Row, RowGroup } from '../../../../src/components/ui/Row';
import { SectionLabel } from '../../../../src/components/ui/SectionLabel';
import { AppBar, AppBarIconButton } from '../../../../src/components/ui/AppBar';
import { useToast } from '../../../../src/components/ui/Toast';
import { getCard } from '../../../../src/lib/api/cards';
import { logShareEvent, getShareSummary } from '../../../../src/lib/api/share-events';
import type { ApiCard } from '../../../../src/lib/api/types';
import type { ShareSummary } from '../../../../src/lib/api/share-events';
import { API_BASE } from '../../../../src/lib/api/client';
import { useTheme } from '../../../../src/lib/theme/ThemeProvider';
import { accent, accentSoft } from '../../../../src/lib/theme/tokens';
import { typography } from '../../../../src/lib/theme/typography';
import { useTranslations, detectLocale } from '../../../../src/lib/i18n/locale';

const QR_SIZE = 220;

export default function ShareCenterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const tAll = useTranslations(detectLocale());
  const t = tAll.share;
  const { showToast } = useToast();

  const [card, setCard] = useState<ApiCard | null>(null);
  const [loadingCard, setLoadingCard] = useState(true);
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState(false);
  const [summary, setSummary] = useState<ShareSummary | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoadingCard(true);
    try {
      const c = await getCard(id);
      setCard(c);
    } finally {
      setLoadingCard(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
    void getShareSummary()
      .then(setSummary)
      .catch(() => {
        // analytics are best-effort; non-fatal
      });
  }, [load]);

  const slug = card?.slug ?? '';
  const publicUrl = `${API_BASE}/c/${slug}`;
  const qrUrl = `${API_BASE}/api/qr/${slug}?format=png&logo=1`;

  const handleCopyLink = useCallback(() => {
    if (!slug) return;
    Clipboard.setString(publicUrl);
    showToast({ message: t.copied, variant: 'success' });
    void logShareEvent(id ?? '', 'link').catch(() => {});
  }, [slug, publicUrl, t.copied, showToast, id]);

  const handleNativeShare = useCallback(async () => {
    if (!slug) return;
    try {
      await Share.share({ url: publicUrl, message: publicUrl });
      void logShareEvent(id ?? '', 'native_share').catch(() => {});
    } catch {
      // User cancelled — non-fatal.
    }
  }, [slug, publicUrl, id]);

  const handleNfcTap = useCallback(() => {
    showToast({ message: t.nfcComingSoon, variant: 'success' });
  }, [t.nfcComingSoon, showToast]);

  const handleWallet = useCallback(() => {
    showToast({ message: t.walletComingSoon, variant: 'success' });
  }, [t.walletComingSoon, showToast]);

  // Compute recent share rows from summary (total per-channel breakdown)
  const shareRows: Array<{ label: string; count: number }> = summary
    ? Object.entries(summary.totals)
        .filter(([, count]) => count > 0)
        .map(([channel, count]) => ({ label: channelLabel(channel), count }))
    : [];

  return (
    <ScreenContainer padded={false} edges={['bottom']}>
      <AppBar
        variant="default"
        title={t.title}
        leading={
          <AppBarIconButton ghost onPress={() => router.back()}>
            <ChevronLeft size={20} color={theme.text} />
          </AppBarIconButton>
        }
      />

      <View
        style={[styles.scrollWrap, { backgroundColor: theme.pageBg }]}
      >
        {/* Hero QR card */}
        <Card variant="elevated" padded={24} style={styles.qrCard}>
          {loadingCard || !slug ? (
            <View style={styles.qrPlaceholder}>
              <ActivityIndicator color={accent} />
            </View>
          ) : (
            <View style={styles.qrCenter}>
              <View style={styles.qrWrap}>
                {qrLoading && !qrError ? (
                  <View style={styles.qrLoader}>
                    <ActivityIndicator color={accent} />
                  </View>
                ) : null}
                {!qrError ? (
                  <Image
                    source={{ uri: qrUrl }}
                    style={styles.qrImage}
                    onLoadEnd={() => setQrLoading(false)}
                    onError={() => {
                      setQrLoading(false);
                      setQrError(true);
                    }}
                  />
                ) : (
                  <View style={styles.qrLoader}>
                    <Text style={[typography.caption, { color: theme.signalErr }]}>
                      QR unavailable
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[typography.mono, { color: theme.textSecondary, marginTop: 14 }]}
                numberOfLines={1}
              >
                opsolid.de/c/{slug}
              </Text>
              <Text style={[typography.caption, { color: theme.textFaint, marginTop: 2 }]}>
                Tap QR to enlarge
              </Text>
            </View>
          )}
        </Card>

        {/* Action grid 2x2 */}
        <View style={styles.grid}>
          <ActionTile
            icon={<Link size={20} color={accent} />}
            title={t.copyLink}
            subtitle="opsolid.de/c/..."
            onPress={handleCopyLink}
            theme={theme}
            accentSoftColor={accentSoft}
          />
          <ActionTile
            icon={<Share2 size={20} color={accent} />}
            title={t.nativeShare}
            subtitle="iOS / Android"
            onPress={() => void handleNativeShare()}
            theme={theme}
            accentSoftColor={accentSoft}
          />
          <ActionTile
            icon={<Smartphone size={20} color={theme.textMuted} />}
            title={t.nfcTap}
            subtitle="Phase 6+"
            onPress={handleNfcTap}
            theme={theme}
            accentSoftColor={theme.surfaceMuted}
            muted
          />
          <ActionTile
            icon={<Wallet size={20} color={theme.textMuted} />}
            title={t.wallet}
            subtitle="Phase 6+"
            onPress={handleWallet}
            theme={theme}
            accentSoftColor={theme.surfaceMuted}
            muted
          />
        </View>

        {/* Recent shares */}
        <SectionLabel style={styles.sectionLabel}>{t.recentShares}</SectionLabel>
        <RowGroup>
          {shareRows.length === 0 ? (
            <Row
              title={t.noShares}
              subtitle={t.noSharesHint}
              divider={false}
            />
          ) : (
            shareRows.map((row, idx) => (
              <Row
                key={row.label}
                title={`${row.count} ${row.count === 1 ? 'share' : 'shares'} via ${row.label}`}
                subtitle="30-day total"
                divider={idx > 0}
              />
            ))
          )}
        </RowGroup>
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Action tile sub-component (local — not exported)
// ---------------------------------------------------------------------------

type TileProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
  accentSoftColor: string;
  muted?: boolean;
};

function ActionTile({ icon, title, subtitle, onPress, theme, accentSoftColor, muted }: TileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed, styles.tilePressable]}
    >
      <View
        style={[
          styles.tile,
          {
            backgroundColor: theme.surface,
            borderColor: theme.line.DEFAULT,
          },
        ]}
      >
        <View
          style={[
            styles.tileIconWrap,
            { backgroundColor: accentSoftColor },
          ]}
        >
          {icon}
        </View>
        <Text
          style={[
            typography.bodyMedium,
            { color: muted ? theme.textSecondary : theme.text, marginTop: 10 },
          ]}
        >
          {title}
        </Text>
        <Text style={[typography.caption, { color: theme.textFaint, marginTop: 2 }]}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function channelLabel(channel: string): string {
  switch (channel) {
    case 'qr':          return 'QR code';
    case 'link':        return 'link';
    case 'nfc':         return 'NFC';
    case 'native_share': return 'native share';
    default:            return channel;
  }
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scrollWrap: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  qrCard: {
    alignItems: 'center',
  },
  qrCenter: {
    alignItems: 'center',
    width: '100%',
  },
  qrPlaceholder: {
    height: QR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  qrWrap: {
    width: QR_SIZE,
    height: QR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: QR_SIZE,
    height: QR_SIZE,
    resizeMode: 'contain',
  },
  qrLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tilePressable: {
    width: '47.5%',
  },
  tile: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  tileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    marginTop: 4,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.75,
  },
});
