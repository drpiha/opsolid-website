// Verso v2 Row — matches `.v-row` semantics. Icon + main (title/sub) +
// trailing slot pattern. Auto-renders 1px hairline between consecutive
// rows when wrapped in <RowGroup>.

import { Pressable, View, Text, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { typography } from '../../lib/theme/typography';

type Props = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  /** Show a chevron in the trailing slot when no custom trailing is provided. */
  chevron?: boolean;
  style?: ViewStyle;
  /** Top hairline divider — set false for the first row in a group. */
  divider?: boolean;
};

export function Row({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  chevron,
  style,
  divider = true,
}: Props) {
  const theme = useTheme();
  const isPressable = !!onPress;

  const inner = (
    <View
      style={[
        styles.base,
        divider && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.line.DEFAULT },
        style,
      ]}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.main}>
        <Text style={[typography.title3, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[typography.bodySmall, { color: theme.textMuted, marginTop: 2 }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ? (
        <View style={styles.trailing}>{trailing}</View>
      ) : chevron ? (
        <ChevronRight size={18} color={theme.textFaint} />
      ) : null}
    </View>
  );

  if (isPressable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
        accessibilityRole="button"
      >
        {inner}
      </Pressable>
    );
  }
  return inner;
}

/** Wrapper that suppresses the hairline on the first child Row. */
export function RowGroup({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.line.DEFAULT,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  leading: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
