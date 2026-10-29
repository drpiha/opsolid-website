"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Entrance: opacity + 16 px rise, 500 ms, once. `initial` is constant (hydration-safe); reduced motion
 * only shortens the duration to 0, so the final state is shown at once.
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
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}
