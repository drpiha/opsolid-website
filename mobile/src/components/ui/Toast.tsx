/**
 * Toast — lightweight animated overlay for transient feedback.
 *
 * Usage:
 *   const { showToast } = useToast();
 *   showToast({ message: 'Saved!', variant: 'success' });
 *
 * Provider:
 *   <ToastProvider> must wrap the app root (added to mobile/app/_layout.tsx).
 *
 * Design:
 *   - Slides up from bottom-center, fades in (250ms), holds 2 s, slides down
 *     + fades out (200ms). One toast at a time — a pending call cancels any
 *     in-flight animation and starts fresh.
 *   - Variants: 'success' (teal border + CheckCircle), 'error' (oxblood border + X).
 *   - Rounded 16px, 14pt y / 20pt x padding, theme.bg[0] surface.
 *   - Text: 14pt, 500 weight, theme.ink[100].
 *   - Touch target ≥ 44pt satisfied by full-width pill + 14pt vertical padding.
 *   - Both iOS and Android: uses `position: 'absolute'` inside a full-screen
 *     PointerEvents-passthrough wrapper so it overlays all content without
 *     stealing touches from elements below it.
 */

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { CheckCircle, X } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { teal, signal } from '../../lib/theme/tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastVariant = 'success' | 'error';

export interface ToastOptions {
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HOLD_MS = 2000;
const IN_MS = 250;
const OUT_MS = 200;
const SLIDE_DISTANCE = 80; // px — travels this far during slide-up/down

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<ToastOptions | null>(null);

  // Reanimated shared values
  const translateY = useSharedValue(SLIDE_DISTANCE);
  const opacity = useSharedValue(0);

  // Track in-flight timer so we can cancel it when a new toast interrupts
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    opacity.value = withTiming(0, { duration: OUT_MS, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(
      SLIDE_DISTANCE,
      { duration: OUT_MS, easing: Easing.in(Easing.quad) },
      (finished) => {
        if (finished) runOnJS(setVisible)(false);
      },
    );
  }, [opacity, translateY]);

  const showToast = useCallback(
    (options: ToastOptions) => {
      // Cancel any pending hold timer
      if (holdTimer.current) clearTimeout(holdTimer.current);

      // Reset position immediately (no animation) so the new toast starts
      // from the bottom even if the previous one was mid-animation.
      translateY.value = SLIDE_DISTANCE;
      opacity.value = 0;

      setCurrent(options);
      setVisible(true);

      // Animate in
      opacity.value = withTiming(1, { duration: IN_MS, easing: Easing.out(Easing.quad) });
      translateY.value = withTiming(0, { duration: IN_MS, easing: Easing.out(Easing.back(1.1)) });

      // Schedule hold + out
      holdTimer.current = setTimeout(() => {
        hide();
      }, HOLD_MS + IN_MS);
    },
    [opacity, translateY, hide],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const borderColor =
    current?.variant === 'success' ? teal[500] : signal.err;
  const Icon =
    current?.variant === 'success'
      ? CheckCircle
      : X;
  const iconColor =
    current?.variant === 'success' ? teal[500] : signal.err;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Overlay — pointerEvents 'none' on the wrapper so touches fall through */}
      {visible ? (
        <View style={styles.overlay} pointerEvents="none">
          <Animated.View
            style={[
              styles.pill,
              {
                backgroundColor: theme.bg[0],
                borderColor,
              },
              animatedStyle,
            ]}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            <Icon size={18} color={iconColor} strokeWidth={2} />
            <Text style={[styles.message, { color: theme.ink[100] }]}>
              {current?.message}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: 'center',
    // pointerEvents handled via prop — this view must NOT intercept touches
    zIndex: 9999,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    // Shadow for iOS elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
});
