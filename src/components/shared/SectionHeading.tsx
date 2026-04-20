"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small uppercase eyebrow (e.g. "FEATURES"). */
  label?: string;
  /** Big display headline. Inter 800 weight on display size. */
  headline: string;
  /** Optional description body paragraph. */
  description?: string;
  align?: "left" | "center";
  /** Deprecated visual flag — kept for API compat. */
  gradient?: boolean;
  /** Rendered on a dark surface. Flips text colors. */
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
        align === "left" && "max-w-3xl",
        className
      )}
    >
      {label && (
        <div
          className={cn(
            "eyebrow uppercase mb-4",
            dark ? "text-white/60" : "text-ink/60"
          )}
        >
          {label}
        </div>
      )}
      <h2
        className={cn(
          "font-sans font-extrabold text-[clamp(2rem,4.8vw,3.5rem)] leading-[1.02] tracking-[-0.03em] text-balance",
          dark ? "text-white" : "text-ink"
        )}
      >
        {headline}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-body-lg text-pretty leading-relaxed",
            align === "center" ? "mx-auto max-w-2xl" : "",
            dark ? "text-white/70" : "text-ink/60"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
