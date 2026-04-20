"use client";

import { useEffect, useState } from "react";
import { IPhoneMockup } from "@/components/shared/mockups";
import { X, ExternalLink, Eye } from "lucide-react";

interface Demo {
  id: string;
  src: string;
  name: string;
  industry: string;
  category: "industry" | "layout";
  accent?: string;
}

const INDUSTRY_DEMOS: Demo[] = [
  { id: "emlak",    category: "industry", src: "/demos/business-card/industry/kart_01_emlak.html",    name: "Mehmet Karaca",  industry: "Real Estate",   accent: "#1E3A8A" },
  { id: "avukat",   category: "industry", src: "/demos/business-card/industry/kart_02_avukat.html",   name: "Attorney at Law", industry: "Legal",         accent: "#0F172A" },
  { id: "restoran", category: "industry", src: "/demos/business-card/industry/kart_03_restoran.html", name: "Chef Barış",      industry: "Restaurant",    accent: "#4D7C0F" },
  { id: "fotograf", category: "industry", src: "/demos/business-card/industry/kart_04_fotograf.html", name: "Photo Studio",    industry: "Photography",   accent: "#78716C" },
  { id: "doktor",   category: "industry", src: "/demos/business-card/industry/kart_05_doktor.html",   name: "Dr. Ayşe Demir",  industry: "Clinic",        accent: "#0D9488" },
  { id: "dj",       category: "industry", src: "/demos/business-card/industry/kart_06_dj.html",       name: "DJ Volkan",       industry: "Music / Events", accent: "#DC2626" },
  { id: "berber",   category: "industry", src: "/demos/business-card/industry/kart_07_berber.html",   name: "Classic Barber",  industry: "Barber / Salon", accent: "#292524" },
  { id: "eticaret", category: "industry", src: "/demos/business-card/industry/kart_08_eticaret.html", name: "ZK Handmade",     industry: "E-commerce",    accent: "#EA580C" },
  { id: "mimar",    category: "industry", src: "/demos/business-card/industry/kart_09_mimar.html",    name: "Architect Studio", industry: "Architecture", accent: "#57534E" },
  { id: "fitness",  category: "industry", src: "/demos/business-card/industry/kart_10_fitness.html",  name: "Peak Fitness",    industry: "Fitness",       accent: "#EA580C" },
];

const LAYOUT_DEMOS: Demo[] = [
  { id: "v01", category: "layout", src: "/demos/business-card/layouts/v01_profesyonel.html", name: "Professional", industry: "Corporate" },
  { id: "v02", category: "layout", src: "/demos/business-card/layouts/v02_elegant.html",     name: "Elegant",      industry: "Serif / Editorial" },
  { id: "v03", category: "layout", src: "/demos/business-card/layouts/v03_galeri.html",      name: "Gallery",      industry: "Visual Portfolio" },
  { id: "v04", category: "layout", src: "/demos/business-card/layouts/v04_bold.html",        name: "Bold",         industry: "High Contrast" },
  { id: "v05", category: "layout", src: "/demos/business-card/layouts/v05_dinamik.html",     name: "Dynamic",      industry: "Dark / Animated" },
  { id: "v06", category: "layout", src: "/demos/business-card/layouts/v06_kurumsal.html",    name: "Corporate",    industry: "Institutional" },
  { id: "v07", category: "layout", src: "/demos/business-card/layouts/v07_temiz.html",       name: "Clean",        industry: "Minimalist" },
  { id: "v08", category: "layout", src: "/demos/business-card/layouts/v08_modern.html",      name: "Modern",       industry: "Contemporary" },
  { id: "v09", category: "layout", src: "/demos/business-card/layouts/v09_vitrin.html",      name: "Showcase",     industry: "Storefront" },
  { id: "v10", category: "layout", src: "/demos/business-card/layouts/v10_minimal.html",     name: "Minimal",      industry: "Neutral / Manrope" },
];

const ALL_DEMOS = [...INDUSTRY_DEMOS, ...LAYOUT_DEMOS];

type Filter = "all" | "industry" | "layout";

interface DemoGalleryProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  openLabel?: string;
  filterAll?: string;
  filterIndustry?: string;
  filterLayout?: string;
}

export function DemoGallery({
  title = "10 industry templates + 10 layouts",
  subtitle = "Live previews — click any card to open a full-size interactive demo.",
  ctaLabel = "Customize this template",
  openLabel = "Open full preview",
  filterAll = "All",
  filterIndustry = "Industry",
  filterLayout = "Layout",
}: DemoGalleryProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Demo | null>(null);

  const filtered =
    filter === "all" ? ALL_DEMOS : ALL_DEMOS.filter((d) => d.category === filter);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section aria-labelledby="demo-gallery-heading" className="section-sm">
      <div className="container-wide">
        <div className="mb-10 md:mb-12 max-w-2xl">
          <h2
            id="demo-gallery-heading"
            className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
          >
            {title}
          </h2>
          <p className="mt-3 text-ink/65 text-body leading-relaxed">{subtitle}</p>
        </div>

        <div role="tablist" aria-label="Filter demos" className="mb-8 flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all" as Filter, label: filterAll, count: ALL_DEMOS.length },
              { id: "industry" as Filter, label: filterIndustry, count: INDUSTRY_DEMOS.length },
              { id: "layout" as Filter, label: filterLayout, count: LAYOUT_DEMOS.length },
            ]
          ).map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f.id
                  ? "bg-ink text-white"
                  : "bg-neutral-100 text-ink/70 hover:bg-neutral-200"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-60">{f.count}</span>
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {filtered.map((demo, i) => (
            <li key={demo.id}>
              <button
                onClick={() => setOpen(demo)}
                className="group block w-full text-left"
                aria-label={`${openLabel}: ${demo.name}`}
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 md:p-6 transition-shadow duration-300 group-hover:shadow-lifted border border-neutral-200/60">
                  <div className="pointer-events-none transition-transform duration-500 group-hover:scale-[1.03]">
                    <IPhoneMockup
                      src={demo.src}
                      title={`${demo.name} — ${demo.industry}`}
                      loading={i < 4 ? "eager" : "lazy"}
                      scale="sm"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-end justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-ink/20 via-transparent to-transparent">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-4 py-2 text-xs font-semibold text-ink shadow-lifted">
                      <Eye size={14} />
                      {openLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{demo.name}</p>
                    <p className="text-xs text-ink/55 truncate">{demo.industry}</p>
                  </div>
                  <span className="trust-pill shrink-0 text-[10px]">
                    {demo.category === "industry" ? filterIndustry : filterLayout}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${open.name} — ${open.industry}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative w-full max-w-[420px] md:max-w-[460px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white text-base font-bold truncate">{open.name}</p>
                <p className="text-white/60 text-xs">{open.industry}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={open.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white text-xs font-semibold transition"
                  aria-label="Open in new tab"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => setOpen(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <IPhoneMockup
              src={open.src}
              title={`${open.name} — ${open.industry}`}
              loading="eager"
              scale="lg"
            />

            <div className="mt-5 flex justify-center">
              <a href="/contact" className="btn-primary text-sm">
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export { INDUSTRY_DEMOS, LAYOUT_DEMOS, ALL_DEMOS };
export type { Demo };
