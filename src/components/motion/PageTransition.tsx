"use client";

/**
 * PageTransition — passthrough wrapper.
 *
 * Earlier this component toggled between an `<AnimatePresence>`
 * wrapper (for browsers without the View Transitions API) and a
 * `<Fragment>` (for browsers with it), with the decision flipped
 * from inside a useEffect. That state flip swapped the wrapper
 * AFTER initial render, which caused React to unmount the original
 * subtree and re-mount its children — including the Spline canvas
 * on the home page. Spline's WebGL setup doesn't survive that
 * round trip, and the page crashed with React error #482 ("Cannot
 * remove a node that wasn't in this tree").
 *
 * Solution: always return children as-is. Browsers that support the
 * View Transitions API still get native transitions when Next.js's
 * `<Link viewTransition>` opt-in is wired. Browsers without the API
 * navigate without a JS-driven transition, which is acceptable.
 */

export function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
