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
  /** Optional long-press handler — used by the deck to fan/collapse on hold. */
  onLongPress?: () => void;
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
  onLongPress,
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

  const handleLongPress = useCallback(() => {
    if (!onLongPress) return;
    // Slightly heavier haptic to differentiate from a regular tap.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onLongPress();
  }, [onLongPress]);

  // Premium card aesthetic — hairline metallic border in the accent colour,
  // brand-primary trim down the right edge, and large photo / typography that
  // feel like an actual NFC business card rather than a notification chip.
  const innerStroke = hexWithAlpha(accent, 0.35);
  const photoWidth = Math.round(width * 0.42);
  const initial = name.charAt(0).toUpperCase();

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress ? handleLongPress : undefined}
      delayLongPress={350}
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
        {/* Left side: full-bleed photo. Falls back to a brand-primary block
            with the user's initial in display weight when no photo is set. */}
        <View
          style={[
            styles.photoCol,
            { width: photoWidth, backgroundColor: photoUri ? theme.bg[2] : primary },
          ]}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoImg} />
          ) : (
            <Text style={styles.bigInitial} accessibilityElementsHidden>
              {initial}
            </Text>
          )}
          {/* Vertical brand stripe between photo and text — the "metallic
              trim" that makes the card feel structural, not flat. */}
          <View style={[styles.spineTrim, { backgroundColor: accent }]} />
        </View>

        {/* Right side: typography. Name big, title under in brand-primary
            tone, slug + status pinned to the bottom edge. */}
        <View style={styles.textCol}>
          <View style={styles.textTop}>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={[styles.nameLg, { color: theme.ink[100] }]}
            >
              {name}
            </Text>
            {title ? (
              <Text
                numberOfLines={2}
                style={[styles.titleLg, { color: primary }]}
              >
                {title}
              </Text>
            ) : null}
          </View>

          <View style={styles.footRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusDotColor(card.status) },
              ]}
            />
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
  // Deeper shadow + 1.5px metallic inner border gives the card real weight.
  surface: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 10,
  },
  // Left photo column — full-bleed image + brand-primary fallback block.
  photoCol: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bigInitial: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 88,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    paddingTop: 8,
  },
  // 3-px vertical accent line between photo and text — the "metallic trim".
  spineTrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 3,
  },
  // Right text column — name big, title under in brand-primary tone.
  textCol: {
    flex: 1,
    paddingTop: 18,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 14,
    justifyContent: 'space-between',
  },
  textTop: {
    gap: 6,
  },
  nameLg: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  titleLg: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 19,
    letterSpacing: 0.1,
  },
  footRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  slug: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.2,
  },
  badge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    minWidth: 26,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
