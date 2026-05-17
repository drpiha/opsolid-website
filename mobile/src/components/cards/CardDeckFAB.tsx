import { forwardRef, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { accent } from '../../lib/theme/tokens';

type Props = {
  onPress: () => void;
  /** Pulse loops infinitely while true. Set to true only when there are 0 cards. */
  pulse: boolean;
};

/**
 * Floating Action Button — 64pt circle, teal[500] fill, white "+" icon.
 *
 * Pulse animation runs as a worklet `withRepeat(withSequence(...), -1, true)`
 * only when the deck is empty. Once the user creates their first card the
 * pulse stops and the FAB stays at scale 1.
 *
 * Accepts a forwarded `ref` on the outer absolutely-positioned wrap so the
 * coaching-mark Tour A can `measureInWindow` it for the spotlight cutout.
 */
export const CardDeckFAB = forwardRef<View, Props>(function CardDeckFAB(
  { onPress, pulse },
  ref,
) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.06, { damping: 8, stiffness: 120 }),
          withSpring(1.0, { damping: 8, stiffness: 120 }),
        ),
        -1,
        true,
      );
    } else {
      // Snap back to 1 when pulse turns off (don't restart the loop).
      scale.value = withSpring(1.0, { damping: 14, stiffness: 200 });
    }
  }, [pulse, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[
        styles.wrap,
        { bottom: 32 + insets.bottom, right: 24 },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View style={animStyle}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Create new card"
          style={styles.fab}
          hitSlop={8}
        >
          <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
