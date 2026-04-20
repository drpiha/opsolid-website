import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Popl-style button. Variants:
 *  - primary:   red pill CTA (`.btn-primary`)
 *  - secondary: black pill (`.btn-secondary`)
 *  - ghost:     outlined pill (`.btn-ghost`)
 *  - link:      inline underlined text link
 *
 * Sizes (sm / md / lg) tune the padding + font-size on top of the base
 * `.btn-*` class which already provides the pill radius and layout.
 */
const buttonVariants = cva(
  "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn-primary",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        link: "inline-flex items-center gap-2 underline underline-offset-4 decoration-ink/20 hover:decoration-ink text-ink font-medium",
      },
      size: {
        sm: "text-sm [&.btn-primary]:px-4 [&.btn-primary]:py-2 [&.btn-secondary]:px-4 [&.btn-secondary]:py-2 [&.btn-ghost]:px-4 [&.btn-ghost]:py-2",
        md: "text-sm",
        lg: "text-base [&.btn-primary]:px-7 [&.btn-primary]:py-4 [&.btn-secondary]:px-7 [&.btn-secondary]:py-4 [&.btn-ghost]:px-7 [&.btn-ghost]:py-4",
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
