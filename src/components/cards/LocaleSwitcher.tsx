"use client";

// Faz 6.7 B4 — Visitor-side language toggle for public card pages.
// Pushes ?lang=<code> into the URL without a full navigation (scroll: false),
// which lets the Next.js server component re-render with the new locale while
// the visitor stays at the same scroll position.

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const LANGS = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
] as const;

interface Props {
  current: "de" | "en" | "tr";
  /** Accessible group label, passed as a localized string from the server. */
  ariaLabel?: string;
}

export function LocaleSwitcher({ current, ariaLabel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setLang = (code: "de" | "en" | "tr") => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("lang", code);
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel ?? "Language"}
      className="inline-flex items-center gap-0.5 rounded-full border border-ink/15 bg-white/70 p-0.5 text-[11px] font-mono uppercase tracking-wider backdrop-blur-sm"
    >
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-current={code === current ? "true" : undefined}
          className={[
            // Minimum 44px touch target achieved via min-w + py combination.
            // px-3 py-2 gives each button ~48px wide on average across 3 codes.
            "min-w-[44px] rounded-full px-3 py-2 transition-colors",
            code === current
              ? "bg-ink text-bg-0 shadow-sm"
              : "text-ink/55 hover:text-ink",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
