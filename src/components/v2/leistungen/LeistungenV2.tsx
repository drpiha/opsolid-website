"use client";

/**
 * LeistungenV2 — M2 redesign for /leistungen. Activated by `?preview=v2`.
 *
 * Composition (per docs/redesign-prompt.md §Leistungen):
 *   - Horizontal service rail. Five cards in a single row spanning full
 *     viewport width. Each card: 2-word label, index 01-05, monochrome
 *     Lucide icon on light gray tile.
 *   - Below: brief manifesto paragraph.
 *
 * Motion:
 *   - Desktop: GSAP ScrollTrigger pins the section and translates the rail
 *     horizontally as the user scrolls vertically through it. Drag-scroll
 *     also wired.
 *   - Mobile (<900px): pin disabled (forbidden under spec §7), cards stack
 *     vertically.
 *   - Reduced-motion: no pin, no translate, cards just lay out as flex row
 *     that scrolls naturally if it overflows (browser default).
 */

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getV2Content } from "@/content/v2";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  Brain,
  Workflow,
  LayoutGrid,
  Wrench,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "ki-beratung": Brain,
  prozessautomatisierung: Workflow,
  "microsoft-365-automatisierung": LayoutGrid,
  "interne-tools": Wrench,
  "ki-schulungen": GraduationCap,
};

type ServiceCard = {
  index: string;
  slug: string;
  label: string;
  sub: string;
};

export function LeistungenV2() {
  const { locale } = useLocale();
  const c = getV2Content(locale);
  const data = c.leistungen;
  const services = data.services as unknown as ServiceCard[];

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [enableHorizontalScroll, setEnableHorizontalScroll] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 899px)").matches) return;
    setEnableHorizontalScroll(true);
  }, []);

  useEffect(() => {
    if (!enableHorizontalScroll) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let trigger: ScrollTrigger | null = null;

    // Wait one frame so layout settles before measuring.
    const id = requestAnimationFrame(() => {
      const distance = track.scrollWidth - window.innerWidth + 80;
      if (distance <= 0) return; // rail fits — no pin needed

      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
      });

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${distance + 100}`,
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        animation: tween,
        invalidateOnRefresh: true,
      });
    });

    return () => {
      cancelAnimationFrame(id);
      trigger?.kill();
    };
  }, [enableHorizontalScroll]);

  return (
    <section ref={sectionRef} className="v2-rail">
      <div className="wrap v2-rail__head">
        <span className="v2-rail__eyebrow">{data.eyebrow}</span>
        <h1 className="v2-rail__headline">{data.headline}</h1>
      </div>

      <div className="wrap v2-rail__track-wrap">
        <div ref={trackRef} className="v2-rail__track">
          {services.map((s) => {
            const Icon = SERVICE_ICONS[s.slug] ?? Workflow;
            return (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="v2-rail__card"
                data-cursor="link"
              >
                <span className="v2-rail__card-index">{s.index}</span>
                <span className="v2-rail__card-icon" aria-hidden="true">
                  <Icon size={26} strokeWidth={1.5} />
                </span>
                <h2 className="v2-rail__card-label">{s.label}</h2>
                <p className="v2-rail__card-sub">{s.sub}</p>
                <span className="v2-rail__card-arrow">Open</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="wrap">
        <p className="v2-rail__manifesto">{data.manifesto}</p>
      </div>
    </section>
  );
}
