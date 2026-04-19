"use client";

import Link, { type LinkProps } from "next/link";
import { forwardRef } from "react";
import { useLocale } from "@/context/LocaleContext";
import { withLocale } from "@/lib/i18n";

type LocaleLinkProps = Omit<LinkProps, "href"> & {
  href: string;
  children?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

/**
 * Drop-in replacement for next/link that automatically prefixes internal paths
 * with the active locale. External URLs (http://, https://, mailto:, tel:, #anchor)
 * are passed through unchanged.
 */
export const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(
  function LocaleLink({ href, children, ...props }, ref) {
    const { locale } = useLocale();
    const isExternal =
      /^https?:\/\//i.test(href) ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#");

    const finalHref = isExternal ? href : withLocale(href, locale);

    return (
      <Link href={finalHref} ref={ref} {...props}>
        {children}
      </Link>
    );
  }
);
