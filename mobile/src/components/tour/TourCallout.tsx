// -----------------------------------------------------------------------
// TourCallout — the bubble that explains what the spotlight is pointing
// at. Two layout modes:
//
//   1. Anchored — there's a target rect. The bubble is placed below the
//      target if the target is in the upper half of the screen, otherwise
//      above it. A small triangle arrow points back at the target.
//
//   2. Centered — `position === 'centered'`. The bubble is centered both
//      axes; no arrow. Used for the first welcome step and any tour-A
//      framing step that doesn't have a concrete UI target.
//
// Animations: the bubble fades + slides up 8pt on appear (Reanimated
// `withSpring`, soft damping). The opacity drives interactability via the
// `Animated.View` style — the underlying SpotlightOverlay swaps `targetRect`
// before this child re-renders, so the bubble re-anchors without a flash.
//
// RTL: when `I18nManager.isRTL` is true, button order flips (primary on
// left, secondary on right) and text alignment switches to `right`. The
// arrow itself is symmetric so it doesn't need mirroring.
// -----------------------------------------------------------------------

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '../../lib/theme/ThemeProvider';
import { accentDark } from '../../lib/theme/tokens';
import type { TourStep } from '../../lib/tour/types';
import type { TargetRect } from './SpotlightOverlay';

type Position = 'above' | 'below' | 'centered';

type Props = {
  step: TourStep;
  isLastStep: boolean;
  /** Decided by the controller from the measured rect. */
  position: Position;
  /** The measured target. `null` when `position === 'centered'`. */
  targetRect: TargetRect | null;
  onNext: () => void;
  /**
   * Called before `onNext` if `step.action` is set. The controller awaits
   * this so we can show a brief loading state on the secondary button.
   */
  onAction?: () => Promise<void>;
};

const SCREEN_PADDING = 16;
const MAX_BUBBLE_WIDTH = 320;
const ARROW_SIZE = 10;
const ARROW_GAP = 8;

export function TourCallout({
  step,
  isLastStep,
  position,
  targetRect,
  onNext,
  onAction,
}: Props) {
  const theme = useTheme();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const isRTL = I18nManager.isRTL;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    // Re-fire on each step change so a re-anchored bubble plays a soft entry.
    opacity.value = 0;
    translateY.value = 8;
    opacity.value = withSpring(1, { damping: 18, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
  }, [step.key, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // ---------- Position math ----------
  // We don't know the bubble's actual height ahead of time (it depends on
  // body-text wrapping). For "above" placement we anchor the bubble's
  // BOTTOM edge to the target's top minus the arrow gap; for "below" the
  // TOP edge to the target's bottom plus the gap. Centered uses absolute
  // centering. We bound width to fit the viewport with side padding.
  const bubbleWidth = Math.min(screenW - SCREEN_PADDING * 2, MAX_BUBBLE_WIDTH);

  let containerStyle: ViewStyle = {};
  let arrowStyle: ViewStyle | null = null;

  if (position === 'centered' || !targetRect) {
    containerStyle = {
      left: (screenW - bubbleWidth) / 2,
      top: (screenH - 200) / 2, // approx; spring animation softens the offset
      width: bubbleWidth,
    };
  } else {
    // Horizontally clamp the bubble so it never spills off-screen.
    const targetCenterX = targetRect.x + targetRect.width / 2;
    let left = targetCenterX - bubbleWidth / 2;
    left = Math.max(SCREEN_PADDING, Math.min(left, screenW - bubbleWidth - SCREEN_PADDING));

    if (position === 'below') {
      containerStyle = {
        left,
        top: targetRect.y + targetRect.height + ARROW_GAP + ARROW_SIZE,
        width: bubbleWidth,
      };
      arrowStyle = {
        position: 'absolute',
        top: -ARROW_SIZE,
        left: Math.max(
          16,
          Math.min(targetCenterX - left - ARROW_SIZE, bubbleWidth - 16 - ARROW_SIZE * 2),
        ),
        borderLeftWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: theme.surface,
        width: 0,
        height: 0,
      };
    } else {
      // 'above'
      containerStyle = {
        left,
        // We don't yet know bubble height; the bubble lays out and we use
        // bottom-anchored positioning to pin its bottom edge to the target.
        bottom: screenH - targetRect.y + ARROW_GAP + ARROW_SIZE,
        width: bubbleWidth,
      };
      arrowStyle = {
        position: 'absolute',
        bottom: -ARROW_SIZE,
        left: Math.max(
          16,
          Math.min(targetCenterX - left - ARROW_SIZE, bubbleWidth - 16 - ARROW_SIZE * 2),
        ),
        borderLeftWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderTopWidth: ARROW_SIZE,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: theme.surface,
        width: 0,
        height: 0,
      };
    }
  }

  const textAlign: TextStyle['textAlign'] = isRTL ? 'right' : 'left';

  const handlePrimary = () => {
    onNext();
  };

  const handleSecondary = async () => {
    if (!onAction) return;
    try {
      await onAction();
    } catch {
      // Side-effects are best-effort. Advance regardless.
    } finally {
      onNext();
    }
  };

  // RTL row order: in LTR we render [secondary | spacer | primary]; in RTL
  // we flip to [primary | spacer | secondary] so the visual leading edge
  // remains the secondary action.
  const hasSecondary = Boolean(step.action && step.actionLabel);
  const secondaryEl = hasSecondary ? (
    <SecondaryButton
      key="sec"
      label={step.actionLabel ?? ''}
      onPress={handleSecondary}
      theme={theme}
    />
  ) : null;
  const primaryEl = (
    <PrimaryButton key="pri" label={step.ctaLabel} onPress={handlePrimary} />
  );
  const orderedButtons = isRTL ? [primaryEl, secondaryEl] : [secondaryEl, primaryEl];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        containerStyle,
        animatedStyle,
        {
          backgroundColor: theme.surface,
          shadowColor: '#000',
        },
      ]}
    >
      {arrowStyle ? <View style={arrowStyle} pointerEvents="none" /> : null}
      <Text style={[styles.title, { color: theme.text, textAlign }]}>{step.title}</Text>
      <Text style={[styles.body, { color: theme.textMuted, textAlign }]}>{step.body}</Text>
      <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {orderedButtons}
      </View>
      {/* `isLastStep` is informational — callers decide their CTA copy
          ("Got it" vs "Next"). We expose it via prop in case future revs
          want to hide the secondary action on the last step. */}
      {isLastStep ? null : null}
    </Animated.View>
  );
}

// ---------- Internal buttons ----------

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        styles.btnPrimary,
        pressed && styles.btnPressed,
      ]}
    >
      <Text style={styles.btnPrimaryLabel}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void | Promise<void>;
  theme: ReturnType<typeof useTheme>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Pressable
      onPress={async () => {
        if (busy) return;
        setBusy(true);
        try {
          await onPress();
        } finally {
          setBusy(false);
        }
      }}
      accessibilityRole="button"
      disabled={busy}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: theme.surfaceMuted },
        pressed && styles.btnPressed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={theme.text} />
      ) : (
        <Text style={[styles.btnSecondaryLabel, { color: theme.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 20,
    borderRadius: 12,
    // Light elevation 6 on Android; matching iOS shadow.
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  row: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  btn: {
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  btnPrimary: {
    backgroundColor: accentDark,
    flexGrow: 1,
  },
  btnPrimaryLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  btnSecondaryLabel: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  btnPressed: {
    opacity: 0.75,
  },
});
