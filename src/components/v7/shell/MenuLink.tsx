import Link from "next/link";
import type { ReactNode } from "react";
import type { Target } from "@/content/v7/menu";
import { resolveHref } from "@/components/v7/LinkTo";
import type { L3 } from "@/lib/v7-routes";

/** URL of a menu target (page key localized by href(), or a mail link). */
export function targetUrl(t: Target, locale: L3): string {
  return "to" in t ? resolveHref({ label: "", ...t }, locale) : t.href;
}

/** A menu link: next/link for pages, a plain anchor for mail. */
export function MenuLink({ to, locale, className, children }: { to: Target; locale: L3; className?: string; children: ReactNode }) {
  const url = targetUrl(to, locale);
  if ("to" in to) {
    return (
      <Link href={url} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={url} className={className}>
      {children}
    </a>
  );
}
