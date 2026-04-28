"use client";

// =============================================================================
// TemplateGallery — Phase 7.2 Embla carousel rebuild.
//
// Reads the v2 registry as the source of truth for *visual* slides; pulls
// pricing + billing metadata from the catalog (`card-templates.ts`). Each
// slide renders a *live* component (no static thumbnail), with lazy mounting
// gated to the visible ±1 slide so the up-front cost stays a single template
// render even with the full 12-slot lineup.
//
// Behaviour:
//   - Center-aligned snap, no loop, no autoplay.
//   - Selected slide scales to 1.0 + copper ring; neighbours scale 0.92 +
//     opacity 0.65, interpolated via Embla's per-frame scroll progress so
//     motion feels physics-based instead of stepped.
//   - Arrows reveal on hover (desktop), swipe-only on mobile.
//   - Keyboard ←/→ when the carousel viewport has focus.
//   - Sector filter pills above; all-pill filters back to the full lineup.
//   - Demo button → Radix Dialog at production fidelity (max-w-460 desktop,
//     viewport width on mobile), scrollable, with a footer "Choose this
//     template" CTA that closes the modal, sets selectedTemplateId, and
//     scrolls #order into view.
// =============================================================================

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Eye, X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import {
  formatEuro,
  getTemplateById,
  type CardTemplateDef,
} from "@/config/card-templates";
import {
  plannedLineup,
  templateRegistry,
  type PlannedSector,
  type PlannedTemplate,
} from "@/components/cards/templates/v2/registry";
import type { TemplateRegistryEntry } from "@/components/cards/templates/v2/types";
import { getTemplateSample } from "@/config/card-template-samples";

// -----------------------------------------------------------------------------
// Sector filter — derived from the planned lineup so adding a 13th template
// later only requires a registry entry.
// -----------------------------------------------------------------------------

type SectorKey = "all" | PlannedSector;

const SECTOR_TRANSLATION_KEY: Record<PlannedSector, string> = {
  "real-estate": "sectorRealEstate",
  lawyer: "sectorLawyer",
  restaurant: "sectorRestaurant",
  creator: "sectorCreator",
  clinic: "sectorClinic",
  music: "sectorMusic",
  salon: "sectorSalon",
  retail: "sectorRetail",
  architecture: "sectorArchitecture",
  fitness: "sectorFitness",
  hospitality: "sectorHospitality",
  consultant: "sectorConsultant",
  tech: "sectorTech",
  events: "sectorEvents",
  dentist: "sectorDentist",
  psychologist: "sectorPsychologist",
  beauty: "sectorBeauty",
  accounting: "sectorAccounting",
  software: "sectorSoftware",
  "content-creator": "sectorContentCreator",
  wellness: "sectorWellness",
  "event-planner": "sectorEventPlanner",
  auto: "sectorAuto",
  interior: "sectorInterior",
};

interface SlideModel {
  id: number;
  planned: PlannedTemplate;
  registry?: TemplateRegistryEntry;
  catalog?: CardTemplateDef;
}

function buildSlides(): SlideModel[] {
  return plannedLineup.map((p) => ({
    id: p.id,
    planned: p,
    registry: templateRegistry[p.id],
    catalog: getTemplateById(p.id),
  }));
}

// -----------------------------------------------------------------------------
// Component entry point.
// -----------------------------------------------------------------------------

