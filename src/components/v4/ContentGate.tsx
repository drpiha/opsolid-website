"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { needsContentBundle } from "@/lib/v4";

// The full content bundle is ~220 kB gzipped. Marketing routes (v4) do not need it,
// so it is only fetched when an app surface (dashboard, onboarding, legal, …) renders.
const ContentProvider = dynamic(() => import("@/context/ContentProvider").then((m) => m.ContentProvider), { ssr: true });

export function ContentGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!needsContentBundle(pathname)) return <>{children}</>;
  return <ContentProvider>{children}</ContentProvider>;
}
