"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { SITE_CONFIG, FOOTER_LINKS } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

/**
 * Small editorial hex logo for the dark footer context.
 * Amber ring + paper-tinted inner cage for visibility on `bg-ink`.
 */
function FooterHex({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path
        d="M16 2L28.5 9.5V24.5L16 30L3.5 24.5V9.5L16 2Z"
        stroke="#E8A252"
        strokeWidth="1.75"
        fill="none"
      />
      <path
        d="M16 8L23 12V22L16 26L9 22V12L16 8Z"
        stroke="#F4EFE6"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M9 12L16 16L23 12" stroke="#F4EFE6" strokeOpacity="0.45" strokeWidth="1.25" fill="none" />
      <path d="M16 16V26" stroke="#F4EFE6" strokeOpacity="0.45" strokeWidth="1.25" fill="none" />
    </svg>
  );
}

type LinkColumnProps = {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
  labelMap: Record<string, string>;
};

function LinkColumn({ title, links, labelMap }: LinkColumnProps) {
  return (
    <div>
      <h4 className="mono-label text-paper/60 mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-paper/80 hover:text-amber transition-colors"
            >
              {labelMap[link.href] || link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { t } = useLocale();
  const ft = t.footer;

  // Map hrefs to localized labels (same approach as Header)
  const linkLabels: Record<string, string> = {
    "/solutions": t.nav.solutions,
    "/products": t.nav.products,
    "/products/kutasia": "Kutasia",
    "/products/digital-card": "Digital Business Card",
    "/use-cases": t.nav.useCases,
    "/blog": t.nav.blog,
    "/faq": t.nav.faq,
    "/about": t.nav.about,
    "/contact": t.nav.contact,
    "/impressum": t.impressum.title,
    "/privacy": t.privacy.title,
  };

  // Top link columns (exclude legal — legal goes in the bottom bar)
  const columns: Array<{ key: string; title: string; links: ReadonlyArray<{ label: string; href: string }> }> = [
    { key: "company", title: ft.company, links: FOOTER_LINKS.company },
    { key: "services", title: ft.services, links: FOOTER_LINKS.services },
    { key: "products", title: ft.products, links: FOOTER_LINKS.products },
    { key: "resources", title: ft.resources, links: FOOTER_LINKS.resources },
  ];

  return (
    <footer className="relative bg-ink text-paper paper-grain">
      <div className="container-wide py-16 md:py-20">
        {/* Top: brand block + 4 link columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-serif text-xl leading-none text-paper tracking-[-0.01em]"
            >
              <FooterHex size={28} />
              <span>{SITE_CONFIG.name}</span>
            </Link>
            <p className="mono-label text-paper/55 mt-4">
              AUTOMATION STUDIO &middot; HAMBURG, DE
            </p>
            <p className="mt-4 text-sm text-paper/70 leading-relaxed max-w-xs text-pretty">
              {ft.description}
            </p>
          </div>

          {columns.map((col) => (
            <LinkColumn
              key={col.key}
              title={col.title}
              links={col.links}
              labelMap={linkLabels}
            />
          ))}
        </div>

        {/* Bottom bar: copyright + legal links */}
        <div className="mt-14 pt-6 border-t border-paper/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="mono-label text-paper/45">{ft.copyright}</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="mono-label text-paper/60 hover:text-amber transition-colors"
                >
                  {linkLabels[link.href] || link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