export function TemplateGallery({
  selectedId,
  onSelect,
}: {
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const { t, locale } = useLocale();
  const order = t.products.digitalCard.order ?? {};
  const labels = (order.gallery ?? {}) as Record<string, string>;
  const L = (key: string, fallback: string) => labels[key] || fallback;

  const allSlides = React.useMemo(buildSlides, []);

  const [sectorFilter, setSectorFilter] = React.useState<SectorKey>("all");
  const slides = React.useMemo(() => {
    if (sectorFilter === "all") return allSlides;
    return allSlides.filter((s) => s.planned.sector === sectorFilter);
  }, [allSlides, sectorFilter]);

  const reducedMotion = useReducedMotion();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    dragFree: true,
    containScroll: "trimSnaps",
    skipSnaps: false,
    duration: 42,
  });

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [slideProgress, setSlideProgress] = React.useState<number[]>([]);
  const [slidesInView, setSlidesInView] = React.useState<Set<number>>(new Set());
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  // Re-init Embla after the slide list shrinks/grows from a sector filter.
  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
  }, [emblaApi, slides.length]);

  // Wire Embla events. `scroll` drives per-slide progress for the physics
  // scale/opacity interpolation; `select` drives the dot indicator + arrow
  // disabled state.
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = (api: EmblaCarouselType) => {
      setSelectedIndex(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    const onScroll = (api: EmblaCarouselType) => {
      const scrollProgress = api.scrollProgress();
      const snaps = api.scrollSnapList();
      // Per-slide normalised distance from the viewport center. Drives the
      // scale + opacity interpolation. loop:false keeps this trivially linear
      // — when we later need loop:true, branch on api.internalEngine().options.loop.
      const next = snaps.map((snap) => snap - scrollProgress);
      setSlideProgress(next);
    };
    const onSlidesInView = (api: EmblaCarouselType) => {
      setSlidesInView(new Set(api.slidesInView()));
    };
    const onReInit = (api: EmblaCarouselType) => {
      setScrollSnaps(api.scrollSnapList());
      onSelect(api);
      onScroll(api);
      onSlidesInView(api);
    };

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    onScroll(emblaApi);
    onSlidesInView(emblaApi);

    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onReInit);
    emblaApi.on("slidesInView", onSlidesInView);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onReInit);
      emblaApi.off("slidesInView", onSlidesInView);
    };
  }, [emblaApi]);

  // Keyboard navigation when the viewport (or any slide) has focus.
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!emblaApi) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      }
    },
    [emblaApi],
  );

  // Demo modal state — keyed by slide id so opening another closes the prior.
  const [demoOpenId, setDemoOpenId] = React.useState<number | null>(null);

  // Phase 7.7 — visual cue when the customer has come back here from the
  // order form's "Change template" affordance: a copper banner above the
  // sector pills tells them what's expected next.
  const [selectionMode, setSelectionMode] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setSelectionMode(true);
    window.addEventListener("enter-template-selection", handler);
    return () => window.removeEventListener("enter-template-selection", handler);
  }, []);

  const handleSelect = (id: number) => {
    onSelect(id);
    setSelectionMode(false);
    // Phase 7.7 — once the customer picks a template, drop them into the
    // order form so they don't have to hunt for the next step.
    setTimeout(() => {
      document
        .getElementById("order")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleChooseFromDemo = (id: number) => {
    onSelect(id);
    setDemoOpenId(null);
    setSelectionMode(false);
    // Defer scroll so the modal close animation isn't fighting the scroll.
    requestAnimationFrame(() => {
      const target = document.getElementById("order");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  return (
    <section id="templates" className="relative py-16 md:py-24">
      <div className="container-wide">
        {/* Heading row */}
        <div className="mb-8 flex flex-col gap-2 md:mb-12">
          <span className="mono-label text-[11px] text-ink/45">
            {String(slides.length).padStart(2, "0")} —{" "}
            {String(allSlides.length).padStart(2, "0")}
          </span>
          <h2 className="font-serif text-display-sm text-ink md:text-display-md">
            {L("title", "Choose a design")}
          </h2>
          <p className="mt-1 max-w-xl text-body text-ink/60">
            {L("subtitle", "Browse the line-up and preview any template.")}
          </p>
        </div>

        {/* Phase 7.7 — selection-mode banner. Only renders when the customer
            arrives via the order form's "Change template" button so it never
            distracts a fresh visitor. */}
        {selectionMode && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-copper/40 bg-copper/10 px-4 py-1.5 text-xs font-semibold text-copper">
            <span className="h-2 w-2 animate-ping rounded-full bg-copper" />
            {L("selectionModeLabel", "Select your design")}
          </div>
        )}

        {/* Sector filter pills — refined: rounded-full, hairline borders, mono-label uppercase. */}
        <SectorPills
          slides={allSlides}
          active={sectorFilter}
          onChange={setSectorFilter}
          allLabel={L("sectorAll", "All")}
          labelFor={(sec) =>
            L(SECTOR_TRANSLATION_KEY[sec], sec.replace(/^[a-z]/, (c) => c.toUpperCase()))
          }
        />

        {/* Carousel viewport */}
        <div
          className="group/gallery relative mt-10 outline-none focus:outline-none"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-roledescription="carousel"
          aria-label={L("title", "Template gallery")}
        >
          <div ref={emblaRef} className="overflow-hidden">
            <div className="-ml-4 flex md:-ml-8">
              {slides.map((slide, index) => {
                const progress = slideProgress[index] ?? 0;
                return (
                  <CarouselSlide
                    key={slide.id}
                    slide={slide}
                    index={index}
                    isSelected={index === selectedIndex}
                    progress={progress}
                    inView={
                      slidesInView.has(index) ||
                      Math.abs(index - selectedIndex) <= 1
                    }
                    locale={locale}
                    isPicked={selectedId === slide.id}
                    selectLabel={L("selectCta", "Pick this design")}
                    selectedLabel={L("selected", "Selected")}
                    demoLabel={L("demoCta", "Demo")}
                    fromLabel={L("fromPrice", "from")}
                    monthlyShort={L("monthlyShort", "/mo")}
                    comingSoonLabel={L("comingSoon", "Coming soon")}
                    comingSoonHint={L("comingSoonHint", "On the way.")}
                    sectorLabel={L(
                      SECTOR_TRANSLATION_KEY[slide.planned.sector],
                      slide.planned.sector,
                    )}
                    onPick={() => handleSelect(slide.id)}
                    onDemo={() => setDemoOpenId(slide.id)}
                    onCenter={() => emblaApi?.scrollTo(index)}
                    reducedMotion={!!reducedMotion}
                  />
                );
              })}
            </div>
          </div>

          {/* Hover-revealed arrow buttons. Hidden on touch devices via the
              .group-hover/gallery selector + below-md hard-hide. */}
          <ArrowButton
            direction="prev"
            disabled={!canPrev}
            label={L("prevSlide", "Previous design")}
            onClick={() => emblaApi?.scrollPrev()}
          />
          <ArrowButton
            direction="next"
            disabled={!canNext}
            label={L("nextSlide", "Next design")}
            onClick={() => emblaApi?.scrollNext()}
          />
        </div>

        {/* Dot indicator */}
        <DotIndicator
          count={scrollSnaps.length}
          activeIndex={selectedIndex}
          onSelect={(i) => emblaApi?.scrollTo(i)}
        />

        {/* Live region for screen readers */}
        <p className="sr-only" aria-live="polite">
          {L("slideOf", "{{current}} of {{total}}")
            .replace("{{current}}", String(selectedIndex + 1))
            .replace("{{total}}", String(scrollSnaps.length))}
        </p>
      </div>

      {/* Demo modal — single instance, body driven by demoOpenId. */}
      <DemoModal
        slide={slides.find((s) => s.id === demoOpenId) ?? null}
        open={demoOpenId !== null}
        locale={locale}
        chooseLabel={L("demoModalChoose", "Choose this template")}
        backLabel={L("demoModalBack", "Back to gallery")}
        comingSoonLabel={L("comingSoon", "Coming soon")}
        comingSoonHint={L("comingSoonHint", "On the way.")}
        onClose={() => setDemoOpenId(null)}
        onChoose={handleChooseFromDemo}
      />
    </section>
  );
}

// =============================================================================
// SectorPills — rounded-full hairline pills, mono-label uppercase.
// =============================================================================

function SectorPills({
  slides,
  active,
  onChange,
  allLabel,
  labelFor,
}: {
  slides: SlideModel[];
  active: SectorKey;
  onChange: (key: SectorKey) => void;
  allLabel: string;
  labelFor: (sector: PlannedSector) => string;
}) {
  // Derive sector keys from the available slides; preserves planned-lineup order.
  const sectors = React.useMemo(() => {
    const seen = new Set<PlannedSector>();
    const out: PlannedSector[] = [];
    for (const s of slides) {
      if (!seen.has(s.planned.sector)) {
        seen.add(s.planned.sector);
        out.push(s.planned.sector);
      }
    }
    return out;
  }, [slides]);

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:px-0">
      <Pill
        active={active === "all"}
        label={allLabel}
        onClick={() => onChange("all")}
      />
      {sectors.map((sec) => (
        <Pill
          key={sec}
          active={active === sec}
          label={labelFor(sec)}
          onClick={() => onChange(sec)}
        />
      ))}
    </div>
  );
}

function Pill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative shrink-0 snap-start rounded-full px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-all duration-200 ${
        active
          ? "border border-copper/55 bg-copper/15 text-ink shadow-[0_1px_0_rgba(194,121,64,0.35)_inset,0_8px_22px_-12px_rgba(194,121,64,0.45)]"
          : "border border-ink/12 bg-bg-1/60 text-ink/55 hover:border-ink/25 hover:text-ink/90"
      }`}
      aria-pressed={active}
    >
      <span className="relative z-10">{label}</span>
    </button>
  );
}

// =============================================================================
// Arrow buttons — hover-reveal on desktop, hidden on touch.
// =============================================================================

function ArrowButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  const positionClass =
    direction === "prev"
      ? "left-2 lg:-left-2"
      : "right-2 lg:-right-2";

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`hidden md:flex absolute top-1/2 z-20 ${positionClass} h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-bg-0/95 text-ink shadow-[0_18px_36px_-22px_rgba(15,15,15,0.45)] backdrop-blur-md transition-all duration-200 hover:scale-[1.04] hover:border-copper/55 hover:bg-bg-0 hover:text-copper disabled:pointer-events-none disabled:opacity-25 opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100`}
    >
      <Icon size={18} strokeWidth={1.8} />
    </button>
  );
}

// =============================================================================
// DotIndicator
// =============================================================================

function DotIndicator({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  if (count === 0) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Slide ${i + 1}`}
            className={`relative h-1.5 transition-all duration-300 ease-out ${
              active
                ? "w-7 rounded-full bg-copper"
                : "w-1.5 rounded-full bg-ink/15 hover:bg-ink/30"
            }`}
          />
        );
      })}
    </div>
  );
}

