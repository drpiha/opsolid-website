"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { SITE_CONFIG, FOOTER_LINKS } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

/**
 * Small hex logo rendered on the dark footer surface.
 * White outer frame + red inner cage stays readable on ink.
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
        stroke="#FFFFFF"
        strokeWidth="1.75"
        fill="none"
      />
      <path
        d="M16 8L23 12V22L16 26L9 22V12L16 8Z"
        stroke="#E63946"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M9 12L16 16L23 12" stroke="#E63946" strokeOpacity="0.85" strokeWidth="1.25" fill="none" />
      <path d="M16 16V26" stroke="#E63946" strokeOpacity="0.85" strokeWidth="1.25" fill="none" />
    </svg>
  );
}

/** Inline X / Twitter glyph — Lucide has no 2023 X mark. */
function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Inline LinkedIn glyph — lucide-react in this project doesn't export it. */
function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Inline GitHub glyph — lucide-react in this project doesn't export it. */
function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
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
      <h4 className="eyebrow text-white/50 uppercase mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
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
    <footer className="relative bg-ink text-white">
      <div className="container-wide py-16 md:py-20">
        {/* Top: brand block + 4 link columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-extrabold leading-none text-white tracking-[-0.02em]"
            >
              <FooterHex size={28} />
              <span>{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-xs text-pretty">
              {ft.description}
            </p>
            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <XIcon size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LinkedinIcon size={17} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <GithubIcon size={17} />
              </a>
            </div>
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
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs font-medium text-white/50">{ft.copyright}</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-medium text-white/60 hover:text-white transition-colors"
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
