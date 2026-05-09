// -----------------------------------------------------------------------
// tour/types — shared type contracts for the first-run coaching marks.
//
// A "tour" is an ordered list of `TourStep`s. Each step optionally targets
// a UI element via a `RefObject` (so we can `measureInWindow` it and draw
// a Spotlight cutout); `targetRef === null` means the step renders as a
// centered modal callout with no spotlight.
//
// The infrastructure here is screen-agnostic — concrete tours
// (`first-card`, `edit-screen`, …) are assembled by the screen that wants
// to coach its first-run user. This file only defines the shapes those
// screens conform to.
// -----------------------------------------------------------------------

import type { RefObject } from 'react';

export type TourId = 'first-card' | 'edit-screen' | 'discover' | 'contacts' | 'sharing';

export type TourStep = {
  /** Stable key for this step — used as React list key when sequencing. */
  key: string;
  /**
   * Element to spotlight. `null` skips the cutout and centers the callout.
   * The ref must be attached to a measurable native view (`View`, `Pressable`,
   * etc.). Functional refs are not supported.
   */
  targetRef: RefObject<unknown> | null;
  title: string;
  body: string;
  /** Primary CTA label. Last step typically uses `Got it` / `Done`. */
  ctaLabel: string;
  /**
   * Optional async side-effect run before advancing. If it throws, the tour
   * still advances — the side-effect is best-effort (e.g. open a sheet).
   */
  action?: () => void | Promise<void>;
  /** Optional secondary button label (e.g. "Show me"). Renders only if `action` is set. */
  actionLabel?: string;
  /**
   * If targetRef is non-null, scroll this ScrollView so the target is visible
   * before measuring. Useful when the target is below the fold on first
   * mount (long settings forms, the edit screen tabs).
   */
  scrollRef?: RefObject<unknown> | null;
};

export type TourDefinition = {
  tourId: TourId;
  steps: TourStep[];
};
