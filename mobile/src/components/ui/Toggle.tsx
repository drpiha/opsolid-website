// Verso v2 Toggle — matches `.v-toggle` semantics. 46×28 pill with
// 24×24 thumb sliding 18px on activation. Animated via Reanimated for
// smooth 150ms transition.

import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent } from '../../lib/theme/tokens';

type Props = {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
};

export function Toggle({ value, onChange, disabled }: Props) {
  const theme = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 150 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value > 0.5 ? accent : theme.line.firm,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 18 }],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      hitSlop={6}
      style={({ pressed }) => [
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 28,
    borderRadius: 999,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
});
