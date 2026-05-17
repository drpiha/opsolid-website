// Verso v2 Chip — matches `.v-chip` variants from mobile.css.
// default   — surface + hairline + textMuted.
// accent    — accentSoft bg + accent label.
// success   — okSoft bg + ok label.
// warning   — warnSoft bg + warn label.
// error     — errSoft bg + err label.
// solid     — ink fill, pageBg label.
// mono      — uppercase mono label (e.g. SKU codes, timestamps).
// outline   — transparent + hairline + textMuted (used in dense lists).

import { Pressable, View, Text, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent, signal } from '../../lib/theme/tokens';
import { typography } from '../../lib/theme/typography';

type Variant =
  | 'default'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'solid'
  | 'mono'
  | 'outline';

type Props = {
  label: string;
  variant?: Variant;
  leadingIcon?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  /** Display as a status dot label (8px dot + label). */
  dot?: 'live' | 'warn' | 'error' | 'idle' | false;
};

export function Chip({
  label,
  variant = 'default',
  leadingIcon,
  onPress,
  style,
  dot = false,
}: Props) {
  const theme = useTheme();

  const palette = palettes(theme, variant);
  const labelStyle: TextStyle =
    variant === 'mono' ? typography.sectionLabel : typography.chip;

  const inner = (
    <View
      style={[
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      {dot ? (
        <View
          style={[
            styles.dot,
            {
              backgroundColor:
                dot === 'live'
                  ? signal.ok
                  : dot === 'warn'
                  ? signal.warn
                  : dot === 'error'
                  ? signal.err
                  : theme.textFaint,
            },
          ]}
        />
      ) : null}
      {leadingIcon}
      <Text style={[labelStyle, { color: palette.fg }]}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {inner}
      </Pressable>
    );
  }
  return inner;
}

function palettes(
  theme: ReturnType<typeof useTheme>,
  variant: Variant,
): { bg: string; border: string; fg: string } {
  switch (variant) {
    case 'accent':
      return {
        bg: theme.accentSoft,
        border: 'transparent',
        fg: accent,
      };
    case 'success':
      return {
        bg:
          theme.mode === 'light'
            ? '#DDF1E5'
            : '#143824',
        border: 'transparent',
        fg: theme.signalOk,
      };
    case 'warning':
      return {
        bg:
          theme.mode === 'light'
            ? '#F8EAD0'
            : '#3A2B0E',
        border: 'transparent',
        fg: theme.signalWarn,
      };
    case 'error':
      return {
        bg:
          theme.mode === 'light'
            ? '#FBE7E2'
            : '#3D1614',
        border: 'transparent',
        fg: theme.signalErr,
      };
    case 'solid':
      return {
        bg: theme.text,
        border: 'transparent',
        fg: theme.pageBg,
      };
    case 'mono':
      return {
        bg: theme.surface,
        border: theme.line.DEFAULT,
        fg: theme.textMuted,
      };
    case 'outline':
      return {
        bg: 'transparent',
        border: theme.line.firm,
        fg: theme.textSecondary,
      };
    default:
      return {
        bg: theme.surface,
        border: theme.line.DEFAULT,
        fg: theme.textSecondary,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
