import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { copper } from '../../lib/theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: Props) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: isDisabled ? 0.5 : 1,
    ...(variant === 'primary' && {
      backgroundColor: copper[500],
    }),
    ...(variant === 'secondary' && {
      backgroundColor: theme.bg[1],
      borderWidth: 1,
      borderColor: theme.line.DEFAULT,
    }),
    ...(variant === 'ghost' && {
      backgroundColor: 'transparent',
    }),
  };

  const labelColor =
    variant === 'primary'
      ? '#FFFFFF'
      : variant === 'ghost'
      ? copper[500]
      : theme.ink[100];

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
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : copper[500]}
        />
      ) : (
        <Text
          style={[
            styles.label,
            { color: labelColor },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
