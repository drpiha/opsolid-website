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
import { legalCounselEntry, LegalCounsel } from "./LegalCounsel";
import { kitchenAtelierEntry, KitchenAtelier } from "./KitchenAtelier";
import { photographerEntry, Photographer } from "./Photographer";
import { clinicEntry, Clinic } from "./Clinic";
import { studioEntry, Studio } from "./Studio";
import { barberEntry, Barber } from "./Barber";
import { makerEntry, Maker } from "./Maker";
import { architectEntry, Architect } from "./Architect";
import { athleteEntry, Athlete } from "./Athlete";
import { editorialEntry, Editorial } from "./Editorial";
import { atelierEntry, Atelier } from "./Atelier";
import { universalEntry, Universal } from "./Universal";
// Phase 7.8 — designer-team batch (ids 14-21)
import { restaurantEntry, Restaurant } from "./Restaurant";
import { hotelEntry, Hotel } from "./Hotel";
import { techStartupEntry, TechStartup } from "./TechStartup";
import { developerEntry, Developer } from "./Developer";
import { yogaStudioEntry, YogaStudio } from "./YogaStudio";
import { personalTrainerEntry, PersonalTrainer } from "./PersonalTrainer";
import { musicProducerEntry, MusicProducer } from "./MusicProducer";
import { weddingPlannerEntry, WeddingPlanner } from "./WeddingPlanner";
// Phase 7.10 Batch A — Dentist, Psychologist, Beauty (ids 22-30)
import { dentistEntry, Dentist } from "./Dentist";
import { dentistPureEntry, DentistPure } from "./DentistPure";
import { dentistVividEntry, DentistVivid } from "./DentistVivid";
import { psychologistEntry, Psychologist } from "./Psychologist";
import { psychologistPureEntry, PsychologistPure } from "./PsychologistPure";
import { psychologistVividEntry, PsychologistVivid } from "./PsychologistVivid";
import { beautySalonEntry, BeautySalon } from "./BeautySalon";
import { beautySalonNoirEntry, BeautySalonNoir } from "./BeautySalonNoir";
import { beautySalonPureEntry, BeautySalonPure } from "./BeautySalonPure";
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
  // Each entry spreads the template's own metadata but overrides Component
  // with a direct named import so the Next.js RSC bundler can trace a stable
  // module reference (e.g. LegalCounsel.tsx#LegalCounsel). Without this,
  // the runtime cannot locate the component in the React Client Manifest.
  2: { ...legalCounselEntry, Component: LegalCounsel },
  3: { ...kitchenAtelierEntry, Component: KitchenAtelier },
  4: { ...photographerEntry, Component: Photographer },
  5: { ...clinicEntry, Component: Clinic },
  6: { ...studioEntry, Component: Studio },
  7: { ...barberEntry, Component: Barber },
  8: { ...makerEntry, Component: Maker },
  9: { ...architectEntry, Component: Architect },
  10: { ...athleteEntry, Component: Athlete },
  11: { ...editorialEntry, Component: Editorial },
  12: { ...atelierEntry, Component: Atelier },
  13: { ...universalEntry, Component: Universal },
  // Phase 7.8 — designer-team additions (8 sector-tailored designs)
  14: { ...restaurantEntry, Component: Restaurant },
  15: { ...hotelEntry, Component: Hotel },
  16: { ...techStartupEntry, Component: TechStartup },
  17: { ...developerEntry, Component: Developer },
  18: { ...yogaStudioEntry, Component: YogaStudio },
  19: { ...personalTrainerEntry, Component: PersonalTrainer },
  20: { ...musicProducerEntry, Component: MusicProducer },
  21: { ...weddingPlannerEntry, Component: WeddingPlanner },
  // Phase 7.10 Batch A — Dentist · Psychologist · Beauty (3 sectors × 3 styles)
  22: { ...dentistEntry, Component: Dentist },
  23: { ...dentistPureEntry, Component: DentistPure },
  24: { ...dentistVividEntry, Component: DentistVivid },
  25: { ...psychologistEntry, Component: Psychologist },
  26: { ...psychologistPureEntry, Component: PsychologistPure },
  27: { ...psychologistVividEntry, Component: PsychologistVivid },
  28: { ...beautySalonEntry, Component: BeautySalon },
  29: { ...beautySalonNoirEntry, Component: BeautySalonNoir },
  30: { ...beautySalonPureEntry, Component: BeautySalonPure },
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
  | "events"
  | "dentist"
  | "psychologist"
  | "beauty";

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
  // Phase 7.10 Batch A
  { id: 22, key: "dentist", name: "Dentist", sector: "dentist" },
  { id: 23, key: "dentist-pure", name: "Dentist — Pure", sector: "dentist" },
  { id: 24, key: "dentist-vivid", name: "Dentist — Vivid", sector: "dentist" },
  { id: 25, key: "psychologist", name: "Psychologist", sector: "psychologist" },
  { id: 26, key: "psychologist-pure", name: "Psychologist — Pure", sector: "psychologist" },
  { id: 27, key: "psychologist-vivid", name: "Psychologist — Vivid", sector: "psychologist" },
  { id: 28, key: "beauty-salon", name: "Beauty Salon", sector: "beauty" },
  { id: 29, key: "beauty-salon-noir", name: "Beauty Salon — Noir", sector: "beauty" },
  { id: 30, key: "beauty-salon-pure", name: "Beauty Salon — Pure", sector: "beauty" },
];
