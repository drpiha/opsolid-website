import type { ReactNode } from "react";
import type { Target } from "@/content/v7/menu";
import { resolveHref } from "@/components/v7/LinkTo";
import type { L3 } from "@/lib/v7-routes";

/** URL of a menu target (page key localized by href(), or a mail link). */
export function targetUrl(t: Target, locale: L3): string {
  return "to" in t ? resolveHref({ label: "", ...t }, locale) : t.href;
}

/**
 * A menu link: a plain anchor for pages (localized URL) and for mail. Marketing pages navigate as documents: no
 * next/link, so its client code (about 11 kB gz, two requests) does not load before the first paint.
 */
export function MenuLink({ to, locale, className, children }: { to: Target; locale: L3; className?: string; children: ReactNode }) {
  return (
    <a href={targetUrl(to, locale)} className={className}>
      {children}
    </a>
  );
}
