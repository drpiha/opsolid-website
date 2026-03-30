"use client";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  headline: string;
  description?: string;
  align?: "left" | "center";
  gradient?: boolean;
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  headline,
  description,
  align = "center",
  gradient = false,
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center mx-auto max-w-3xl",
        align === "left" && "max-w-2xl",
        className
      )}
    >
      {label && (
        <Badge variant={dark ? "gradient" : "brand"} className="mb-4">
          {label}
        </Badge>
      )}
      <h2
        className={cn(
          "text-heading-lg md:text-display-sm font-bold text-balance",
          gradient ? "gradient-text-vibrant" : dark ? "text-white" : "text-slate-900"
        )}
      >
        {headline}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-body-lg text-balance",
            dark ? "text-slate-300" : "text-slate-500"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
