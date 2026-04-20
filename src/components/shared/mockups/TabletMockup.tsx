"use client";

import { ReactNode } from "react";

interface TabletMockupProps {
  src?: string;
  children?: ReactNode;
  className?: string;
  title?: string;
  loading?: "lazy" | "eager";
  orientation?: "portrait" | "landscape";
}

export function TabletMockup({
  src,
  children,
  className = "",
  title = "Tablet preview",
  loading = "lazy",
  orientation = "landscape",
}: TabletMockupProps) {
  const aspect = orientation === "landscape" ? "aspect-[4/3]" : "aspect-[3/4]";
  const maxW = orientation === "landscape" ? "max-w-[680px]" : "max-w-[510px]";

  return (
    <div
      className={`relative mx-auto w-full ${maxW} ${className}`}
      role={src ? "figure" : undefined}
      aria-label={src ? title : undefined}
    >
      <div
        className={`relative ${aspect} w-full rounded-[1.75rem] bg-ink p-[14px] shadow-[0_35px_70px_-18px_rgba(10,10,10,0.32)]`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.1rem] bg-white">
          {src ? (
            <iframe
              src={src}
              title={title}
              loading={loading}
              sandbox="allow-scripts allow-same-origin allow-popups"
              className="h-full w-full border-0"
            />
          ) : (
            children
          )}
        </div>

        <div className="pointer-events-none absolute top-1/2 right-[5px] h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-neutral-700" />
      </div>
    </div>
  );
}
