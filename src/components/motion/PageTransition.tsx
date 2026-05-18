"use client";

/**
 * PageTransition — View Transitions API when available, Framer Motion
 * AnimatePresence as fallback.
 *
 * - Supported browsers (Chromium 111+): native view transitions; this
 *   component returns children as-is and the browser does the work.
 * - Fallback: opacity + small Y nudge, ≤320ms, `mech` easing.
 * - Reduced-motion: opacity-only crossfade, ≤180ms, linear easing. No
 *   transform.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [supportsViewTransitions, setSupportsViewTransitions] = useState(false);

  useEffect(() => {
    setSupportsViewTransitions(
      typeof document !== "undefined" && "startViewTransition" in document
    );
  }, []);

  // Native View Transitions handle the animation themselves once Next 14's
  // <Link viewTransition> opt-in is wired (M2+). Skip the JS fallback to
  // avoid double-animating.
  if (supportsViewTransitions) return <>{children}</>;

  if (prefersReduced) {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "linear" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
