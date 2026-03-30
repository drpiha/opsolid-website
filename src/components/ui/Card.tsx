import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

export function Card({ className, hover = true, glass = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-6 md:p-8",
        glass && "glass-light",
        hover && "transition-all duration-300 hover:shadow-medium hover:border-slate-200 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardIcon({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600",
        className
      )}
    >
      {children}
    </div>
  );
}
