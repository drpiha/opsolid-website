"use client";

/**
 * PillarGrid — the four practices we offer, in plain language. Sits
 * immediately below the home hero. Replaces the old workflow-canvas
 * card stack so the home page never leads with tool names ("Power
 * Automate", "Make", "n8n") — those belong on the service detail pages.
 *
 * Each pillar deep-links to its existing service page (`/leistungen/...`
 * compatible slugs are reused: `prozessautomatisierung`, `interne-tools`,
 * `ki-beratung`, `ki-schulungen`).
 */

import { useLocale } from "@/context/LocaleContext";
import { getV2Content } from "@/content/v2";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  Workflow,
  Wrench,
  Brain,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  prozessautomatisierung: Workflow,
  "interne-tools": Wrench,
  "ki-beratung": Brain,
  "ki-schulungen": GraduationCap,
};

type PillarItem = {
  slug: string;
  label: string;
  sub: string;
};

export function PillarGrid() {
  const { locale } = useLocale();
  const c = getV2Content(locale);
  const data = c.home.pillars;
  const items = data.items as unknown as PillarItem[];

  return (
    <section className="v2-pillars">
      <div className="wrap v2-pillars__head">
        <span className="v2-pillars__eyebrow">{data.eyebrow}</span>
        <h2 className="v2-pillars__headline">{data.headline}</h2>
      </div>
      <div className="wrap v2-pillars__grid">
        {items.map((item, i) => {
          const Icon = PILLAR_ICONS[item.slug] ?? Workflow;
          return (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="v2-pillar"
              data-cursor="link"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="v2-pillar__index">{`0${i + 1}`}</span>
              <span className="v2-pillar__icon" aria-hidden="true">
                <Icon size={26} strokeWidth={1.5} />
              </span>
              <h3 className="v2-pillar__label">{item.label}</h3>
              <p className="v2-pillar__sub">{item.sub}</p>
              <span className="v2-pillar__cta">{data.cardCta}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
