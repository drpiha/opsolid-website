// Verso v2 — Home dashboard (landing tab).
// Sections: AppBar large → primary card hero → quick actions → recent activity.

import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Share2,
  ScanLine,
  Plus,
  Eye,
  Heart,
  Send,
  House,
} from 'lucide-react-native';
import { useAuthStore } from '../../src/lib/auth/store';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { accent, accentSoft, radius, shadow } from '../../src/lib/theme/tokens';
import { typography } from '../../src/lib/theme/typography';
import { listCards } from '../../src/lib/api/cards';
import { getShareSummary } from '../../src/lib/api/share-events';
import type { ApiCard } from '../../src/lib/api/types';
import type { ShareSummary } from '../../src/lib/api/share-events';
import { AppBar } from '../../src/components/ui/AppBar';
import { Card } from '../../src/components/ui/Card';
import { Chip } from '../../src/components/ui/Chip';
import { Button } from '../../src/components/ui/Button';
import { Row, RowGroup } from '../../src/components/ui/Row';
import { SectionLabel } from '../../src/components/ui/SectionLabel';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { useToast } from '../../src/components/ui/Toast';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getDisplayName(card: ApiCard): string {
  const data = card.cardData as Record<string, unknown>;
  if (typeof data.name === 'string' && data.name.trim()) return data.name.trim();
  return 'Your card';
}

function getDisplayRole(card: ApiCard): string {
  const data = card.cardData as Record<string, unknown>;
  const parts: string[] = [];
  if (typeof data.title === 'string' && data.title.trim()) parts.push(data.title.trim());
  if (typeof data.company === 'string' && data.company.trim()) parts.push(data.company.trim());
  return parts.join(' · ');
}

// ---------------------------------------------------------------------------
// Activity items derived from ShareSummary
// ---------------------------------------------------------------------------

type ActivityItem = {
  key: string;
  icon: 'eye' | 'heart' | 'send';
  title: string;
  subtitle: string;
};

