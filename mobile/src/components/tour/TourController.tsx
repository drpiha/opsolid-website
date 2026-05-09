// -----------------------------------------------------------------------
// TourController — internal driver for an active tour. Holds the current
// step index, measures the target with `measureInWindow`, and renders
// SpotlightOverlay + TourCallout. Not exported from the public surface;
// `TourContext` mounts it when `startTour(...)` is called.
//
// Step lifecycle:
//   1. Index changes (or initial mount).
//   2. If the step has a `scrollRef`, request a scroll to the target's
//      approximate position and wait 200ms for the scroll to settle.
//   3. Wait an additional 100ms so layout passes can finish (the parent
//      may be running a navigation animation).
//   4. Call `targetRef.current.measureInWindow(cb)` and store the rect.
//   5. The callout decides its arrow direction from the rect's vertical
//      midpoint relative to the screen.
//
// On Skip / on the last-step CTA we call `firstRunStore.dismissTour(id)`
// and notify the controller's `onComplete` so the context unmounts us.
// -----------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { useFirstRunStore } from '../../store/firstRunStore';
import type { TourDefinition } from '../../lib/tour/types';
import { SpotlightOverlay, type TargetRect } from './SpotlightOverlay';
import { TourCallout } from './TourCallout';

const SCROLL_SETTLE_MS = 200;
const LAYOUT_SETTLE_MS = 100;

type Props = {
  definition: TourDefinition;
  onComplete: () => void;
};

type MeasureMethods = {
  measureInWindow?: (
    cb: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

type ScrollMethods = {
  scrollTo?: (opts: { x?: number; y?: number; animated?: boolean }) => void;
};

export function TourController({ definition, onComplete }: Props) {
  const dismissTour = useFirstRunStore((s) => s.dismissTour);
  const { height: screenH } = useWindowDimensions();

  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  // Bumped every time we start a new measurement. Lets us cancel a stale
  // measure callback if the user advances before the previous one fired.
  const measureToken = useRef(0);

  const step = definition.steps[stepIndex];
  const isLastStep = stepIndex === definition.steps.length - 1;

  // Measure (and optionally scroll) on every step change.
  useEffect(() => {
    if (!step) return;
    const myToken = ++measureToken.current;

    const target = step.targetRef?.current as MeasureMethods | undefined;
    const scroll = step.scrollRef?.current as ScrollMethods | undefined;

    // No target → centered callout, no measurement needed.
    if (!step.targetRef) {
      setTargetRect(null);
      return;
    }

    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    let layoutTimer: ReturnType<typeof setTimeout> | null = null;

    const performMeasure = () => {
      if (myToken !== measureToken.current) return;
      if (!target?.measureInWindow) {
        setTargetRect(null);
        return;
      }
      target.measureInWindow((x, y, width, height) => {
        if (myToken !== measureToken.current) return;
        // Sanity check — RN occasionally returns NaN/0 for unmounted views.
        if (
          !Number.isFinite(x) ||
          !Number.isFinite(y) ||
          width <= 0 ||
          height <= 0
        ) {
          setTargetRect(null);
          return;
        }
        setTargetRect({ x, y, width, height });
      });
    };

    // Try to bring the target into view first. We don't know its absolute
    // y-position yet (we haven't measured), so we do a best-effort double
    // measure: peek at the rect, if it's off-screen scroll, then re-measure.
    if (scroll?.scrollTo && target?.measureInWindow) {
      target.measureInWindow((_x, y, _w, h) => {
        const offTop = y < 0;
        const offBottom = y + h > screenH;
        if (offTop || offBottom) {
          scroll.scrollTo!({ y: Math.max(0, y - 100), animated: true });
          scrollTimer = setTimeout(() => {
            layoutTimer = setTimeout(performMeasure, LAYOUT_SETTLE_MS);
          }, SCROLL_SETTLE_MS);
        } else {
          layoutTimer = setTimeout(performMeasure, LAYOUT_SETTLE_MS);
        }
      });
    } else {
      layoutTimer = setTimeout(performMeasure, LAYOUT_SETTLE_MS);
    }

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      if (layoutTimer) clearTimeout(layoutTimer);
    };
  }, [step, screenH]);

  // ---------- Handlers ----------

  const advance = () => {
    if (isLastStep) {
      dismissTour(definition.tourId);
      onComplete();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const skip = () => {
    dismissTour(definition.tourId);
    onComplete();
  };

  // Decide arrow direction from the measured rect. Centered when no target.
  if (!step) {
    // Defensive — empty definition should never reach us, but bail cleanly.
    return null;
  }

  const position: 'above' | 'below' | 'centered' = (() => {
    if (!step.targetRef || !targetRect) return 'centered';
    const targetMidY = targetRect.y + targetRect.height / 2;
    return targetMidY < screenH / 2 ? 'below' : 'above';
  })();

  // Wait until we either have a rect or determined the step is centered.
  // The SpotlightOverlay still mounts in either case — without a rect the
  // overlay is just a full-screen dim, which is the desired look for a
  // centered welcome step.
  return (
    <SpotlightOverlay visible={true} targetRect={targetRect} onSkip={skip}>
      <TourCallout
        step={step}
        isLastStep={isLastStep}
        position={position}
        targetRect={targetRect}
        onNext={advance}
        onAction={step.action ? async () => { await step.action!(); } : undefined}
      />
    </SpotlightOverlay>
  );
}
