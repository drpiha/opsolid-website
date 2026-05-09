// =============================================================================
// Card template sample data — one curated `SampleData` per template id.
//
// Used by:
//   - /dev/template-gallery     — renders every template at production size.
//   - Phase 7.5 thumbnail script — same payload, screenshot per template.
//   - Phase 7.2 carousel previews — half-scale renders driven by the same
//                                    samples so what customers see in the
//                                    carousel is what they get on a card.
//
// Photo/logo URLs use Unsplash Source URLs (free for commercial use). Each
// sample documents the photographer attribution in a `// photo:` comment so
// licensing is auditable.
// =============================================================================

import type { CardData } from "@/lib/validation";
import type { SampleData } from "@/components/cards/templates/v2/types";
import { legalCounselSample } from "@/components/cards/templates/v2/LegalCounsel";
import { kitchenAtelierSample } from "@/components/cards/templates/v2/KitchenAtelier";
import { photographerSample } from "@/components/cards/templates/v2/Photographer";
import { clinicSample } from "@/components/cards/templates/v2/Clinic";
import { studioSample } from "@/components/cards/templates/v2/Studio";
import { barberSample } from "@/components/cards/templates/v2/Barber";
import { makerSample } from "@/components/cards/templates/v2/Maker";
import { architectSample } from "@/components/cards/templates/v2/Architect";
import { athleteSample } from "@/components/cards/templates/v2/Athlete";
import { editorialSample } from "@/components/cards/templates/v2/Editorial";
import { atelierSample } from "@/components/cards/templates/v2/Atelier";
import { universalSample } from "@/components/cards/templates/v2/Universal";
// Phase 7.8 — designer-team samples (ids 14-21)
import { restaurantSample } from "@/components/cards/templates/v2/Restaurant";
import { hotelSample } from "@/components/cards/templates/v2/Hotel";
import { techStartupSample } from "@/components/cards/templates/v2/TechStartup";
import { developerSample } from "@/components/cards/templates/v2/Developer";
import { yogaStudioSample } from "@/components/cards/templates/v2/YogaStudio";
import { personalTrainerSample } from "@/components/cards/templates/v2/PersonalTrainer";
import { musicProducerSample } from "@/components/cards/templates/v2/MusicProducer";
import { weddingPlannerSample } from "@/components/cards/templates/v2/WeddingPlanner";
// Phase 7.10 Batch A — Dentist · Psychologist · Beauty (ids 22-30)
import { dentistSample } from "@/components/cards/templates/v2/Dentist";
import { dentistPureSample } from "@/components/cards/templates/v2/DentistPure";
import { dentistVividSample } from "@/components/cards/templates/v2/DentistVivid";
import { psychologistSample } from "@/components/cards/templates/v2/Psychologist";
import { psychologistPureSample } from "@/components/cards/templates/v2/PsychologistPure";
import { psychologistVividSample } from "@/components/cards/templates/v2/PsychologistVivid";
import { beautySalonSample } from "@/components/cards/templates/v2/BeautySalon";
import { beautySalonNoirSample } from "@/components/cards/templates/v2/BeautySalonNoir";
import { beautySalonPureSample } from "@/components/cards/templates/v2/BeautySalonPure";
// Phase 7.10 Batch B — Accounting · Software · Content Creator (ids 31-39)
import { accountingSample } from "@/components/cards/templates/v2/Accounting";
import { accountingNoirSample } from "@/components/cards/templates/v2/AccountingNoir";
import { accountingPureSample } from "@/components/cards/templates/v2/AccountingPure";
import { softwareDevSample } from "@/components/cards/templates/v2/SoftwareDev";
import { softwareDevPureSample } from "@/components/cards/templates/v2/SoftwareDevPure";
import { softwareDevVividSample } from "@/components/cards/templates/v2/SoftwareDevVivid";
import { contentCreatorSample } from "@/components/cards/templates/v2/ContentCreator";
import { contentCreatorNoirSample } from "@/components/cards/templates/v2/ContentCreatorNoir";
import { contentCreatorPureSample } from "@/components/cards/templates/v2/ContentCreatorPure";
// Phase 7.10 Batch C — Wellness · Events · Auto · Interior (ids 40-51)
import { wellnessTeacherSample } from "@/components/cards/templates/v2/WellnessTeacher";
import { wellnessTeacherPureSample } from "@/components/cards/templates/v2/WellnessTeacherPure";
import { wellnessTeacherVividSample } from "@/components/cards/templates/v2/WellnessTeacherVivid";
import { eventPlannerSample } from "@/components/cards/templates/v2/EventPlanner";
import { eventPlannerNoirSample } from "@/components/cards/templates/v2/EventPlannerNoir";
import { eventPlannerPureSample } from "@/components/cards/templates/v2/EventPlannerPure";
import { autoDealerSample } from "@/components/cards/templates/v2/AutoDealer";
import { autoDealerPureSample } from "@/components/cards/templates/v2/AutoDealerPure";
import { autoDealerVividSample } from "@/components/cards/templates/v2/AutoDealerVivid";
import { interiorDesignSample } from "@/components/cards/templates/v2/InteriorDesign";
import { interiorDesignNoirSample } from "@/components/cards/templates/v2/InteriorDesignNoir";
import { interiorDesignVividSample } from "@/components/cards/templates/v2/InteriorDesignVivid";
// Phase 7.11 Batch D-1 — Real Estate + Legal style variants (ids 52-59)
import { realEstateNoirSample } from "@/components/cards/templates/v2/RealEstateNoir";
import { realEstatePureSample } from "@/components/cards/templates/v2/RealEstatePure";
import { realEstateVividSample } from "@/components/cards/templates/v2/RealEstateVivid";
import { realEstateStoneSample } from "@/components/cards/templates/v2/RealEstateStone";
import { legalCounselNoirSample } from "@/components/cards/templates/v2/LegalCounselNoir";
import { legalCounselPureSample } from "@/components/cards/templates/v2/LegalCounselPure";
import { legalCounselVividSample } from "@/components/cards/templates/v2/LegalCounselVivid";
import { legalCounselStoneSample } from "@/components/cards/templates/v2/LegalCounselStone";
// Phase 7.11 Batch D-2 — Restaurant + Photographer style variants (ids 60-67)
import { restaurantNoirSample } from "@/components/cards/templates/v2/RestaurantNoir";
import { restaurantPureSample } from "@/components/cards/templates/v2/RestaurantPure";
import { restaurantVividSample } from "@/components/cards/templates/v2/RestaurantVivid";
import { restaurantStoneSample } from "@/components/cards/templates/v2/RestaurantStone";
import { photographerNoirSample } from "@/components/cards/templates/v2/PhotographerNoir";
import { photographerPureSample } from "@/components/cards/templates/v2/PhotographerPure";
import { photographerVividSample } from "@/components/cards/templates/v2/PhotographerVivid";
import { photographerStoneSample } from "@/components/cards/templates/v2/PhotographerStone";
// Phase 7.11 Batch D-3 — Clinic + DJ style variants (ids 68-75)
import { clinicNoirSample } from "@/components/cards/templates/v2/ClinicNoir";
import { clinicPureSample } from "@/components/cards/templates/v2/ClinicPure";
import { clinicVividSample } from "@/components/cards/templates/v2/ClinicVivid";
import { clinicStoneSample } from "@/components/cards/templates/v2/ClinicStone";
import { djNoirSample } from "@/components/cards/templates/v2/DJNoir";
import { djPureSample } from "@/components/cards/templates/v2/DJPure";
import { djVividSample } from "@/components/cards/templates/v2/DJVivid";
import { djStoneSample } from "@/components/cards/templates/v2/DJStone";
// Phase 7.11 Batch D-4 — Barber + E-commerce style variants (ids 76-83)
import { barberNoirSample } from "@/components/cards/templates/v2/BarberNoir";
import { barberPureSample } from "@/components/cards/templates/v2/BarberPure";
import { barberVividSample } from "@/components/cards/templates/v2/BarberVivid";
import { barberStoneSample } from "@/components/cards/templates/v2/BarberStone";
import { ecommerceSample } from "@/components/cards/templates/v2/Ecommerce";
import { ecommerceNoirSample } from "@/components/cards/templates/v2/EcommerceNoir";
import { ecommercePureSample } from "@/components/cards/templates/v2/EcommercePure";
import { ecommerceVividSample } from "@/components/cards/templates/v2/EcommerceVivid";
// Phase 7.11 Batch D-5 — Architect + Fitness style variants (ids 84-91)
import { architectNoirSample } from "@/components/cards/templates/v2/ArchitectNoir";
import { architectPureSample } from "@/components/cards/templates/v2/ArchitectPure";
import { architectVividSample } from "@/components/cards/templates/v2/ArchitectVivid";
import { architectStoneSample } from "@/components/cards/templates/v2/ArchitectStone";
import { fitnessNoirSample } from "@/components/cards/templates/v2/FitnessNoir";
import { fitnessPureSample } from "@/components/cards/templates/v2/FitnessPure";
import { fitnessVividSample } from "@/components/cards/templates/v2/FitnessVivid";
import { fitnessStoneSample } from "@/components/cards/templates/v2/FitnessStone";
// Phase 7.12 Batch E-1 — Universal layout templates v11-v15 (ids 92-96)
import { layoutNoirLuxurySample } from "@/components/cards/templates/v2/LayoutNoirLuxury";
import { layoutPureSwissSample } from "@/components/cards/templates/v2/LayoutPureSwiss";
import { layoutVividBoldSample } from "@/components/cards/templates/v2/LayoutVividBold";
import { layoutEditorialSample } from "@/components/cards/templates/v2/LayoutEditorial";
import { layoutSplitScreenSample } from "@/components/cards/templates/v2/LayoutSplitScreen";

