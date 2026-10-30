import type { CSSProperties, ReactNode } from "react";

/**
 * Entrance: opacity + a short rise, once. CSS-first (src/styles/opsolid-v7-motion.css): a plain
 * transition driven by one tiny IntersectionObserver (RevealObserver) after hydration; no framer-motion. Server component, no state, nothing that can
 * differ between server and client. Reduced motion shows the final state at once (no animation at all).
 * `delay` (seconds) is the stagger inside a list; it is capped so long lists never feel slow.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "p" | "article";
}) {
  const Tag = as;
  const style = { ["--d" as string]: Math.min(delay, 0.24), ["--y" as string]: `${y}px` } as CSSProperties;
  return (
    <Tag data-reveal className={`v7-reveal${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </Tag>
  );
}
