// Verso v2 ScreenContainer — matches `.v-screen` semantics. Provides a
// full-height safe-area canvas with the theme page background. Pages
// control their own padding now; previous default of 24px is opt-in via
// `padded` prop.

import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';

type Props = {
  children: ReactNode;
  scrollable?: boolean;
  /**
   * Apply the 24px gutter padding (default true — old screens rely on it).
   * Pass `padded={false}` for Verso v2 screens that use AppBar + manage
   * their own inner spacing.
   */
  padded?: boolean;
  /** Override the background — defaults to theme.pageBg. */
  background?: string;
  style?: StyleProp<ViewStyle>;
  /** Hide bottom safe-area insets when content already handles it. */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function ScreenContainer({
  children,
  scrollable,
  padded = true,
  background,
  style,
  edges,
}: Props) {
  const theme = useTheme();
  const bg = background ?? theme.pageBg;

  const innerStyle: StyleProp<ViewStyle> = padded
    ? [styles.flex, styles.padded, style]
    : [styles.flex, style];

  if (scrollable) {
    return (
      <SafeAreaView
        edges={edges}
        style={[styles.safe, { backgroundColor: bg }]}
      >
        <ScrollView
          contentContainerStyle={padded ? styles.scrollPadded : styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: bg }]}>
      <View style={innerStyle}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  padded: {
    padding: 24,
  },
  scroll: {
    flexGrow: 1,
  },
  scrollPadded: {
    padding: 24,
    paddingBottom: 48,
    flexGrow: 1,
  },
});
