import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Editorial button. Variants:
 *  - primary:   solid amber on ink (brand CTA)
 *  - secondary: solid ink on paper (inverse, high contrast)
 *  - ghost:     transparent with underline affordance
 *  - link:      inline text link
 *  - gradient:  legacy alias → falls back to primary (no animated gradient)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-amber text-ink hover:bg-amber-600 hover:text-paper",
        secondary: "bg-ink text-paper hover:bg-ink-700",
        ghost:
          "text-ink underline underline-offset-8 decoration-ink/20 decoration-1 hover:decoration-ink bg-transparent px-0",
        link: "text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink p-0 h-auto",
        gradient: "bg-amber text-ink hover:bg-amber-600 hover:text-paper",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
