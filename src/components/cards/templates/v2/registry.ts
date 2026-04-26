// =============================================================================
// v2 Template Registry — single source of truth for the template line-up.
//
// Keyed by `CardOrder.templateId`, the same number that appears in the
// catalog (`src/config/card-templates.ts`) and the Stripe metadata. Three
// call-sites read this:
//
//   1. /c/[slug]/page.tsx        — looks up the component to render.
//   2. OrderFormSection.tsx      — looks up the component for live preview
//                                   and `supports` to show/hide input groups.
//   3. /dev/template-gallery     — iterates the whole record at production size.
//
// Phase 7.1: only id=1 (RealEstate) is wired up. Phase 7.4 batches will append
// the remaining 11 entries below — each Phase-7.4 agent owns disjoint id
// ranges so there are no merge conflicts.
//
// Orders whose `templateId` is missing from this registry fall back to
// SmartCard via `getTemplateEntry` returning undefined — handled in the
// consumers.
// =============================================================================

import { RealEstate } from "./RealEstate";
import { legalCounselEntry } from "./LegalCounsel";
import { kitchenAtelierEntry } from "./KitchenAtelier";
import { photographerEntry } from "./Photographer";
import { clinicEntry } from "./Clinic";
import { studioEntry } from "./Studio";
import { barberEntry } from "./Barber";
import { makerEntry } from "./Maker";
import { architectEntry } from "./Architect";
import { athleteEntry } from "./Athlete";
import { editorialEntry } from "./Editorial";
import { atelierEntry } from "./Atelier";
import { universalEntry } from "./Universal";
// Phase 7.8 — designer-team batch (ids 14-21)
import { restaurantEntry } from "./Restaurant";
import { hotelEntry } from "./Hotel";
import { techStartupEntry } from "./TechStartup";
import { developerEntry } from "./Developer";
import { yogaStudioEntry } from "./YogaStudio";
import { personalTrainerEntry } from "./PersonalTrainer";
import { musicProducerEntry } from "./MusicProducer";
import { weddingPlannerEntry } from "./WeddingPlanner";
import type { TemplateRegistryEntry } from "./types";

export const templateRegistry: Record<number, TemplateRegistryEntry> = {
  1: {
    id: 1,
    key: "real-estate",
    name: "Real Estate",
    industry: "Real estate agent / broker",
    Component: RealEstate,
    supports: {
      services: true,
      faqs: false,
      testimonials: true,
      gallery: false,
      video: false,
      brochure: true,
      socials: true,
      themeSwitch: false,
      photo: true,
      logo: true,
    },
    defaults: {
      brandPrimaryHex: "#1a365d",
      brandAccentHex: "#c8a951",
    },
    sampleSlug: "demo-real-estate",
  },
  2: legalCounselEntry,
  3: kitchenAtelierEntry,
  4: photographerEntry,
  5: clinicEntry,
  6: studioEntry,
  7: barberEntry,
  8: makerEntry,
  9: architectEntry,
  10: athleteEntry,
  11: editorialEntry,
  12: atelierEntry,
  13: universalEntry,
  // Phase 7.8 — designer-team additions (8 sector-tailored designs)
  14: restaurantEntry,
  15: hotelEntry,
  16: techStartupEntry,
  17: developerEntry,
  18: yogaStudioEntry,
  19: personalTrainerEntry,
  20: musicProducerEntry,
  21: weddingPlannerEntry,
};

/**
 * Lookup helper used at every consumer call-site. Returns `undefined` for
 * unknown ids so the caller can fall back to SmartCard gracefully.
 */
export function getTemplateEntry(
  id: number | null | undefined,
): TemplateRegistryEntry | undefined {
  if (id == null) return undefined;
  return templateRegistry[id];
}

// =============================================================================
// Planned line-up — what the Phase 7 carousel renders, regardless of which
// per-template components have shipped yet. Lets the gallery show all 12
// slots from day one; missing components fall through to a "Coming soon"
// placeholder that keeps the carousel visually balanced during dev.
//
// Sector keys map onto the gallery's filter pills. Names are display-only;
// when a registry entry exists for `id`, the carousel reads name + supports
// from there (single source of truth) and ignores the planned-line-up name.
// =============================================================================

export type PlannedSector =
  | "real-estate"
  | "lawyer"
  | "restaurant"
  | "creator"
  | "clinic"
  | "music"
  | "salon"
  | "retail"
  | "architecture"
  | "fitness"
  | "hospitality"
  | "consultant"
  | "tech"
  | "events";

export interface PlannedTemplate {
  id: number;
  key: string;
  name: string;
  sector: PlannedSector;
}

export const plannedLineup: readonly PlannedTemplate[] = [
  { id: 1, key: "real-estate", name: "Real Estate", sector: "real-estate" },
  { id: 2, key: "legal-counsel", name: "Legal Counsel", sector: "lawyer" },
  { id: 3, key: "kitchen-atelier", name: "Kitchen Atelier", sector: "restaurant" },
  { id: 4, key: "photographer", name: "Photographer", sector: "creator" },
  { id: 5, key: "clinic", name: "Clinic", sector: "clinic" },
  { id: 6, key: "studio", name: "Studio", sector: "music" },
  { id: 7, key: "barber", name: "Barber", sector: "salon" },
  { id: 8, key: "maker", name: "Maker", sector: "retail" },
  { id: 9, key: "architect", name: "Architect", sector: "architecture" },
  { id: 10, key: "athlete", name: "Athlete", sector: "fitness" },
  { id: 11, key: "editorial", name: "Editorial", sector: "hospitality" },
  { id: 12, key: "atelier", name: "Atelier", sector: "consultant" },
  { id: 13, key: "universal", name: "Universal Pro", sector: "consultant" },
  // Phase 7.8 — designer-team additions
  { id: 14, key: "restaurant", name: "Trattoria", sector: "restaurant" },
  { id: 15, key: "hotel", name: "Boutique Hotel", sector: "hospitality" },
  { id: 16, key: "tech-startup", name: "Tech Startup", sector: "tech" },
  { id: 17, key: "developer", name: "Developer", sector: "tech" },
  { id: 18, key: "yoga-studio", name: "Yoga Studio", sector: "fitness" },
  { id: 19, key: "personal-trainer", name: "Personal Trainer", sector: "fitness" },
  { id: 20, key: "music-producer", name: "Music Producer", sector: "music" },
  { id: 21, key: "wedding-planner", name: "Wedding Planner", sector: "events" },
];
