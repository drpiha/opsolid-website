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
};

export function getTemplateSample(id: number): SampleData | undefined {
  return cardTemplateSamples[id];
}
