// Verso v2 BottomNav — custom renderer for expo-router Tabs.
// 5-item grid, glassmorphism background, 10px label, accent active tint.
// Wire via `<Tabs tabBar={(props) => <BottomNav {...props} />}>`.
//
// expo-blur is intentionally NOT a dependency yet — using a solid
// near-white surface with top hairline. M7 polish swap to BlurView.

import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent } from '../../lib/theme/tokens';
import { typography } from '../../lib/theme/typography';

export function BottomNav(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Only render tabs that have an `href` (visible in tab bar). Hidden routes
  // declared via `href: null` should not appear here.
  const visibleRoutes = state.routes.filter((route) => {
    const { options } = descriptors[route.key];
    return (options as { href?: unknown }).href !== null;
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.line.DEFAULT,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {visibleRoutes.map((route) => {
        const realIndex = state.routes.findIndex((r) => r.key === route.key);
        const isFocused = state.index === realIndex;
        const { options } = descriptors[route.key];

        const Icon = options.tabBarIcon as
          | ((args: { color: string; size: number; focused: boolean }) => React.ReactNode)
          | undefined;

        const label = (options.title ?? route.name) as string;
        const tintColor = isFocused ? accent : theme.textMuted;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            // expo-router routes are typed by file name; navigate by name.
            navigation.navigate(route.name as never);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.pressed,
            ]}
            hitSlop={4}
          >
            {Icon ? Icon({ color: tintColor, size: 22, focused: isFocused }) : null}
            <Text
              style={[
                typography.tabLabel,
                { color: tintColor },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.7,
  },
});
