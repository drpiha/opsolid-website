// -----------------------------------------------------------------------
// EventCover — cover image with deterministic initials-gradient fallback.
//
// Design decision (Sprint F2): rather than a flat color block when coverPath
// is null, we hash the slug to a hue and render a two-tone vertical fade
// with the event's two-letter monogram in the middle. Same approach the
// mobile public-card avatar uses for missing photoPath, which keeps the
// "missing image" state recognizable across the app.
//
// Hue is stable per slug (same event always renders the same gradient) so
// the Discover rail looks like a curated brand palette, not random color soup.
// -----------------------------------------------------------------------

import { View, Text, Image, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { API_BASE } from '../../lib/api/client';

function hashHue(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '··';
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function EventCover({
  slug,
  name,
  coverPath,
  width,
  height,
  borderRadius = 14,
  initialsFontSize,
}: {
  slug: string;
  name: string;
  coverPath: string | null | undefined;
  width: number | string;
  height: number;
  borderRadius?: number;
  initialsFontSize?: number;
}) {
  if (coverPath) {
    const uri = coverPath.startsWith('http') ? coverPath : `${API_BASE}${coverPath}`;
    return (
      <Image
        source={{ uri }}
        style={[
          styles.cover,
          {
            width: width as ViewStyle['width'],
            height,
            borderRadius,
          },
        ]}
      />
    );
  }

  const hue = hashHue(slug);
  // Two stops, 18% lightness apart — premium feel, never washed out.
  const top = `hsl(${hue}, 55%, 38%)`;
  const bottom = `hsl(${(hue + 28) % 360}, 60%, 22%)`;

  return (
    <View
      style={[
        styles.cover,
        {
          width: width as ViewStyle['width'],
          height,
          borderRadius,
          backgroundColor: top,
        },
      ]}
    >
      {/* RN doesn't ship a built-in linear-gradient; stack a translucent dark
          overlay on the bottom half to fake the two-stop fade without a dep. */}
      <View
        style={[
          styles.fadeOverlay,
          { backgroundColor: bottom },
        ]}
      />
      <Text
        style={[
          styles.initials,
          { fontSize: initialsFontSize ?? Math.max(28, Math.min(72, height * 0.42)) } as TextStyle,
        ]}
      >
        {initialsFromName(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fadeOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    opacity: 0.85,
  },
  initials: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '700',
    letterSpacing: 1.2,
    zIndex: 1,
  },
});
