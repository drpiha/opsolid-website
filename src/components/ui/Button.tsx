import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white hover:bg-brand-700 shadow-soft hover:shadow-medium active:scale-[0.98]",
        secondary:
          "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-soft active:scale-[0.98]",
        ghost:
          "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
        link:
          "text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline p-0 h-auto",
        gradient:
          "bg-gradient-to-r from-brand-600 via-accent-600 to-teal-500 text-white hover:shadow-glow active:scale-[0.98] bg-[length:200%_200%] animate-gradient-x",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
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
