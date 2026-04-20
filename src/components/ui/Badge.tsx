import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Editorial palette.
   *  - default:  hairline + ink/muted mono label
   *  - amber:    amber fill on ink text (sparingly, for status)
   *  - olive:    olive-tinted chip
   *  - ink:      solid ink on paper (inverse)
   *  - brand / gradient / teal / accent: legacy aliases, all render as default
   */
  variant?: "default" | "amber" | "olive" | "ink" | "brand" | "gradient" | "teal" | "accent";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 font-mono text-[0.6875rem] tracking-[0.14em] uppercase";

  const palette =
    variant === "amber"
      ? "bg-amber/15 text-amber-700 border border-amber/30"
      : variant === "olive"
      ? "bg-olive/15 text-olive-700 border border-olive/40"
      : variant === "ink"
      ? "bg-ink text-paper"
      : // default + all legacy aliases render as hairline chip
        "border border-ink/15 bg-paper-warm text-ink/70";

  return (
    <span className={cn(base, palette, className)} {...props}>
      {children}
    </span>
  );
}
