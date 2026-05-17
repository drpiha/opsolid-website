// -----------------------------------------------------------------------
// Verso v2 — Event detail screen.
//
// AppBar default (back + share) + hero cover + metadata + about section +
// ROI metrics card + attendance toggle fixed at bottom.
// -----------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Image,
  StyleSheet,
  RefreshControl,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
} from 'lucide-react-native';
import { getEvent } from '../../../src/lib/api/events';
import type { EventDetail, EventDetailAttendee } from '../../../src/lib/api/events';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { accent } from '../../../src/lib/theme/tokens';
import { typography } from '../../../src/lib/theme/typography';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { API_BASE } from '../../../src/lib/api/client';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { Chip } from '../../../src/components/ui/Chip';
import { AppBar, AppBarIconButton } from '../../../src/components/ui/AppBar';
import { SectionLabel } from '../../../src/components/ui/SectionLabel';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { EventCover } from '../../../src/components/events/EventCover';
import { formatEventLongDate } from '../../../src/lib/events/format';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isLiveNow(startAt: string, endAt: string): boolean {
  const now = Date.now();
  return new Date(startAt).getTime() <= now && new Date(endAt).getTime() >= now;
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function EventDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).events;

  const [data, setData] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Attendance state — placeholder; real toggle needs cardId from auth store.
  // The actual mutation (updateCardEvents) lives in the cards/edit screen.
  // This toggle is display-only until the event-detail attendance API is wired.
  const [attending, setAttending] = useState(false);

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (!slug) return;
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      setError(null);
      try {
        const res = await getEvent(slug);
        setData(res);
      } catch {
        setError(t.errorLoad);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug, t.errorLoad],
  );

  useEffect(() => {
    void load('initial');
  }, [load]);

  async function handleShare() {
    if (!data) return;
    try {
      await Share.share({
        title: data.event.name,
        message: data.event.name,
      });
    } catch {
      // share cancelled — no-op
    }
  }

  // -------------------------------------------------------------------------
  // Loading / error states
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <ScreenContainer padded={false} edges={['bottom']}>
        <AppBar
          title=""
          leading={
            <AppBarIconButton onPress={() => router.back()} ghost accessibilityLabel="Back">
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

  if (error || !data) {
    return (
      <ScreenContainer padded={false} edges={['bottom']}>
        <AppBar
          title=""
          leading={
            <AppBarIconButton onPress={() => router.back()} ghost accessibilityLabel="Back">
              <ChevronLeft size={20} color={theme.text} />
            </AppBarIconButton>
          }
        />
        <View style={styles.center}>
          <Text style={[typography.body, { color: theme.signalErr, textAlign: 'center' }]}>
            {error ?? t.errorLoad}
          </Text>
          <Button
            label={t.retry}
            onPress={() => void load('initial')}
            variant="secondary"
            fullWidth={false}
            style={styles.retryBtn}
          />
        </View>
      </ScreenContainer>
    );
  }

  const { event, attendees } = data;
  const longDate = formatEventLongDate(event.startAt, event.endAt, locale);
  const placeLine = [event.venue, event.city, event.country]
    .filter(Boolean)
    .join(', ');
  const live = isLiveNow(event.startAt, event.endAt);

  // Placeholder ROI numbers — the real CRM lead data is not yet returned by
  // /api/v1/events/:slug. These show the card section skeleton until the
  // backend enriches the response.
  const roiLeads = 0;
  const roiSaves = 0;
  const hasRoiData = roiLeads > 0 || roiSaves > 0;

  return (
    <ScreenContainer padded={false} edges={['bottom']}>
      <AppBar
        title={event.name}
        leading={
          <AppBarIconButton onPress={() => router.back()} ghost accessibilityLabel="Back">
            <ChevronLeft size={20} color={theme.text} />
          </AppBarIconButton>
        }
        trailing={
          <AppBarIconButton onPress={handleShare} ghost accessibilityLabel="Share">
            <Share2 size={20} color={theme.text} />
          </AppBarIconButton>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void load('refresh')}
            tintColor={accent}
          />
        }
      >
        {/* Hero — full-width cover */}
        <View style={styles.heroWrap}>
          <EventCover
            slug={event.slug}
            name={event.name}
            coverPath={event.coverPath}
            width="100%"
            height={220}
            borderRadius={0}
            initialsFontSize={64}
          />
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={[typography.display2, { color: theme.text }]}>
            {event.name}
          </Text>

          <View style={styles.metaRow}>
            <Calendar size={15} color={theme.textMuted} />
            <Text style={[typography.lead, { color: theme.textSecondary, flex: 1 }]}>
              {longDate}
            </Text>
          </View>

          {placeLine ? (
            <View style={styles.metaRow}>
              <MapPin size={15} color={theme.textMuted} />
              <Text
                style={[typography.lead, { color: theme.textSecondary, flex: 1 }]}
                numberOfLines={2}
              >
                {placeLine}
              </Text>
            </View>
          ) : null}

          {/* Status chip row */}
          <View style={styles.chipRow}>
            {live ? (
              <Chip label="Live now" variant="success" dot="live" />
            ) : null}
            {attending ? (
              <Chip label={t.attending} variant="accent" />
            ) : null}
          </View>
        </View>

        {/* About section */}
        {event.description ? (
          <View style={styles.section}>
            <SectionLabel style={styles.sectionLabel}>{t.aboutLabel}</SectionLabel>
            <Text style={[typography.body, { color: theme.textSecondary, marginTop: 8 }]}>
              {event.description}
            </Text>
          </View>
        ) : null}

        {/* ROI / metrics section */}
        <View style={styles.section}>
          <SectionLabel style={styles.sectionLabel}>{t.roiLabel}</SectionLabel>
          <Card variant="flat" padded={16} style={styles.roiCard}>
            {hasRoiData ? (
              <View style={styles.chipRow}>
                <Chip
                  label={`${roiLeads} leads`}
                  variant="accent"
                  leadingIcon={<TrendingUp size={12} color={accent} />}
                />
                <Chip
                  label={`${roiSaves} saves`}
                  variant="accent"
                  leadingIcon={<Users size={12} color={accent} />}
                />
              </View>
            ) : (
              <Text style={[typography.bodySmall, { color: theme.textFaint }]}>
                Lead data will appear here once your card is linked to this event.
              </Text>
            )}
          </Card>
        </View>

        {/* Attendees section */}
        <View style={styles.section}>
          <View style={styles.attendeesHeader}>
            <SectionLabel>{t.attendees}</SectionLabel>
            <Text style={[typography.caption, { color: theme.textFaint }]}>
              {attendees.length}
            </Text>
          </View>

          {attendees.length === 0 ? (
            <Text
              style={[typography.bodySmall, { color: theme.textFaint, marginTop: 8, fontStyle: 'italic' }]}
            >
              {t.noAttendees}
            </Text>
          ) : (
            <View style={styles.grid}>
              {attendees.map((a) => (
                <AttendeeTile
                  key={a.slug}
                  attendee={a}
                  onPress={() => {
                    if (a.slug) {
                      router.push(`/(app)/public/${a.slug}` as never);
                    }
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Bottom spacer so fixed button doesn't overlap content */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Attendance toggle — fixed bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.pageBg,
            borderTopColor: theme.line.DEFAULT,
          },
        ]}
      >
        <Button
          label={attending ? t.notAttending : t.attending}
          variant={attending ? 'secondary' : 'accent'}
          onPress={() => setAttending((prev) => !prev)}
        />
        {attending ? (
          <Pressable
            onPress={() => {}}
            style={styles.viewAttendeesLink}
            accessibilityRole="button"
          >
            <Text style={[typography.bodySmall, { color: accent }]}>
              {t.viewAttendees}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Attendee tile
// ---------------------------------------------------------------------------
function AttendeeTile({
  attendee,
  onPress,
}: {
  attendee: EventDetailAttendee;
  onPress: () => void;
}) {
  const theme = useTheme();
  const cd = (attendee.cardData ?? {}) as Record<string, unknown>;
  const name = (typeof cd.name === 'string' ? cd.name : null) ?? attendee.slug ?? '—';
  const title = typeof cd.title === 'string' ? cd.title : null;
  const photoUri = attendee.photoPath
    ? attendee.photoPath.startsWith('http')
      ? attendee.photoPath
      : `${API_BASE}${attendee.photoPath}`
    : null;
  const initial = name.trim().charAt(0).toUpperCase() || '·';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: theme.surface,
          borderColor: theme.line.DEFAULT,
        },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <View style={[styles.avatar, { backgroundColor: theme.surfaceMuted }]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImg} />
        ) : (
          <Text style={[typography.title2, { color: theme.textMuted }]}>
            {initial}
          </Text>
        )}
      </View>
      <Text
        style={[typography.fieldLabel, { color: theme.text, textAlign: 'center' }]}
        numberOfLines={1}
      >
        {name}
      </Text>
      {title ? (
        <Text
          style={[typography.caption, { color: theme.textFaint, textAlign: 'center' }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : null}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  retryBtn: { marginTop: 16 },
  heroWrap: { width: '100%' },
  titleBlock: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'transparent', // set via theme inline where needed
    marginTop: 8,
  },
  sectionLabel: {
    marginBottom: 2,
  },
  roiCard: {
    marginTop: 10,
  },
  attendeesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tile: {
    width: '31%',
    aspectRatio: 0.78,
    padding: 8,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  pressed: { opacity: 0.7 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 4,
  },
  avatarImg: { width: '100%', height: '100%' },
  bottomSpacer: { height: 100 },
  bottomBar: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  viewAttendeesLink: {
    alignItems: 'center',
    paddingVertical: 4,
  },
});