// id=1 — RealEstate. Persona: Hannah Walker, senior listing agent in Berlin.
// photo: Unsplash, by Christina Wocintechchat
//        https://unsplash.com/photos/0Zx1bDv5BNY
//        Unsplash License — free to use, no attribution required.
const realEstateCard: CardData = {
  name: "Hannah Walker",
  position: "Senior Listing Agent",
  title: "Real Estate Advisor",
  company: "Walker & Stein",
  email: "hannah@walker-stein.de",
  phone: "+49 30 1234 5678",
  whatsapp: "+49 170 1234 567",
  website: "walker-stein.de",
  address: "Kurfürstendamm 188, 10707 Berlin",
  bio: "Twelve years pairing discerning clients with Berlin's most distinctive homes. From pre-war altbau in Charlottenburg to waterfront builds along the Wannsee — every brief begins with a long conversation, not a listing brochure.",
  bookingUrl: "https://cal.com/walker-stein/intro",
  brochureUrl: "https://walker-stein.de/portfolio.pdf",
  impressumUrl: "https://walker-stein.de/impressum",
  privacyUrl: "https://walker-stein.de/datenschutz",
  sectorKey: "real-estate",
  socials: {
    linkedin: "https://linkedin.com/in/hannahwalker-de",
    instagram: "https://instagram.com/walker.stein.berlin",
    youtube: "https://youtube.com/@walkerstein",
    facebook: "https://facebook.com/walker.stein.berlin",
  },
  services: [
    {
      title: "Charlottenburg Townhouse",
      description: "5 bedrooms · 240 m² · garden · pre-war altbau, fully restored.",
      priceLabel: "€2.85M",
    },
    {
      title: "Wannsee Waterfront Build",
      description: "Architect-designed, 380 m² · private dock · move-in 2026.",
      priceLabel: "FOR SALE",
    },
    {
      title: "Mitte Penthouse",
      description: "Two-storey loft · 180 m² · roof terrace overlooking Spree.",
      priceLabel: "€1.65M",
    },
  ],
  testimonials: [
    {
      author: "Sebastian & Marie L.",
      role: "Bought — Mitte penthouse",
      quote:
        "Hannah understood us before we did. She turned eight months of dead-end viewings into a single home that felt inevitable.",
    },
    {
      author: "Dr. K. Bergmann",
      role: "Sold — Charlottenburg estate",
      quote:
        "Discreet, decisive, and remarkably calm under pressure. We closed €120k above asking.",
    },
  ],
};

