"use client";

import { ReactNode } from "react";

interface IPhoneMockupProps {
  src?: string;
  children?: ReactNode;
  className?: string;
  title?: string;
  loading?: "lazy" | "eager";
  scale?: "sm" | "md" | "lg";
}

const scaleMap = {
  sm: "max-w-[220px]",
  md: "max-w-[320px]",
  lg: "max-w-[420px]",
};

export function IPhoneMockup({
  src,
  children,
  className = "",
  title = "Phone preview",
  loading = "lazy",
  scale = "md",
}: IPhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto w-full ${scaleMap[scale]} ${className}`}
      role={src ? "figure" : undefined}
      aria-label={src ? title : undefined}
    >
      <div className="relative aspect-[9/19.5] w-full drop-shadow-[0_30px_60px_rgba(10,10,10,0.28)]">
        <div className="relative h-full w-full rounded-[2.5rem] bg-ink p-[10px]">
          <div className="absolute left-1/2 top-[14px] z-20 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-ink-900" />
          <div className="absolute right-[-3px] top-[130px] h-[70px] w-[3px] rounded-l bg-neutral-700" />
          <div className="absolute left-[-3px] top-[110px] h-[32px] w-[3px] rounded-r bg-neutral-700" />
          <div className="absolute left-[-3px] top-[160px] h-[56px] w-[3px] rounded-r bg-neutral-700" />
          <div className="absolute left-[-3px] top-[230px] h-[56px] w-[3px] rounded-r bg-neutral-700" />

          <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-white">
            {src ? (
              <iframe
                src={src}
                title={title}
                loading={loading}
                sandbox="allow-scripts allow-same-origin allow-popups"
                className="h-full w-full border-0"
                scrolling="no"
              />
            ) : (
              children
            )}
          </div>

          <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-10 h-[4px] w-[110px] -translate-x-1/2 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
