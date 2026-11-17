"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isV4Path } from "@/lib/v4";

// The app-surface header (account menu, auth state, next/link) is its own chunk, fetched only where it renders, so
// marketing pages do not download it.
const AppHeader = dynamic(() => import("./AppHeader").then((m) => m.AppHeader), { ssr: true });

/**
 * Marketing paths (isV4Path) render the `marketing` slot: the server-rendered Werkstatt header
 * (components/v7/shell/SiteHeader), built in the locale layout; app surfaces keep theirs. The decision follows the
 * client pathname so a soft navigation between the two kinds swaps the header.
 */
export function Header({ marketing }: { marketing?: ReactNode }) {
  const pathname = usePathname();
  if (isV4Path(pathname) && marketing) return <>{marketing}</>;
  return <AppHeader />;
}
