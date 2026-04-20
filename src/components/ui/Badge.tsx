import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Popl-style pills:
   *  - default:  soft neutral trust pill
   *  - success:  green status pill
   *  - accent:   red brand pill (use sparingly)
   *  - ink:      solid black inverse
   *  - amber / olive / brand / gradient / teal: legacy aliases → default
   */
  variant?:
    | "default"
    | "success"
    | "accent"
    | "ink"
    | "amber"
    | "olive"
    | "brand"
    | "gradient"
    | "teal";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold";

  const palette =
    variant === "success"
      ? "bg-green-50 text-green-700"
      : variant === "accent"
      ? "bg-brand/10 text-brand"
      : variant === "ink"
      ? "bg-ink text-white"
      : // default + all legacy aliases → neutral trust pill
        "bg-neutral-100 text-ink/70";

  return (
    <span className={cn(base, palette, className)} {...props}>
      {children}
    </span>
  );
}
