// Verso v2 Button — matches `.v-btn` semantics from Project_Verso_Mobil.
// Variants:
//   primary  — solid ink fill (theme.text), white label. CTA emphasis.
//   accent   — solid accent fill (#4B5DEC), white label. Brand action.
//   secondary — surface fill + border. Neutral default.
//   ghost    — transparent, ink label. Inline action.
// Sizes: default (48h, 14r, 15/600), sm (36h, 10r, 13/600), md (40h, 12r, 14/600).
// The legacy `primary` callers (copper fill) automatically inherit the new
// look — accent fill is reserved for explicit `variant="accent"` callers.

import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent, radius } from '../../lib/theme/tokens';
import { typography } from '../../lib/theme/typography';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost';
type Size = 'default' | 'sm' | 'md';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled,
  loading,
  style,
  fullWidth = true,
}: Props) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const height = size === 'sm' ? 36 : size === 'md' ? 40 : 48;
  const horizontalPad = size === 'sm' ? 12 : size === 'md' ? 14 : 18;
  const r = size === 'sm' ? radius.sm : size === 'md' ? 12 : radius.md;

  const containerStyle: ViewStyle = {
    height,
    paddingHorizontal: horizontalPad,
    borderRadius: r,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: isDisabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    borderWidth: 1,
    borderColor: 'transparent',
    ...(variant === 'primary' && {
      backgroundColor: theme.text,
      borderColor: theme.text,
    }),
    ...(variant === 'accent' && {
      backgroundColor: accent,
      borderColor: accent,
    }),
    ...(variant === 'secondary' && {
      backgroundColor: theme.surface,
      borderColor: theme.line.DEFAULT,
    }),
    ...(variant === 'ghost' && {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    }),
  };

  const labelColor =
    variant === 'primary'
      ? theme.pageBg
      : variant === 'accent'
      ? '#FFFFFF'
      : theme.text;

  const labelStyle: TextStyle =
    size === 'sm'
      ? typography.buttonSmall
      : typography.button;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        containerStyle,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <Text style={[labelStyle, { color: labelColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