const realEstateSample: SampleData = {
  templateId: 1,
  slug: "demo-real-estate",
  cardData: realEstateCard,
  // photo: by Christina Wocintechchat — Unsplash License, no attribution required.
  photoUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#1a365d",
  brandAccentHex: "#c8a951",
};

// id=100 — Linktree (M3, Carrd amendment). Persona: a creator with a single
// avatar + bio + 6 outbound link buttons. Layout key is "accordion" so the
// renderer / preview generator hints toward a vertical stack of full-width
// buttons rather than the contact-info card surface.
const linktreeCard: CardData = {
  name: "Lina Park",
  title: "Multidisciplinary creator",
  position: "Photo · Music · Writing",
  bio: "Berlin-based. Stories about people, machines, and the space between.",
  email: "lina@park.studio",
  website: "park.studio",
  socials: {
    instagram: "https://instagram.com/linapark",
    youtube: "https://youtube.com/@linapark",
    linkedin: "https://linkedin.com/in/linapark",
  },
  customButtons: [
    { label: "Latest essay — On craft", href: "https://park.studio/craft", style: "primary" },
    { label: "Photo book preorder", href: "https://park.studio/photobook", style: "secondary" },
    { label: "Listen — new EP", href: "https://soundcloud.com/lina-park", style: "secondary" },
    { label: "Newsletter (free)", href: "https://park.studio/newsletter", style: "secondary" },
  ],
};

