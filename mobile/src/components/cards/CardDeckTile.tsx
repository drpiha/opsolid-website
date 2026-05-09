import { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import type { ApiCard } from '../../lib/api/types';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { teal, signal } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';
import { API_BASE } from '../../lib/api/client';

const TILE_SIDE_INSET = 24;

/**
 * Returns the pixel size of a deck tile for the current screen width.
 * width = screenWidth − 48 (24pt margin per side); height = width × 0.6 (5:3).
 */
export function useTileSize(): { width: number; height: number } {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.max(0, screenWidth - TILE_SIDE_INSET * 2);
  const height = Math.round(width * 0.6);
  return { width, height };
}

type Props = {
  card: ApiCard;
  /** Optional badge label rendered bottom-right (e.g. "+3" for hidden cards). */
  badge?: string | null;
  /** When true, taps don't navigate. Used while parent handles tap (deck collapse/expand). */
  suppressNavigation?: boolean;
  /** Optional override called when this tile is tapped. Runs after press feedback. */
  onPress?: () => void;
  /** Top-of-deck shadow boost (only the visually frontmost card uses this). */
  showShadow?: boolean;
};

function statusDotColor(status: ApiCard['status']): string {
  if (status === 'PUBLISHED') return signal.ok;
  if (status === 'DRAFT') return teal[500];
  return '#6B717B';
}

/**
 * 5:3 tile rendering brand band, accent dot, avatar, name/title, slug, status
 * dot. Press feedback is a Reanimated worklet (scale 0.97). Tactile feedback
 * uses `expo-haptics` `ImpactFeedbackStyle.Light` — proper iOS Taptic Engine
 * + Android haptics for tap-style interactions, consistent with Apple's
 * Human Interface Guidelines for non-critical UI confirmations.
 */
export function CardDeckTile({
  card,
  badge,
  suppressNavigation,
  onPress,
  showShadow,
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations(detectLocale()).cards;
  const { width, height } = useTileSize();

  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(showShadow ? 0.12 : 0.06);

  const data = card.cardData as Record<string, unknown>;
  const name =
    (typeof data?.name === 'string' && data.name) ||
    card.slug ||
    card.id.slice(0, 8);
  const title = typeof data?.title === 'string' ? data.title : null;

  const photoUri = card.photoPath
    ? card.photoPath.startsWith('http')
      ? card.photoPath
      : `${API_BASE}${card.photoPath}`
    : null;

  const primary = card.brandPrimaryHex ?? teal[500];
  const accent = card.brandAccentHex ?? teal[500];

  const surfaceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
    shadowOpacity.value = withSpring(0.20, { damping: 20, stiffness: 300 });
    // Light tactile feedback. impactAsync runs on the JS thread (not
    // worklet-safe) and silently no-ops on devices without haptic hardware.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [scale, shadowOpacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    shadowOpacity.value = withSpring(showShadow ? 0.12 : 0.06, {
      damping: 20,
      stiffness: 300,
    });
  }, [scale, shadowOpacity, showShadow]);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    if (suppressNavigation) return;
    router.push(`/(app)/cards/${card.id}` as never);
  }, [card.id, onPress, router, suppressNavigation]);

  // accentHex with 30% opacity for inner stroke
  const innerStroke = hexWithAlpha(accent, 0.3);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${t.status[card.status]}`}
    >
      <Animated.View
        style={[
          styles.surface,
          {
            width,
            height,
            backgroundColor: theme.bg[1],
            borderColor: innerStroke,
            shadowColor: '#000',
          },
          surfaceStyle,
        ]}
      >
        {/* Brand primary band — top 12% */}
        <View
          style={[
            styles.band,
            { height: Math.max(20, Math.round(height * 0.12)), backgroundColor: primary },
          ]}
        >
          <View style={[styles.accentDot, { backgroundColor: accent }]} />
        </View>

        {/* Body */}
        <View style={styles.body}>
          <View style={[styles.avatar, { backgroundColor: theme.bg[2] }]}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImg} />
            ) : (
              <Text style={[styles.avatarInitial, { color: theme.ink[300] }]}>
                {name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <View style={styles.textBlock}>
            <Text
              numberOfLines={1}
              style={[styles.name, { color: theme.ink[100] }]}
            >
              {name}
            </Text>
            {title ? (
              <Text
                numberOfLines={1}
                style={[styles.title, { color: theme.ink[300] }]}
              >
                {title}
              </Text>
            ) : null}
          </View>

          {/* Bottom row: status dot left, slug right */}
          <View style={styles.footRow}>
            <View style={styles.statusWrap}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusDotColor(card.status) },
                ]}
              />
            </View>
            {card.slug ? (
              <Text
                numberOfLines={1}
                style={[styles.slug, { color: theme.ink[400] }]}
              >
                /c/{card.slug}
              </Text>
            ) : null}
          </View>
        </View>

        {/* "+N" badge — only on bottom-most layer when deck length > 4 */}
        {badge ? (
          <View style={[styles.badge, { backgroundColor: teal[500] }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

/**
 * Add an alpha channel to a `#RRGGBB` hex. Falls back to teal-tinted black if
 * the hex is malformed. Returns an `rgba()` string.
 */
function hexWithAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(26,166,183,${alpha})`;
  const num = parseInt(m[1], 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  band: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  body: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: { width: 40, height: 40 },
  avatarInitial: { fontSize: 16, fontWeight: '600' },
  textBlock: {
    marginTop: 6,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  footRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusWrap: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  slug: {
    fontSize: 11,
    fontWeight: '500',
    flex: 0,
  },
  badge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    minWidth: 24,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
