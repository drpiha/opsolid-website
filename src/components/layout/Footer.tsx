"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isV4Path } from "@/lib/v4";

// The app-surface footer (FxToggle, LocaleLink) is its own chunk, fetched only where it renders.
const AppFooter = dynamic(() => import("./AppFooter").then((m) => m.AppFooter), { ssr: true });

/** Marketing paths render the `marketing` slot (components/v7/shell/SiteFooter, server-rendered); app surfaces keep the old one. */
export function Footer({ marketing }: { marketing?: ReactNode }) {
  const pathname = usePathname();
  if (isV4Path(pathname) && marketing) return <>{marketing}</>;
  return <AppFooter />;
}
