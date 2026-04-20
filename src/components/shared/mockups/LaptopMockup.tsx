"use client";

import { ReactNode } from "react";

interface LaptopMockupProps {
  src?: string;
  children?: ReactNode;
  className?: string;
  title?: string;
  loading?: "lazy" | "eager";
}

export function LaptopMockup({
  src,
  children,
  className = "",
  title = "Laptop preview",
  loading = "lazy",
}: LaptopMockupProps) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[920px] ${className}`}
      role={src ? "figure" : undefined}
      aria-label={src ? title : undefined}
    >
      <div className="relative aspect-[16/10] w-full rounded-[1.5rem] bg-neutral-900 p-[12px] shadow-[0_40px_80px_-20px_rgba(10,10,10,0.35)]">
        <div className="absolute left-1/2 top-[6px] z-10 h-[10px] w-[70px] -translate-x-1/2 rounded-b-xl bg-neutral-900" />
        <div className="absolute left-1/2 top-[12px] z-20 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-neutral-600" />

        <div className="relative h-full w-full overflow-hidden rounded-[0.9rem] bg-white">
          {src ? (
            <iframe
              src={src}
              title={title}
              loading={loading}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              className="h-full w-full border-0"
            />
          ) : (
            children
          )}
        </div>
      </div>

      <div className="relative -mt-[2px] mx-auto h-[18px] w-[108%] -translate-x-[4%]">
        <div className="absolute inset-x-0 top-0 h-[10px] rounded-b-[10px] bg-gradient-to-b from-neutral-300 to-neutral-400" />
        <div className="absolute left-1/2 top-[2px] h-[5px] w-[110px] -translate-x-1/2 rounded-b-[10px] bg-neutral-500/60" />
        <div className="absolute inset-x-0 top-[10px] h-[6px] rounded-b-[16px] bg-gradient-to-b from-neutral-200 to-neutral-300 shadow-[0_12px_20px_-6px_rgba(10,10,10,0.18)]" />
      </div>
    </div>
  );
}
