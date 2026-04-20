"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Mono-label eyebrow (e.g. "WHAT WE DO"). */
  label?: string;
  /** Instrument-serif headline. */
  headline: string;
  /** Optional description body paragraph. */
  description?: string;
  align?: "left" | "center";
  /** Deprecated visual flag — kept for API compat, rendered as ink. */
  gradient?: boolean;
  /** Rendered on a dark surface (WhyUs / CTA). Flips text colors. */
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  headline,
  description,
  align = "center",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center mx-auto max-w-3xl",
        align === "left" && "max-w-2xl",
        className
      )}
    >
      {label && (
        <div
          className={cn(
            "mono-label mb-4",
            dark ? "text-paper/60" : "text-ink/60"
          )}
        >
          {label}
        </div>
      )}
      <h2
        className={cn(
          "font-serif text-[clamp(1.875rem,4.5vw,3rem)] leading-[1.08] tracking-[-0.02em] text-balance",
          dark ? "text-paper" : "text-ink"
        )}
      >
        {headline}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-body-lg text-pretty leading-relaxed",
            dark ? "text-paper/70" : "text-ink/70"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
