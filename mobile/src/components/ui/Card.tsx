// Verso v2 Card — matches `.v-card` semantics.
// flat       — surface + 1px hairline border.
// elevated   — surface + medium shadow, no border.
// glow       — surface + accent-tinted glow ring (premium hero affordance).

import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { shadow as shadowTokens, radius } from '../../lib/theme/tokens';

type Variant = 'flat' | 'elevated' | 'glow';

type Props = {
  children: ReactNode;
  variant?: Variant;
  /** Radius preset — defaults to `lg` (18px). */
  rounded?: keyof typeof radius;
  /** Optional padding override; defaults to 16. */
  padded?: number | false;
  style?: ViewStyle;
};

export function Card({
  children,
  variant = 'flat',
  rounded = 'lg',
  padded = 16,
  style,
}: Props) {
  const theme = useTheme();

  const baseStyle: ViewStyle = {
    backgroundColor: theme.surface,
    borderRadius: radius[rounded],
    padding: padded === false ? 0 : padded,
  };

  const variantStyle: ViewStyle =
    variant === 'flat'
      ? { borderWidth: 1, borderColor: theme.line.DEFAULT }
      : variant === 'elevated'
      ? {
          ...shadowTokens.md,
          borderWidth: 0,
        }
      : {
          // glow — accent-tinted ring + soft outer halo
          borderWidth: 1,
          borderColor: theme.line.DEFAULT,
          shadowColor: '#4B5DEC',
          shadowOpacity: 0.15,
          shadowRadius: 32,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        };

  return <View style={[baseStyle, variantStyle, style]}>{children}</View>;
}
