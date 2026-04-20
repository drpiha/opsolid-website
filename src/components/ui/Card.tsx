import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Disable hover lift on the default pop-card surface. */
  hover?: boolean;
  /** Pre-applies the larger `shadow-lifted` resting state. */
  elevated?: boolean;
}

/**
 * Popl/Blinq-style pop-card.
 * - White surface, neutral-200 border, 1.25rem radius
 * - Hover: lift + soft drop shadow (provided by `.pop-card`)
 * - Optional `elevated` variant for feature cards
 */
export function Card({
  className,
  hover = true,
  elevated = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "pop-card p-6 sm:p-8 relative",
        elevated && "shadow-lifted",
        !hover && "hover:shadow-none hover:translate-y-0",
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
 * Neutral outline + ink glyph. The red brand colour is reserved for CTAs.
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
        "flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-ink",
        className
      )}
    >
      {children}
    </div>
  );
}