function buildActivityItems(summary: ShareSummary, updatedAt: string): ActivityItem[] {
  const items: ActivityItem[] = [];

  if (summary.totals.qr + summary.totals.link + summary.totals.nfc + summary.totals.native_share > 0) {
    items.push({
      key: 'total_shares',
      icon: 'send',
      title: `${summary.total} share${summary.total === 1 ? '' : 's'} in the last ${summary.days} days`,
      subtitle: timeAgo(updatedAt),
    });
  }

  if (summary.totals.qr > 0) {
    items.push({
      key: 'qr',
      icon: 'eye',
      title: `${summary.totals.qr} via QR code`,
      subtitle: timeAgo(updatedAt),
    });
  }

  if (summary.totals.native_share > 0) {
    items.push({
      key: 'native',
      icon: 'send',
      title: `${summary.totals.native_share} via native share`,
      subtitle: timeAgo(updatedAt),
    });
  }

  if (summary.totals.link > 0) {
    items.push({
      key: 'link',
      icon: 'heart',
      title: `${summary.totals.link} via direct link`,
      subtitle: timeAgo(updatedAt),
    });
  }

  return items.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CardHero({ card, onPress }: { card: ApiCard; onPress: () => void }) {
  const theme = useTheme();
  const name = getDisplayName(card);
  const role = getDisplayRole(card);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Open card ${name}`}
    >
      <Card variant="elevated" padded={20}>
        <View style={styles.cardHeroRow}>
          {/* Avatar placeholder */}
          <View
            style={[
              styles.heroAvatar,
              { backgroundColor: accentSoft },
            ]}
          >
            <House size={22} color={accent} />
          </View>
          <View style={styles.heroText}>
            <Text
              style={[typography.title1, { color: theme.text }]}
              numberOfLines={1}
            >
              {name}
            </Text>
            {role ? (
              <Text
                style={[typography.body, { color: theme.textMuted, marginTop: 2 }]}
                numberOfLines={1}
              >
                {role}
              </Text>
            ) : null}
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      card.status === 'PUBLISHED'
                        ? theme.signalOk
                        : theme.textFaint,
                  },
                ]}
              />
              <Text style={[typography.bodySmall, { color: theme.textMuted }]}>
                {card.status === 'PUBLISHED' ? 'Published' : 'Draft'}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

function EmptyCardCta({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Card variant="glow" padded={24}>
      <Text
        style={[typography.title1, { color: theme.text, marginBottom: 6 }]}
      >
        {label}
      </Text>
      <Text
        style={[
          typography.body,
          { color: theme.textSecondary, marginBottom: 16 },
        ]}
      >
        30 seconds to a premium digital card you can NFC-tap or share via QR.
      </Text>
      <Button label={label} variant="accent" onPress={onPress} />
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale());
  const { showToast } = useToast();
  const user = useAuthStore((s) => s.user);

  const [card, setCard] = useState<ApiCard | null | undefined>(undefined); // undefined = loading
  const [summary, setSummary] = useState<ShareSummary | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Greeting: use first name if available
  const firstName = user?.name?.split(' ')[0] ?? null;
  const greeting = firstName
    ? `${t.home.greeting}, ${firstName}`
    : t.home.greeting;

  const loadData = useCallback(async () => {
    // Primary card
    void listCards({ limit: 1 })
      .then((res) => {
        setCard(res.items[0] ?? null);
      })
      .catch(() => {
        setCard(null);
      });

    // Share summary
    setLoadingActivity(true);
    void getShareSummary()
      .then((s) => {
        setSummary(s);
      })
      .catch(() => {
        setSummary(null);
      })
      .finally(() => {
        setLoadingActivity(false);
      });
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Quick action handlers
  function handleShare() {
    router.push('/(app)/cards' as never);
  }

  function handleScan() {
    showToast({ message: t.home.comingSoon, variant: 'success' });
  }

  function handleCreate() {
    router.push('/(app)/cards/create' as never);
  }

  function handleCardHeroPress() {
    if (card) {
      router.push(`/(app)/cards/${card.id}` as never);
    }
  }

  function handleEmptyCtaPress() {
    router.push('/(app)/onboarding' as never);
  }

  // Derive activity items
  const activityItems: ActivityItem[] =
    summary && card
      ? buildActivityItems(summary, card.updatedAt)
      : [];

  return (
    <ScreenContainer scrollable padded={false} edges={['bottom', 'left', 'right']}>
      <AppBar
        variant="large"
        title={t.home.title}
        subtitle={greeting}
      />

      <View style={styles.content}>

        {/* ── Primary card hero ── */}
        {card === undefined ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={accent} />
          </View>
        ) : card !== null ? (
          <CardHero card={card} onPress={handleCardHeroPress} />
        ) : (
          <EmptyCardCta label={t.home.emptyCardCta} onPress={handleEmptyCtaPress} />
        )}

        {/* ── Quick actions ── */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <Chip
              label={t.home.quickShare}
              variant="default"
              leadingIcon={<Share2 size={14} color={theme.textSecondary} />}
              onPress={handleShare}
            />
            <Chip
              label={t.home.quickScan}
              variant="default"
              leadingIcon={<ScanLine size={14} color={theme.textSecondary} />}
              onPress={handleScan}
            />
            <Chip
              label={t.home.quickCreate}
              variant="accent"
              leadingIcon={<Plus size={14} color={accent} />}
              onPress={handleCreate}
            />
          </ScrollView>
        </View>

        {/* ── Recent activity ── */}
        <View>
          <SectionLabel style={styles.sectionLabel}>
            {t.home.recentActivityLabel}
          </SectionLabel>
          {loadingActivity ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={accent} size="small" />
            </View>
          ) : activityItems.length > 0 ? (
            <RowGroup>
              {activityItems.map((item, index) => (
                <Row
                  key={item.key}
                  title={item.title}
                  subtitle={item.subtitle}
                  divider={index !== 0}
                  leading={
                    item.icon === 'eye' ? (
                      <Eye size={18} color={theme.textMuted} />
                    ) : item.icon === 'heart' ? (
                      <Heart size={18} color={theme.textMuted} />
                    ) : (
                      <Send size={18} color={theme.textMuted} />
                    )
                  }
                />
              ))}
            </RowGroup>
          ) : (
            <RowGroup>
              <Row
                title={t.home.noActivity}
                subtitle={t.home.noActivityHint}
                divider={false}
                leading={<Eye size={18} color={theme.textFaint} />}
              />
            </RowGroup>
          )}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPad} />
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  content: {
    padding: 18,
    gap: 18,
  },
  loadingRow: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroAvatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    minWidth: 0,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 4,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  bottomPad: {
    height: 32,
  },
  pressed: {
    opacity: 0.85,
  },
});
