// -----------------------------------------------------------------------
// Sprint F2 — Event detail screen.
//
// Header: full-bleed cover (or initials gradient), event name, date, venue.
// Body:   description.
// Below:  attendee grid (3-col) with photo+name+title; tap → /(app)/public/[slug].
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
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Calendar } from 'lucide-react-native';
import { getEvent } from '../../../src/lib/api/events';
import type { EventDetail, EventDetailAttendee } from '../../../src/lib/api/events';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { API_BASE } from '../../../src/lib/api/client';
import { Button } from '../../../src/components/ui/Button';
import { EventCover } from '../../../src/components/events/EventCover';
import { formatEventLongDate } from '../../../src/lib/events/format';

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

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <ActivityIndicator size="large" color={copper[500]} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <Text style={[styles.errorText, { color: theme.signalErr }]}>
          {error ?? t.errorLoad}
        </Text>
        <Button
          label={t.retry}
          onPress={() => void load('initial')}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  const { event, attendees } = data;
  const longDate = formatEventLongDate(event.startAt, event.endAt, locale);
  const placeLine = [event.venue, event.city, event.country]
    .filter(Boolean)
    .join(', ');

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: theme.bg[0] }]}
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void load('refresh')}
          tintColor={copper[500]}
        />
      }
    >
      <Stack.Screen options={{ title: event.name }} />

      {/* Cover header */}
      <View style={styles.coverWrap}>
        <EventCover
          slug={event.slug}
          name={event.name}
          coverPath={event.coverPath}
          width="100%"
          height={200}
          borderRadius={0}
          initialsFontSize={64}
        />
      </View>

      {/* Title block */}
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.ink[100] }]}>{event.name}</Text>

        <View style={styles.metaRow}>
          <Calendar size={14} color={theme.ink[400]} />
          <Text style={[styles.metaText, { color: theme.ink[300] }]}>
            {longDate}
          </Text>
        </View>

        {placeLine ? (
          <View style={styles.metaRow}>
            <MapPin size={14} color={theme.ink[400]} />
            <Text style={[styles.metaText, { color: theme.ink[300] }]} numberOfLines={2}>
              {placeLine}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Description */}
      {event.description ? (
        <Text style={[styles.description, { color: theme.ink[200] }]}>
          {event.description}
        </Text>
      ) : null}

      {/* Attendees */}
      <View style={[styles.attendeesHeader, { borderTopColor: theme.line.DEFAULT }]}>
        <Text style={[styles.attendeesTitle, { color: theme.ink[100] }]}>
          {t.attendees}
        </Text>
        <Text style={[styles.attendeesCount, { color: theme.ink[400] }]}>
          {attendees.length}
        </Text>
      </View>

      {attendees.length === 0 ? (
        <Text style={[styles.noAttendees, { color: theme.ink[400] }]}>
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
    </ScrollView>
  );
}

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
          backgroundColor: theme.bg[1],
          borderColor: theme.line.DEFAULT,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: theme.bg[2] }]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImg} />
        ) : (
          <Text style={[styles.avatarInitial, { color: theme.ink[300] }]}>
            {initial}
          </Text>
        )}
      </View>
      <Text
        style={[styles.tileName, { color: theme.ink[100] }]}
        numberOfLines={1}
      >
        {name}
      </Text>
      {title ? (
        <Text
          style={[styles.tileTitle, { color: theme.ink[400] }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 32 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: { fontSize: 16, textAlign: 'center' },
  coverWrap: {
    width: '100%',
  },
  titleBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  title: { fontSize: 24, fontWeight: '700', lineHeight: 28, letterSpacing: -0.4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, flex: 1 },
  description: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attendeesHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  attendeesTitle: { fontSize: 18, fontWeight: '600' },
  attendeesCount: { fontSize: 14, fontWeight: '500' },
  noAttendees: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  // Three-column tile: (100% - 16 - 16) / 3 ≈ 33.33% minus the 8 gap spread.
  // RN flexBasis with the ratio "31%" + gap=8 + paddingHorizontal:12 lands on
  // a clean 3-up grid on iPhone 13/14 widths (390px) and Pixel widths (360-411).
  tile: {
    width: '31.5%',
    aspectRatio: 0.78,
    padding: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
  pressed: { opacity: 0.7 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 4,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { fontSize: 22, fontWeight: '600' },
  tileName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  tileTitle: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
  },
});