const linktreeSample: SampleData = {
  templateId: 100,
  slug: "demo-linktree",
  cardData: linktreeCard,
  photoUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#0F0F0F",
  brandAccentHex: "#C27940",
};

// =============================================================================
// Master record — id → sample. Phase 7.4 agents append entries below.
// =============================================================================

export const cardTemplateSamples: Record<number, SampleData> = {
  1: realEstateSample,
  2: legalCounselSample,
  3: kitchenAtelierSample,
  4: photographerSample,
  5: clinicSample,
  6: studioSample,
  7: barberSample,
  8: makerSample,
  9: architectSample,
  10: athleteSample,
  11: editorialSample,
  12: atelierSample,
  13: universalSample,
  14: restaurantSample,
  15: hotelSample,
  16: techStartupSample,
  17: developerSample,
  18: yogaStudioSample,
  19: personalTrainerSample,
  20: musicProducerSample,
  21: weddingPlannerSample,
  // Phase 7.10 Batch A
  22: dentistSample,
  23: dentistPureSample,
  24: dentistVividSample,
  25: psychologistSample,
  26: psychologistPureSample,
  27: psychologistVividSample,
  28: beautySalonSample,
  29: beautySalonNoirSample,
  30: beautySalonPureSample,
  // Phase 7.10 Batch B
  31: accountingSample,
  32: accountingNoirSample,
  33: accountingPureSample,
  34: softwareDevSample,
  35: softwareDevPureSample,
  36: softwareDevVividSample,
  37: contentCreatorSample,
  38: contentCreatorNoirSample,
  39: contentCreatorPureSample,
  // Phase 7.10 Batch C
  40: wellnessTeacherSample,
  41: wellnessTeacherPureSample,
  42: wellnessTeacherVividSample,
  43: eventPlannerSample,
  44: eventPlannerNoirSample,
  45: eventPlannerPureSample,
  46: autoDealerSample,
  47: autoDealerPureSample,
  48: autoDealerVividSample,
  49: interiorDesignSample,
  50: interiorDesignNoirSample,
  51: interiorDesignVividSample,
  // Phase 7.11 Batch D-1
  52: realEstateNoirSample,
  53: realEstatePureSample,
  54: realEstateVividSample,
  55: realEstateStoneSample,
  56: legalCounselNoirSample,
  57: legalCounselPureSample,
  58: legalCounselVividSample,
  59: legalCounselStoneSample,
  // Phase 7.11 Batch D-2
  60: restaurantNoirSample,
  61: restaurantPureSample,
  62: restaurantVividSample,
  63: restaurantStoneSample,
  64: photographerNoirSample,
  65: photographerPureSample,
  66: photographerVividSample,
  67: photographerStoneSample,
  // Phase 7.11 Batch D-3
  68: clinicNoirSample,
  69: clinicPureSample,
  70: clinicVividSample,
  71: clinicStoneSample,
  72: djNoirSample,
  73: djPureSample,
  74: djVividSample,
  75: djStoneSample,
  // Phase 7.11 Batch D-4
  76: barberNoirSample,
  77: barberPureSample,
  78: barberVividSample,
  79: barberStoneSample,
  80: ecommerceSample,
  81: ecommerceNoirSample,
  82: ecommercePureSample,
  83: ecommerceVividSample,
  // Phase 7.11 Batch D-5
  84: architectNoirSample,
  85: architectPureSample,
  86: architectVividSample,
  87: architectStoneSample,
  88: fitnessNoirSample,
  89: fitnessPureSample,
  90: fitnessVividSample,
  91: fitnessStoneSample,
  // Phase 7.12 Batch E-1 — Universal layout templates v11-v15
  92: layoutNoirLuxurySample,
  93: layoutPureSwissSample,
  94: layoutVividBoldSample,
  95: layoutEditorialSample,
  96: layoutSplitScreenSample,
  // M3 — Linktree-style "link in bio" template (Carrd amendment)
  100: linktreeSample,
};

export function getTemplateSample(id: number): SampleData | undefined {
  return cardTemplateSamples[id];
}
