// Verso v2 AppBar — matches `.v-appbar` + `.v-appbar-lg`.
// Two flavors:
//   default  — 17px/600 title centered, optional leading/trailing slots.
//   large    — 30px/700 H1 + optional 14px lead under it. No trailing slot.

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { typography } from '../../lib/theme/typography';

type DefaultProps = {
  variant?: 'default';
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Render a 1px bottom hairline when content scrolls under it. */
  elevated?: boolean;
  style?: ViewStyle;
  /** Background; defaults to theme.pageBg. */
  background?: string;
};

type LargeProps = {
  variant: 'large';
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: ViewStyle;
  background?: string;
  elevated?: boolean;
};

type Props = DefaultProps | LargeProps;

export function AppBar(props: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bg = props.background ?? theme.pageBg;

  const baseStyle: ViewStyle = {
    backgroundColor: bg,
    paddingTop: insets.top + 4,
    paddingHorizontal: 18,
    ...(props.elevated && {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.line.DEFAULT,
    }),
  };

  if (props.variant === 'large') {
    return (
      <View style={[baseStyle, styles.large, props.style]}>
        {(props.leading || props.trailing) && (
          <View style={styles.actions}>
            {props.leading ?? <View style={styles.iconBtnPlaceholder} />}
            {props.trailing ?? <View style={styles.iconBtnPlaceholder} />}
          </View>
        )}
        <Text style={[typography.display1, { color: theme.text }]}>
          {props.title}
        </Text>
        {props.subtitle ? (
          <Text
            style={[typography.lead, { color: theme.textSecondary, marginTop: 6 }]}
          >
            {props.subtitle}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[baseStyle, styles.default, props.style]}>
      <View style={styles.slot}>
        {props.leading ?? <View style={styles.iconBtnPlaceholder} />}
      </View>
      <Text style={[typography.title2, { color: theme.text }]} numberOfLines={1}>
        {props.title}
      </Text>
      <View style={[styles.slot, styles.slotRight]}>
        {props.trailing ?? <View style={styles.iconBtnPlaceholder} />}
      </View>
    </View>
  );
}

/** 38×38 icon button used in AppBar leading/trailing slots. */
export function AppBarIconButton({
  onPress,
  children,
  ghost,
  accessibilityLabel,
}: {
  onPress: () => void;
  children: ReactNode;
  ghost?: boolean;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        {
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: ghost ? 'transparent' : theme.surface,
          borderWidth: ghost ? 0 : 1,
          borderColor: theme.line.DEFAULT,
          alignItems: 'center',
          justifyContent: 'center',
        },
        pressed && { opacity: 0.7 },
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  large: {
    paddingBottom: 14,
  },
  slot: {
    width: 38,
    height: 38,
    justifyContent: 'center',
  },
  slotRight: {
    alignItems: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBtnPlaceholder: {
    width: 38,
    height: 38,
  },
});
