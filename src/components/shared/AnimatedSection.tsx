"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Shared reveal hook — one IntersectionObserver per element.         */
/*  Respects prefers-reduced-motion by starting visible.               */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

function useRevealOnView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      setVisible(true);
      return;
    }
    // SSR-safety / older browsers
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "-60px 0px", threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return { ref, visible } as const;
}

const revealClasses =
  "opacity-0 translate-y-2 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none";

/* ------------------------------------------------------------------ */
/*  <AnimatedSection>                                                  */
/* ------------------------------------------------------------------ */

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  style,
  ...rest
}: AnimatedSectionProps) {
  const { ref, visible } = useRevealOnView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      data-visible={visible ? "true" : "false"}
      className={cn(revealClasses, className)}
      style={{
        transitionDelay: reduced ? undefined : `${delay * 1000}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  <StaggerContainer> / <StaggerItem>                                 */
/* ------------------------------------------------------------------ */

interface StaggerContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /** delay between items, in seconds. Defaults to 0.08s. */
  stagger?: number;
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  ...rest
}: StaggerContainerProps) {
  // Inject a sequential `index` prop into direct <StaggerItem> children so
  // they each get a unique transitionDelay without consumers hand-rolling it.
  const enhanced = Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child;
    const childEl = child as ReactElement<{ index?: number; stagger?: number }>;
    if (childEl.props.index !== undefined) return childEl;
    return cloneElement(childEl, { index: i, stagger });
  });

  return (
    <div className={cn(className)} {...rest}>
      {enhanced}
    </div>
  );
}

interface StaggerItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /** Injected by StaggerContainer. Consumers can also pass it explicitly. */
  index?: number;
  stagger?: number;
}

export function StaggerItem({
  children,
  className,
  index = 0,
  stagger = 0.08,
  style,
  ...rest
}: StaggerItemProps) {
  const { ref, visible } = useRevealOnView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      data-visible={visible ? "true" : "false"}
      className={cn(revealClasses, className)}
      style={{
        transitionDelay: reduced ? undefined : `${index * stagger * 1000}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
