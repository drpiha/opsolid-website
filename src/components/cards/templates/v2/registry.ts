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
// Phase 7.10 Batch B — Accounting, Software, Content Creator (ids 31-39)
import { accountingEntry, Accounting } from "./Accounting";
import { accountingNoirEntry, AccountingNoir } from "./AccountingNoir";
import { accountingPureEntry, AccountingPure } from "./AccountingPure";
import { softwareDevEntry, SoftwareDev } from "./SoftwareDev";
import { softwareDevPureEntry, SoftwareDevPure } from "./SoftwareDevPure";
import { softwareDevVividEntry, SoftwareDevVivid } from "./SoftwareDevVivid";
import { contentCreatorEntry, ContentCreator } from "./ContentCreator";
import { contentCreatorNoirEntry, ContentCreatorNoir } from "./ContentCreatorNoir";
import { contentCreatorPureEntry, ContentCreatorPure } from "./ContentCreatorPure";
// Phase 7.10 Batch C — Yoga/Wellness, Events, Auto, Interior (ids 40-51)
import { wellnessTeacherEntry, WellnessTeacher } from "./WellnessTeacher";
import { wellnessTeacherPureEntry, WellnessTeacherPure } from "./WellnessTeacherPure";
import { wellnessTeacherVividEntry, WellnessTeacherVivid } from "./WellnessTeacherVivid";
import { eventPlannerEntry, EventPlanner } from "./EventPlanner";
import { eventPlannerNoirEntry, EventPlannerNoir } from "./EventPlannerNoir";
import { eventPlannerPureEntry, EventPlannerPure } from "./EventPlannerPure";
import { autoDealerEntry, AutoDealer } from "./AutoDealer";
import { autoDealerPureEntry, AutoDealerPure } from "./AutoDealerPure";
import { autoDealerVividEntry, AutoDealerVivid } from "./AutoDealerVivid";
import { interiorDesignEntry, InteriorDesign } from "./InteriorDesign";
import { interiorDesignNoirEntry, InteriorDesignNoir } from "./InteriorDesignNoir";
import { interiorDesignVividEntry, InteriorDesignVivid } from "./InteriorDesignVivid";
// Phase 7.11 Batch D-1 — Real Estate + Legal style variants (ids 52-59)
import { realEstateNoirEntry, RealEstateNoir } from "./RealEstateNoir";
import { realEstatePureEntry, RealEstatePure } from "./RealEstatePure";
import { realEstateVividEntry, RealEstateVivid } from "./RealEstateVivid";
import { realEstateStoneEntry, RealEstateStone } from "./RealEstateStone";
import { legalCounselNoirEntry, LegalCounselNoir } from "./LegalCounselNoir";
import { legalCounselPureEntry, LegalCounselPure } from "./LegalCounselPure";
import { legalCounselVividEntry, LegalCounselVivid } from "./LegalCounselVivid";
import { legalCounselStoneEntry, LegalCounselStone } from "./LegalCounselStone";
// Phase 7.11 Batch D-2 — Restaurant + Photographer style variants (ids 60-67)
import { restaurantNoirEntry, RestaurantNoir } from "./RestaurantNoir";
import { restaurantPureEntry, RestaurantPure } from "./RestaurantPure";
import { restaurantVividEntry, RestaurantVivid } from "./RestaurantVivid";
import { restaurantStoneEntry, RestaurantStone } from "./RestaurantStone";
import { photographerNoirEntry, PhotographerNoir } from "./PhotographerNoir";
import { photographerPureEntry, PhotographerPure } from "./PhotographerPure";
import { photographerVividEntry, PhotographerVivid } from "./PhotographerVivid";
import { photographerStoneEntry, PhotographerStone } from "./PhotographerStone";
// Phase 7.11 Batch D-3 — Clinic + DJ style variants (ids 68-75)
import { clinicNoirEntry, ClinicNoir } from "./ClinicNoir";
import { clinicPureEntry, ClinicPure } from "./ClinicPure";
import { clinicVividEntry, ClinicVivid } from "./ClinicVivid";
import { clinicStoneEntry, ClinicStone } from "./ClinicStone";
import { djNoirEntry, DJNoir } from "./DJNoir";
import { djPureEntry, DJPure } from "./DJPure";
import { djVividEntry, DJVivid } from "./DJVivid";
import { djStoneEntry, DJStone } from "./DJStone";
// Phase 7.11 Batch D-4 — Barber + E-commerce style variants (ids 76-83)
import { barberNoirEntry, BarberNoir } from "./BarberNoir";
import { barberPureEntry, BarberPure } from "./BarberPure";
import { barberVividEntry, BarberVivid } from "./BarberVivid";
import { barberStoneEntry, BarberStone } from "./BarberStone";
import { ecommerceEntry, Ecommerce } from "./Ecommerce";
import { ecommerceNoirEntry, EcommerceNoir } from "./EcommerceNoir";
import { ecommercePureEntry, EcommercePure } from "./EcommercePure";
import { ecommerceVividEntry, EcommerceVivid } from "./EcommerceVivid";
// Phase 7.11 Batch D-5 — Architect + Fitness style variants (ids 84-91)
import { architectNoirEntry, ArchitectNoir } from "./ArchitectNoir";
import { architectPureEntry, ArchitectPure } from "./ArchitectPure";
import { architectVividEntry, ArchitectVivid } from "./ArchitectVivid";
import { architectStoneEntry, ArchitectStone } from "./ArchitectStone";
import { fitnessNoirEntry, FitnessNoir } from "./FitnessNoir";
import { fitnessPureEntry, FitnessPure } from "./FitnessPure";
import { fitnessVividEntry, FitnessVivid } from "./FitnessVivid";
import { fitnessStoneEntry, FitnessStone } from "./FitnessStone";
// Phase 7.12 Batch E-1 — Universal layout templates v11-v15 (ids 92-96)
import { layoutNoirLuxuryEntry, LayoutNoirLuxury } from "./LayoutNoirLuxury";
import { layoutPureSwissEntry, LayoutPureSwiss } from "./LayoutPureSwiss";
import { layoutVividBoldEntry, LayoutVividBold } from "./LayoutVividBold";
import { layoutEditorialEntry, LayoutEditorial } from "./LayoutEditorial";
import { layoutSplitScreenEntry, LayoutSplitScreen } from "./LayoutSplitScreen";
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
  // Phase 7.10 Batch B — Accounting · Software · Content Creator (3 sectors × 3 styles)
  31: { ...accountingEntry, Component: Accounting },
  32: { ...accountingNoirEntry, Component: AccountingNoir },
  33: { ...accountingPureEntry, Component: AccountingPure },
  34: { ...softwareDevEntry, Component: SoftwareDev },
  35: { ...softwareDevPureEntry, Component: SoftwareDevPure },
  36: { ...softwareDevVividEntry, Component: SoftwareDevVivid },
  37: { ...contentCreatorEntry, Component: ContentCreator },
  38: { ...contentCreatorNoirEntry, Component: ContentCreatorNoir },
  39: { ...contentCreatorPureEntry, Component: ContentCreatorPure },
  // Phase 7.10 Batch C — Wellness · Events · Auto · Interior (4 sectors × 3 styles)
  40: { ...wellnessTeacherEntry, Component: WellnessTeacher },
  41: { ...wellnessTeacherPureEntry, Component: WellnessTeacherPure },
  42: { ...wellnessTeacherVividEntry, Component: WellnessTeacherVivid },
  43: { ...eventPlannerEntry, Component: EventPlanner },
  44: { ...eventPlannerNoirEntry, Component: EventPlannerNoir },
  45: { ...eventPlannerPureEntry, Component: EventPlannerPure },
  46: { ...autoDealerEntry, Component: AutoDealer },
  47: { ...autoDealerPureEntry, Component: AutoDealerPure },
  48: { ...autoDealerVividEntry, Component: AutoDealerVivid },
  49: { ...interiorDesignEntry, Component: InteriorDesign },
  50: { ...interiorDesignNoirEntry, Component: InteriorDesignNoir },
  51: { ...interiorDesignVividEntry, Component: InteriorDesignVivid },
  // Phase 7.11 Batch D-1 — Real Estate + Legal style variants (4 styles × 2 sectors)
  52: { ...realEstateNoirEntry, Component: RealEstateNoir },
  53: { ...realEstatePureEntry, Component: RealEstatePure },
  54: { ...realEstateVividEntry, Component: RealEstateVivid },
  55: { ...realEstateStoneEntry, Component: RealEstateStone },
  56: { ...legalCounselNoirEntry, Component: LegalCounselNoir },
  57: { ...legalCounselPureEntry, Component: LegalCounselPure },
  58: { ...legalCounselVividEntry, Component: LegalCounselVivid },
  59: { ...legalCounselStoneEntry, Component: LegalCounselStone },
  // Phase 7.11 Batch D-2 — Restaurant + Photographer style variants (4 styles × 2 sectors)
  60: { ...restaurantNoirEntry, Component: RestaurantNoir },
  61: { ...restaurantPureEntry, Component: RestaurantPure },
  62: { ...restaurantVividEntry, Component: RestaurantVivid },
  63: { ...restaurantStoneEntry, Component: RestaurantStone },
  64: { ...photographerNoirEntry, Component: PhotographerNoir },
  65: { ...photographerPureEntry, Component: PhotographerPure },
  66: { ...photographerVividEntry, Component: PhotographerVivid },
  67: { ...photographerStoneEntry, Component: PhotographerStone },
  // Phase 7.11 Batch D-3 — Clinic + DJ style variants (4 styles × 2 sectors)
  68: { ...clinicNoirEntry, Component: ClinicNoir },
  69: { ...clinicPureEntry, Component: ClinicPure },
  70: { ...clinicVividEntry, Component: ClinicVivid },
  71: { ...clinicStoneEntry, Component: ClinicStone },
  72: { ...djNoirEntry, Component: DJNoir },
  73: { ...djPureEntry, Component: DJPure },
  74: { ...djVividEntry, Component: DJVivid },
  75: { ...djStoneEntry, Component: DJStone },
  // Phase 7.11 Batch D-4 — Barber + E-commerce style variants (ids 76-83)
  76: { ...barberNoirEntry, Component: BarberNoir },
  77: { ...barberPureEntry, Component: BarberPure },
  78: { ...barberVividEntry, Component: BarberVivid },
  79: { ...barberStoneEntry, Component: BarberStone },
  80: { ...ecommerceEntry, Component: Ecommerce },
  81: { ...ecommerceNoirEntry, Component: EcommerceNoir },
  82: { ...ecommercePureEntry, Component: EcommercePure },
  83: { ...ecommerceVividEntry, Component: EcommerceVivid },
  // Phase 7.11 Batch D-5 — Architect + Fitness style variants (ids 84-91)
  84: { ...architectNoirEntry, Component: ArchitectNoir },
  85: { ...architectPureEntry, Component: ArchitectPure },
  86: { ...architectVividEntry, Component: ArchitectVivid },
  87: { ...architectStoneEntry, Component: ArchitectStone },
  88: { ...fitnessNoirEntry, Component: FitnessNoir },
  89: { ...fitnessPureEntry, Component: FitnessPure },
  90: { ...fitnessVividEntry, Component: FitnessVivid },
  91: { ...fitnessStoneEntry, Component: FitnessStone },
  // Phase 7.12 Batch E-1 — Universal layout templates v11-v15 (ids 92-96)
  92: { ...layoutNoirLuxuryEntry, Component: LayoutNoirLuxury },
  93: { ...layoutPureSwissEntry, Component: LayoutPureSwiss },
  94: { ...layoutVividBoldEntry, Component: LayoutVividBold },
  95: { ...layoutEditorialEntry, Component: LayoutEditorial },
  96: { ...layoutSplitScreenEntry, Component: LayoutSplitScreen },
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
  | "beauty"
  | "accounting"
  | "software"
  | "content-creator"
  | "wellness"
  | "event-planner"
  | "auto"
  | "interior";

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
  // Phase 7.10 Batch B
  { id: 31, key: "accounting", name: "Accounting", sector: "accounting" },
  { id: 32, key: "accounting-noir", name: "Accounting — Noir", sector: "accounting" },
  { id: 33, key: "accounting-pure", name: "Accounting — Pure", sector: "accounting" },
  { id: 34, key: "software-dev", name: "Software Dev", sector: "software" },
  { id: 35, key: "software-dev-pure", name: "Software Dev — Pure", sector: "software" },
  { id: 36, key: "software-dev-vivid", name: "Software Dev — Vivid", sector: "software" },
  { id: 37, key: "content-creator", name: "Content Creator", sector: "content-creator" },
  { id: 38, key: "content-creator-noir", name: "Content Creator — Noir", sector: "content-creator" },
  { id: 39, key: "content-creator-pure", name: "Content Creator — Pure", sector: "content-creator" },
  // Phase 7.10 Batch C
  { id: 40, key: "wellness-teacher", name: "Wellness Teacher", sector: "wellness" },
  { id: 41, key: "wellness-teacher-pure", name: "Wellness — Pure", sector: "wellness" },
  { id: 42, key: "wellness-teacher-vivid", name: "Wellness — Vivid", sector: "wellness" },
  { id: 43, key: "event-planner", name: "Event Planner", sector: "event-planner" },
  { id: 44, key: "event-planner-noir", name: "Event Planner — Noir", sector: "event-planner" },
  { id: 45, key: "event-planner-pure", name: "Event Planner — Pure", sector: "event-planner" },
  { id: 46, key: "auto-dealer", name: "Auto Dealer", sector: "auto" },
  { id: 47, key: "auto-dealer-pure", name: "Auto Dealer — Pure", sector: "auto" },
  { id: 48, key: "auto-dealer-vivid", name: "Auto Dealer — Vivid", sector: "auto" },
  { id: 49, key: "interior-design", name: "Interior Design", sector: "interior" },
  { id: 50, key: "interior-design-noir", name: "Interior — Noir", sector: "interior" },
  { id: 51, key: "interior-design-vivid", name: "Interior — Vivid", sector: "interior" },
  // Phase 7.11 Batch D-1
  { id: 52, key: "real-estate-noir", name: "Real Estate — Noir", sector: "real-estate" },
  { id: 53, key: "real-estate-pure", name: "Real Estate — Pure", sector: "real-estate" },
  { id: 54, key: "real-estate-vivid", name: "Real Estate — Vivid", sector: "real-estate" },
  { id: 55, key: "real-estate-stone", name: "Real Estate — Stone", sector: "real-estate" },
  { id: 56, key: "legal-counsel-noir", name: "Legal Counsel — Noir", sector: "lawyer" },
  { id: 57, key: "legal-counsel-pure", name: "Legal Counsel — Pure", sector: "lawyer" },
  { id: 58, key: "legal-counsel-vivid", name: "Legal Counsel — Vivid", sector: "lawyer" },
  { id: 59, key: "legal-counsel-stone", name: "Legal Counsel — Stone", sector: "lawyer" },
  // Phase 7.11 Batch D-2
  { id: 60, key: "restaurant-noir", name: "Restaurant — Noir", sector: "restaurant" },
  { id: 61, key: "restaurant-pure", name: "Restaurant — Pure", sector: "restaurant" },
  { id: 62, key: "restaurant-vivid", name: "Restaurant — Vivid", sector: "restaurant" },
  { id: 63, key: "restaurant-stone", name: "Restaurant — Stone", sector: "restaurant" },
  { id: 64, key: "photographer-noir", name: "Photographer — Noir", sector: "creator" },
  { id: 65, key: "photographer-pure", name: "Photographer — Pure", sector: "creator" },
  { id: 66, key: "photographer-vivid", name: "Photographer — Vivid", sector: "creator" },
  { id: 67, key: "photographer-stone", name: "Photographer — Stone", sector: "creator" },
  // Phase 7.11 Batch D-3
  { id: 68, key: "clinic-noir", name: "Clinic — Noir", sector: "clinic" },
  { id: 69, key: "clinic-pure", name: "Clinic — Pure", sector: "clinic" },
  { id: 70, key: "clinic-vivid", name: "Clinic — Vivid", sector: "clinic" },
  { id: 71, key: "clinic-stone", name: "Clinic — Stone", sector: "clinic" },
  { id: 72, key: "dj-noir", name: "DJ — Noir", sector: "music" },
  { id: 73, key: "dj-pure", name: "DJ — Pure", sector: "music" },
  { id: 74, key: "dj-vivid", name: "DJ — Vivid", sector: "music" },
  { id: 75, key: "dj-stone", name: "DJ — Stone", sector: "music" },
  // Phase 7.11 Batch D-4 — Barber + E-commerce style variants (ids 76-83)
  { id: 76, key: "barber-noir", name: "Barber — Noir", sector: "salon" },
  { id: 77, key: "barber-pure", name: "Barber — Pure", sector: "salon" },
  { id: 78, key: "barber-vivid", name: "Barber — Vivid", sector: "salon" },
  { id: 79, key: "barber-stone", name: "Barber — Stone", sector: "salon" },
  { id: 80, key: "ecommerce", name: "E-commerce", sector: "retail" },
  { id: 81, key: "ecommerce-noir", name: "E-commerce — Noir", sector: "retail" },
  { id: 82, key: "ecommerce-pure", name: "E-commerce — Pure", sector: "retail" },
  { id: 83, key: "ecommerce-vivid", name: "E-commerce — Vivid", sector: "retail" },
  // Phase 7.11 Batch D-5 — Architect + Fitness style variants (ids 84-91)
  { id: 84, key: "architect-noir", name: "Architect — Noir", sector: "architecture" },
  { id: 85, key: "architect-pure", name: "Architect — Pure", sector: "architecture" },
  { id: 86, key: "architect-vivid", name: "Architect — Vivid", sector: "architecture" },
  { id: 87, key: "architect-stone", name: "Architect — Stone", sector: "architecture" },
  { id: 88, key: "fitness-noir", name: "Fitness — Noir", sector: "fitness" },
  { id: 89, key: "fitness-pure", name: "Fitness — Pure", sector: "fitness" },
  { id: 90, key: "fitness-vivid", name: "Fitness — Vivid", sector: "fitness" },
  { id: 91, key: "fitness-stone", name: "Fitness — Stone", sector: "fitness" },
  // Phase 7.12 Batch E-1 — Universal layout templates v11-v15 (ids 92-96)
  { id: 92, key: "layout-noir-luxury", name: "Noir Luxury", sector: "consultant" },
  { id: 93, key: "layout-pure-swiss", name: "Pure Swiss", sector: "consultant" },
  { id: 94, key: "layout-vivid-bold", name: "Vivid Bold", sector: "consultant" },
  { id: 95, key: "layout-editorial", name: "Editorial", sector: "consultant" },
  { id: 96, key: "layout-split-screen", name: "Split Screen", sector: "consultant" },
];
