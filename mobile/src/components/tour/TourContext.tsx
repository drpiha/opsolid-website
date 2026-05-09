// -----------------------------------------------------------------------
// TourContext — public surface of the coaching-mark system.
//
// Wrap the app once with `<TourProvider>`. Screens fire `useTour().startTour(definition)`
// whenever their first-run condition holds; the provider checks
// `firstRunStore.seenTours[def.tourId]` and short-circuits when the user
// has already seen (or skipped) that tour.
//
// Only one tour runs at a time. A second `startTour` call while one is
// active is a no-op — the screen should re-trigger after the user
// completes the current tour.
// -----------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useFirstRunStore } from '../../store/firstRunStore';
import type { TourDefinition } from '../../lib/tour/types';
import { TourController } from './TourController';

type TourContextValue = {
  startTour: (def: TourDefinition) => void;
  dismissCurrentTour: () => void;
  isActive: boolean;
};

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const seenTours = useFirstRunStore((s) => s.seenTours);
  const hydrated = useFirstRunStore((s) => s.hydrated);
  const [active, setActive] = useState<TourDefinition | null>(null);

  const startTour = useCallback(
    (def: TourDefinition) => {
      // If the user already saw this tour, do nothing. We require hydration
      // before allowing a tour to start — the persisted "seen" map might
      // still be loading and we don't want to flash a tour we're about to
      // dismiss anyway.
      if (!hydrated) return;
      if (seenTours[def.tourId]) return;
      // One at a time.
      if (active) return;
      // Empty definition guard.
      if (!def.steps.length) return;
      setActive(def);
    },
    [hydrated, seenTours, active],
  );

  const dismissCurrentTour = useCallback(() => {
    setActive(null);
  }, []);

  const value = useMemo<TourContextValue>(
    () => ({
      startTour,
      dismissCurrentTour,
      isActive: active !== null,
    }),
    [startTour, dismissCurrentTour, active],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {active ? (
        <TourController
          definition={active}
          onComplete={() => setActive(null)}
        />
      ) : null}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error('useTour must be used within a <TourProvider>.');
  }
  return ctx;
}
