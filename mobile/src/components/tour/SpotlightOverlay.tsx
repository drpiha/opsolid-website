// -----------------------------------------------------------------------
// SpotlightOverlay — full-screen Modal that dims the UI and (optionally)
// punches a rounded-rectangle hole over the target rect to draw attention
// to one element.
//
// The cutout is drawn with `react-native-svg` using the standard
// `<Defs><Mask>` trick: we render a black full-screen `<Rect>` masked by
// "white = visible". White paints the dim everywhere; a transparent
// rectangle inside the mask "erases" pixels back to fully transparent at
// the cutout. RN-SVG composites the result on top of a semi-transparent
// view so the underlying screen shows through where we cut.
//
// Why a Modal: it floats above any tab bar / header / native navigator
// without us having to plumb absolute z-index through the layout. Modals
// also intercept the Android back button by default — we override that
// to call `onSkip` (otherwise users could trap themselves behind the
// overlay).
// -----------------------------------------------------------------------

import { type ReactNode } from 'react';
import {
  I18nManager,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, Mask, Rect as SvgRect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslations, detectLocale } from '../../lib/i18n/locale';

export type TargetRect = { x: number; y: number; width: number; height: number };

type Props = {
  visible: boolean;
  /** Where to cut the spotlight hole. `null` = no cutout, just dim. */
  targetRect: TargetRect | null;
  /** Tapping the dim area or the skip-link calls this. */
  onSkip: () => void;
  /** The TourCallout (or any positioned overlay child). */
  children: ReactNode;
};

const PADDING = 4;
const RADIUS = 12;
const BACKDROP_ALPHA = 0.7;

export function SpotlightOverlay({ visible, targetRect, onSkip, children }: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const t = useTranslations(detectLocale());

  // RTL: place the skip-link on the leading (right-in-LTR, left-in-RTL) edge.
  const skipPosition = I18nManager.isRTL
    ? { left: 16, top: insets.top + 12 }
    : { right: 16, top: insets.top + 12 };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onSkip}
    >
      {/* Tap-anywhere-to-dismiss layer — sits behind the SVG so the cutout
          interaction model is "tap outside the highlighted thing → next/skip". */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.tour.skip}
        onPress={onSkip}
        style={StyleSheet.absoluteFill}
      >
        {targetRect ? (
          <Svg
            width={screenW}
            height={screenH}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Defs>
              <Mask id="spotlight-mask" x={0} y={0} width={screenW} height={screenH}>
                {/* white = paint the dim overlay */}
                <SvgRect x={0} y={0} width={screenW} height={screenH} fill="white" />
                {/* black = erase the dim, revealing the underlying UI */}
                <SvgRect
                  x={Math.max(0, targetRect.x - PADDING)}
                  y={Math.max(0, targetRect.y - PADDING)}
                  width={Math.max(0, targetRect.width + PADDING * 2)}
                  height={Math.max(0, targetRect.height + PADDING * 2)}
                  rx={RADIUS}
                  ry={RADIUS}
                  fill="black"
                />
              </Mask>
            </Defs>
            <SvgRect
              x={0}
              y={0}
              width={screenW}
              height={screenH}
              fill={`rgba(0,0,0,${BACKDROP_ALPHA})`}
              mask="url(#spotlight-mask)"
            />
          </Svg>
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: `rgba(0,0,0,${BACKDROP_ALPHA})` },
            ]}
            pointerEvents="none"
          />
        )}
      </Pressable>

      {/* Skip link — sits ABOVE the dim layer so it's always tappable. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.tour.skip}
        onPress={onSkip}
        hitSlop={12}
        style={[styles.skip, skipPosition]}
      >
        <Text style={styles.skipText}>{t.tour.skip}</Text>
      </Pressable>

      {/* Callout layer — children position themselves absolutely. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  skip: {
    position: 'absolute',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
