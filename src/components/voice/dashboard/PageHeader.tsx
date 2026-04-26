/**
 * PageHeader — consistent title block used at the top of every dashboard
 * page. Server-component-safe (no hooks), but accepts arbitrary children
 * for the trailing action slot.
 */

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 pb-8 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className="meta text-[10px] text-copper-300">{eyebrow}</span>
        )}
        <h1 className="font-display text-[26px] font-medium leading-tight tracking-tight text-ink md:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-[13px] leading-relaxed text-ink-300">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
