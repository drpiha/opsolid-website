import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import type { ApiCard } from '../../lib/api/types';
import { useTileSize, CardDeckTile } from './CardDeckTile';

const MAX_LAYERS = 4;
const FAN_GAP = 16;

type Props = {
  /** Cards in display order. Index 0 = top of stack (most-recently edited). */
  cards: ApiCard[];
};

/**
 * Stacked-deck container with collapse/fan toggle.
 *
 * Top 4 cards render as visual layers. When `cards.length > 4` we still only
 * render 4 layers but show a "+N" badge on the bottom-most layer so the user
 * sees the deck depth.
 *
 * Tapping the top card toggles between collapsed (stacked, scaled, dimmed)
 * and fanned (vertical list with full-size tiles separated by 16pt). All
 * per-card transforms interpolate from a single `isFanned` shared value
 * driven by `withSpring(0|1)` — keeps the worklet count low and the
 * animation cohesive.
 *
 * Mount stagger: each layer's translateY+opacity animates from offset/0 to
 * its resting value with `withDelay(i*60, …)` so the deck feels like cards
 * being dealt onto the table.
 */
export function CardDeck({ cards }: Props) {
  const { width: tileW, height: tileH } = useTileSize();

  const isFanned = useSharedValue(0);
  // Plain React mirror of isFanned so we can drive native `pointerEvents`
  // without animatedProps (RN dispatches Android touches in render-tree order,
  // not visual zIndex — without this, taps on the visually-top card hit the
  // last-rendered Pressable underneath).
  const [fanned, setFanned] = useState(false);

  // Per-slot mount-stagger shared values. Reanimated requires hooks to be
  // declared at top level (no loops), so we manually unroll the 4 slots.
  const dY0 = useSharedValue(40);
  const dY1 = useSharedValue(40);
  const dY2 = useSharedValue(40);
  const dY3 = useSharedValue(40);
  const dO0 = useSharedValue(0);
  const dO1 = useSharedValue(0);
  const dO2 = useSharedValue(0);
  const dO3 = useSharedValue(0);

  const startedMountAnim = useRef(false);

  useEffect(() => {
    // Run mount-stagger once. Re-renders from prop changes shouldn't replay
    // the deal-in animation.
    if (startedMountAnim.current) return;
    startedMountAnim.current = true;

    const ys = [dY0, dY1, dY2, dY3];
    const os = [dO0, dO1, dO2, dO3];
    for (let i = 0; i < MAX_LAYERS; i++) {
      ys[i].value = withDelay(i * 60, withSpring(0, { damping: 18, stiffness: 180 }));
      os[i].value = withDelay(i * 60, withTiming(1, { duration: 300 }));
    }
  }, [dY0, dY1, dY2, dY3, dO0, dO1, dO2, dO3]);

  const visibleLayers = useMemo(() => cards.slice(0, MAX_LAYERS), [cards]);
  const overflowCount = Math.max(0, cards.length - MAX_LAYERS);

  // Container expands when fanned to fit all visible layers as a vertical list.
  const collapsedContainerH = tileH + (Math.min(MAX_LAYERS, visibleLayers.length) - 1) * 10 + 40;
  const fannedContainerH = visibleLayers.length * (tileH + FAN_GAP) + 16;

  const containerHeight = useDerivedValue(() =>
    interpolate(
      isFanned.value,
      [0, 1],
      [collapsedContainerH, fannedContainerH],
      Extrapolation.CLAMP,
    ),
  );

  const containerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
  }));

  function toggleFan() {
    setFanned((prev) => {
      const next = !prev;
      isFanned.value = withSpring(next ? 1 : 0, {
        damping: 18,
        stiffness: 160,
      });
      return next;
    });
  }

  const dYs = [dY0, dY1, dY2, dY3];
  const dOs = [dO0, dO1, dO2, dO3];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.container, { width: tileW }, containerStyle]}>
        {visibleLayers.map((card, i) => (
          <DeckLayer
            key={card.id}
            index={i}
            card={card}
            tileH={tileH}
            isFanned={isFanned}
            fanned={fanned}
            mountTranslate={dYs[i]}
            mountOpacity={dOs[i]}
            badge={
              i === Math.min(MAX_LAYERS - 1, visibleLayers.length - 1) && overflowCount > 0
                ? `+${overflowCount > 9 ? '9+' : overflowCount}`
                : null
            }
            onPressTop={toggleFan}
          />
        ))}
      </Animated.View>
    </ScrollView>
  );
}

type DeckLayerProps = {
  index: number;
  card: ApiCard;
  tileH: number;
  isFanned: SharedValue<number>;
  fanned: boolean;
  mountTranslate: SharedValue<number>;
  mountOpacity: SharedValue<number>;
  badge: string | null;
  onPressTop: () => void;
};

/**
 * One stacked layer. All transforms interpolate from `isFanned` (0 = stacked,
 * 1 = fanned). Z-index is fixed (top card = highest). Behind-card scale +
 * opacity fade out smoothly when fanning so the layer reaches full size.
 */
function DeckLayer({
  index,
  card,
  tileH,
  isFanned,
  fanned,
  mountTranslate,
  mountOpacity,
  badge,
  onPressTop,
}: DeckLayerProps) {
  // Stacked-state offsets per the spec
  const stackedTranslateY = index * 10;
  const stackedTranslateX = index * 7;
  const stackedScale = 1 - index * 0.04;
  const stackedOpacity = 1 - index * 0.15;

  // Fanned: vertical list, full-size tiles
  const fannedTranslateY = index * (tileH + FAN_GAP);
  const fannedScale = 1;
  const fannedOpacity = 1;

  const animStyle = useAnimatedStyle(() => {
    const ty = interpolate(
      isFanned.value,
      [0, 1],
      [stackedTranslateY, fannedTranslateY],
      Extrapolation.CLAMP,
    );
    const tx = interpolate(
      isFanned.value,
      [0, 1],
      [stackedTranslateX, 0],
      Extrapolation.CLAMP,
    );
    const sc = interpolate(
      isFanned.value,
      [0, 1],
      [stackedScale, fannedScale],
      Extrapolation.CLAMP,
    );
    const op = interpolate(
      isFanned.value,
      [0, 1],
      [stackedOpacity, fannedOpacity],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateY: ty + mountTranslate.value },
        { translateX: tx },
        { scale: sc },
      ],
      opacity: op * mountOpacity.value,
    };
  });

  // Stacked: only the top card is touchable (lower layers are visually buried
  // and would otherwise steal taps via Android render-tree dispatch). Fanned:
  // every layer is its own tap target.
  const layerPointerEvents: 'box-none' | 'none' =
    index === 0 || fanned ? 'box-none' : 'none';

  return (
    <Animated.View
      style={[
        styles.layer,
        { zIndex: MAX_LAYERS - index },
        animStyle,
      ]}
      pointerEvents={layerPointerEvents}
    >
      <CardDeckTile
        card={card}
        badge={badge}
        showShadow={index === 0}
        // Top card toggles fan; non-top cards navigate when fanned, no-op
        // when collapsed (visually buried — the top card is the touch target).
        onPress={index === 0 ? onPressTop : undefined}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  container: {
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