// =============================================================================
// CarouselSlide — single slide. Renders the live template at half-scale OR a
// graceful "coming soon" placeholder when the registry entry is missing.
// =============================================================================

const CarouselSlide = React.memo(function CarouselSlide({
  slide,
  isSelected,
  progress,
  inView,
  locale,
  isPicked,
  selectLabel,
  selectedLabel,
  demoLabel,
  fromLabel,
  monthlyShort,
  comingSoonLabel,
  comingSoonHint,
  sectorLabel,
  onPick,
  onDemo,
  onCenter: _onCenter,
  reducedMotion,
}: {
  slide: SlideModel;
  index: number;
  isSelected: boolean;
  progress: number;
  inView: boolean;
  locale: "de" | "en" | "tr";
  isPicked: boolean;
  selectLabel: string;
  selectedLabel: string;
  demoLabel: string;
  fromLabel: string;
  monthlyShort: string;
  comingSoonLabel: string;
  comingSoonHint: string;
  sectorLabel: string;
  onPick: () => void;
  onDemo: () => void;
  onCenter: () => void;
  reducedMotion: boolean;
}) {
  // Physics-based scale/opacity from progress (0 = at center, ±1 = neighbour).
  // tween() smooths the absolute distance with a small ease.
  const distance = Math.min(1, Math.abs(progress));
  const scale   = reducedMotion ? 1 : 1 - 0.18 * distance; // 1.0 → 0.82
  const opacity = reducedMotion ? 1 : 1 - 0.48 * distance; // 1.0 → 0.52
  const rotateY = reducedMotion ? 0 : progress * 28;        // ±28° at neighbours

  const hasComponent = !!slide.registry;
  const hasSample = !!getTemplateSample(slide.id);

  const monthly = slide.catalog?.monthlyCents;
  const oneTime = slide.catalog?.oneTimeCents;
  const priceLine = monthly
    ? `${formatEuro(monthly, currencyLocale(locale))}${monthlyShort}`
    : oneTime
      ? `${fromLabel} ${formatEuro(oneTime, currencyLocale(locale))}`
      : "";

  return (
    <div
      className="relative shrink-0 grow-0 basis-[78%] pl-4 sm:basis-[58%] md:basis-[42%] md:pl-8 lg:basis-[34%] xl:basis-[28%]"
      role="group"
      aria-roledescription="slide"
      aria-label={slide.registry?.name ?? slide.planned.name}
    >
      <motion.div
        animate={{ scale, opacity, rotateY }}
        transition={{ type: "spring", stiffness: 180, damping: 40, mass: 0.9 }}
        style={{ transformOrigin: "center center", perspective: 1200 }}
        className="flex flex-col items-stretch"
      >
        {/* Sector eyebrow */}
        <div className="mb-3 flex items-center justify-between gap-2 px-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
            {sectorLabel}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/35">
            #{String(slide.id).padStart(2, "0")}
          </span>
        </div>

        {/* Frame */}
        <button
          type="button"
          onClick={onDemo}
          aria-label={`Preview ${slide.registry?.name ?? slide.planned.name}`}
          className={`group/frame relative mx-auto block w-full overflow-hidden rounded-[28px] bg-bg-1 transition-all duration-500 ease-out ${
            isSelected
              ? "ring-2 ring-copper/65 ring-offset-2 ring-offset-bg-0 shadow-[0_28px_60px_-26px_rgba(15,15,15,0.45),0_8px_22px_-12px_rgba(194,121,64,0.35)]"
              : "ring-1 ring-ink/10 shadow-[0_14px_36px_-22px_rgba(15,15,15,0.35)]"
          }`}
        >
          <div className="relative aspect-[460/820] w-full overflow-hidden">
            {hasComponent && hasSample && inView ? (
              <LiveTemplatePreview slide={slide} locale={locale} />
            ) : hasComponent && inView ? (
              <PlaceholderSkeleton
                title={slide.registry?.name ?? slide.planned.name}
                subtitle={comingSoonHint}
                badge={comingSoonLabel}
              />
            ) : !hasComponent ? (
              <PlaceholderSkeleton
                title={slide.planned.name}
                subtitle={comingSoonHint}
                badge={comingSoonLabel}
              />
            ) : (
              // In-view but not yet ready — render a quiet skeleton so the slot
              // is reserved without a visual jump.
              <SlideSkeleton />
            )}

            {/* Subtle inner gloss, anchors the frame visually. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-black/5"
            />
          </div>
        </button>

        {/* Footer — name, price, demo, select. */}
        <div className="mt-5 flex items-end justify-between gap-3 px-1">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-[18px] leading-tight text-ink">
              {slide.registry?.name ?? slide.planned.name}
            </h3>
            {priceLine && (
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/55">
                {priceLine}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDemo();
              }}
              disabled={!hasComponent}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-bg-0 px-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/75 transition-colors hover:border-ink/35 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Eye size={12} strokeWidth={2} />
              {demoLabel}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPick();
              }}
              disabled={!hasComponent}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-all duration-200 ${
                isPicked
                  ? "border border-copper/55 bg-copper text-ink shadow-[0_8px_22px_-10px_rgba(194,121,64,0.65)]"
                  : "bg-neutral-900 text-neutral-50 hover:-translate-y-px hover:shadow-[0_10px_22px_-12px_rgba(15,15,15,0.55)]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {isPicked ? (
                <>
                  <Check size={12} strokeWidth={3} />
                  {selectedLabel}
                </>
              ) : (
                <>{selectLabel}</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// -----------------------------------------------------------------------------
// LiveTemplatePreview — renders the registry component at a CSS-scaled half
// size. Uses CSS transform: scale(0.5) on the inner article and a fixed-aspect
// outer frame so the surrounding layout stays predictable.
// -----------------------------------------------------------------------------

function LiveTemplatePreview({
  slide,
  locale,
}: {
  slide: SlideModel;
  locale: "de" | "en" | "tr";
}) {
  const sample = getTemplateSample(slide.id);
  const Component = slide.registry?.Component;

  // Measure the outer frame so the inner template renders at its full design
  // width (460px) and gets scaled to fit. ResizeObserver keeps things tight
  // through breakpoint shifts and the carousel's snap re-flow.
  const outerRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(0.46);

  React.useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / 460);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!sample || !Component) return null;

  return (
    <div
      ref={outerRef}
      className="absolute inset-0 flex items-start justify-center bg-gradient-to-b from-bg-1 to-bg-0"
    >
      <div
        className="pointer-events-none"
        style={{
          width: 460,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
        aria-hidden
      >
        <Component
          slug={sample.slug}
          cardData={sample.cardData}
          locale={locale}
          photoPath={sample.photoUrl ?? null}
          logoPath={sample.logoUrl ?? null}
          brandPrimaryHex={sample.brandPrimaryHex ?? null}
          brandAccentHex={sample.brandAccentHex ?? null}
          siteUrl="https://opsolid.de"
        />
      </div>
    </div>
  );
}

function PlaceholderSkeleton({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 18% 12%, rgba(232,162,82,0.18), transparent 55%), linear-gradient(165deg, #FAF6EF 0%, #ECE6D8 100%)",
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-copper/50 bg-copper/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/75">
        {badge}
      </span>
      <h4 className="relative z-10 max-w-[16ch] font-serif text-[20px] leading-tight text-ink/85">
        {title}
      </h4>
      <p className="relative z-10 max-w-[22ch] text-[12px] text-ink/55">
        {subtitle}
      </p>
      <span
        aria-hidden
        className="relative z-10 mt-1 block h-px w-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232,162,82,0.65), transparent)",
        }}
      />
    </div>
  );
}

