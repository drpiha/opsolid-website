// Verso v2 BottomNav — custom renderer for expo-router Tabs.
// 5-item allowlist (home/cards/discover/inbox/settings), accent active tint.
// Wire via `<Tabs tabBar={(props) => <BottomNav {...props} />}>`.
//
// Earlier we tried filtering on `options.href !== null` — that was unreliable
// because expo-router doesn't expose `href` as a runtime descriptor field,
// so the filter became a no-op and the bar rendered all 7 routes squashed
// into one strip. Switched to a deterministic allowlist on route names.

import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent } from '../../lib/theme/tokens';
import { typography } from '../../lib/theme/typography';

// Canonical 5 visible tabs. Order matters: this is the bottom-nav order.
const VISIBLE_ROUTE_NAMES = [
  'home',
  'cards',
  'discover',
  'inbox/index',
  'settings',
] as const;

export function BottomNav(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Build the visible list by allowlist, preserving the order above. This is
  // resilient to whatever order expo-router internally arranged state.routes.
  const visibleRoutes = VISIBLE_ROUTE_NAMES
    .map((name) => state.routes.find((r) => r.name === name))
    .filter((r): r is (typeof state.routes)[number] => r !== undefined);

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
    width: '100%',
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.7,
  },
});
