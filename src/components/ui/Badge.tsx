import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "gradient" | "teal" | "accent";
}

export function Badge({ className, variant = "brand", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide uppercase",
        variant === "brand" && "bg-brand-50 text-brand-700",
        variant === "default" && "bg-slate-100 text-slate-600",
        variant === "gradient" && "bg-gradient-to-r from-brand-50 to-teal-50 text-brand-700 border border-brand-100/50",
        variant === "teal" && "bg-teal-50 text-teal-700",
        variant === "accent" && "bg-accent-50 text-accent-700",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
