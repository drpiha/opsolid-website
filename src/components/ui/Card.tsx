import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** If true, apply subtle hover affordance (border shift + slight lift). */
  hover?: boolean;
  /**
   * Deprecated. Previously enabled a glass / backdrop-blur surface.
   * Kept as a no-op alias of the default surface so existing call sites
   * continue to type-check while M3+ migrates off it.
   */
  glass?: boolean;
}

/**
 * Editorial bento card.
 * - Hairline border + paper-warm surface
 * - Generous padding, 2xl radius
 * - Hover: amber-tinted border + 0.5px lift
 * - No drop shadow, no backdrop blur, no gradient fills
 */
export function Card({
  className,
  hover = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  glass = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink/10 bg-paper-warm p-6 sm:p-8 relative",
        hover &&
          "transition duration-300 hover:border-amber/60 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Small square badge for a card-header icon.
 * Uses the hairline + ink style — no gradient fill, no glow.
 */
export function CardIcon({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-paper text-ink",
        className
      )}
    >
      {children}
    </div>
  );
}
