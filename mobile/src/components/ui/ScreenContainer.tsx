import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';

type Props = {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
};

export function ScreenContainer({ children, scrollable, style }: Props) {
  const theme = useTheme();

  if (scrollable) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.bg[0] }]}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, style]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg[0] }]}
    >
      <View style={[styles.flex, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
    padding: 24,
  },
  scroll: {
    padding: 24,
    paddingBottom: 48,
  },
});