function SlideSkeleton() {
  return (
    <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-bg-1 to-bg-0" />
  );
}

// =============================================================================
// DemoModal — Radix Dialog. Production-fidelity render + sticky footer.
// =============================================================================

function DemoModal({
  slide,
  open,
  locale,
  chooseLabel,
  backLabel,
  comingSoonLabel,
  comingSoonHint,
  onClose,
  onChoose,
}: {
  slide: SlideModel | null;
  open: boolean;
  locale: "de" | "en" | "tr";
  chooseLabel: string;
  backLabel: string;
  comingSoonLabel: string;
  comingSoonHint: string;
  onClose: () => void;
  onChoose: (id: number) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-neutral-950/70 backdrop-blur-md data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
        <Dialog.Content
          className="fixed inset-0 z-[81] flex flex-col outline-none focus:outline-none data-[state=open]:animate-modal-in data-[state=closed]:animate-modal-out"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-8 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white"
            >
              <ArrowLeft size={12} strokeWidth={2} />
              {backLabel}
            </button>
            <Dialog.Title className="font-serif text-[16px] text-white/90">
              {slide?.registry?.name ?? slide?.planned.name ?? ""}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={backLabel}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/85 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </Dialog.Close>
          </div>

          {/* Scroll body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto w-full max-w-[460px]">
              {slide && slide.registry && getTemplateSample(slide.id) ? (
                <DemoLiveRender slide={slide} locale={locale} />
              ) : slide ? (
                <div className="rounded-[28px] border border-white/15 bg-bg-1 p-12 text-center shadow-[0_60px_120px_-50px_rgba(0,0,0,0.55)]">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-copper/45 bg-copper/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/75">
                    {comingSoonLabel}
                  </span>
                  <h3 className="mt-6 font-serif text-display-sm text-ink">
                    {slide.planned.name}
                  </h3>
                  <p className="mt-3 text-body text-ink/65">
                    {comingSoonHint}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Sticky footer */}
          <div className="border-t border-white/10 bg-neutral-950/85 px-4 py-4 backdrop-blur-md sm:px-8 sm:py-5">
            <div className="mx-auto flex w-full max-w-[460px] items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white/90"
              >
                {backLabel}
              </button>
              <button
                type="button"
                disabled={!slide?.registry}
                onClick={() => slide && onChoose(slide.id)}
                className="inline-flex items-center gap-2 rounded-full bg-copper px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink shadow-[0_12px_28px_-14px_rgba(194,121,64,0.85)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_18px_36px_-16px_rgba(194,121,64,0.85)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check size={13} strokeWidth={2.4} />
                {chooseLabel}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DemoLiveRender({
  slide,
  locale,
}: {
  slide: SlideModel;
  locale: "de" | "en" | "tr";
}) {
  const sample = getTemplateSample(slide.id);
  const Component = slide.registry?.Component;
  if (!sample || !Component) return null;
  return (
    <Component
      slug={sample.slug}
      cardData={sample.cardData}
      locale={locale}
      photoPath={sample.photoUrl ?? null}
      logoPath={sample.logoUrl ?? null}
      brandPrimaryHex={sample.brandPrimaryHex ?? null}
      brandAccentHex={sample.brandAccentHex ?? null}
      siteUrl="https://opsolid.de"
    />
  );
}

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

function currencyLocale(locale: string): string {
  if (locale === "de") return "de-DE";
  if (locale === "tr") return "tr-TR";
  return "en-DE";
}
