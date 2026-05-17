// Verso v2 Avatar — matches `.v-avatar` semantics.
// Circle or square ("sq" with 14r). Renders initials from `name`, fallback
// to first char. `imageUri` takes precedence when present.

import { View, Image, Text, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent } from '../../lib/theme/tokens';
import { typography } from '../../lib/theme/typography';

type Props = {
  name?: string;
  imageUri?: string;
  size?: number;
  shape?: 'circle' | 'square';
  background?: string;
  style?: ViewStyle;
};

export function Avatar({
  name,
  imageUri,
  size = 40,
  shape = 'circle',
  background,
  style,
}: Props) {
  const theme = useTheme();

  const radius = shape === 'circle' ? size / 2 : 14;
  const bg = background ?? deriveBg(name, theme, accent);

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor: bg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  if (imageUri) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri: imageUri }}
          style={{ width: size, height: size, borderRadius: radius }}
          resizeMode="cover"
        />
      </View>
    );
  }

  const initials = deriveInitials(name);
  const fontSize = Math.max(10, Math.round(size * 0.4));

  return (
    <View style={[containerStyle, style]}>
      <Text
        style={[
          typography.bodyMedium,
          {
            color: '#FFFFFF',
            fontSize,
            lineHeight: fontSize + 2,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

function deriveInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function deriveBg(
  name: string | undefined,
  theme: ReturnType<typeof useTheme>,
  fallback: string,
): string {
  if (!name) return fallback;
  // Stable hash → pick from a small accent palette so the same name always
  // renders the same color. Keeps lists scannable across re-renders.
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const palette = ['#4B5DEC', '#8957DB', '#3AAA63', '#D7A33A', '#5A6379'];
  return palette[h % palette.length];
}
