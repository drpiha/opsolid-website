import type { ReactNode } from "react";
import type { Href } from "@/content/v7/types";
import { href as pageHref, type L3 } from "@/lib/v7-routes";

/** Resolves an Href (page key or raw mailto:/tel:) to a URL string. */
export function resolveHref(link: Href, locale: L3): string {
  if (!("to" in link)) return link.href;
  const url = pageHref(link.to, locale, { sub: link.sub });
  const query = link.query && Object.keys(link.query).length ? `?${new URLSearchParams(link.query).toString()}` : "";
  return `${url}${query}${link.hash ? `#${link.hash}` : ""}`;
}

/**
 * A link to a v7 page by key (localized automatically) or a raw mailto:/tel: href. Children default to the label.
 * A plain anchor: marketing pages navigate as documents (no next/link client code before the first paint).
 */
export function LinkTo({ link, locale, className, children }: { link: Href; locale: L3; className?: string; children?: ReactNode }) {
  const url = resolveHref(link, locale);
  const external = !("to" in link) && url.startsWith("https://");
  return (
    <a href={url} className={className} {...(external ? { rel: "noopener noreferrer" } : {})}>
      {children ?? link.label}
    </a>
  );
}
