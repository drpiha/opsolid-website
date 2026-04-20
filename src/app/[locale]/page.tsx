import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { SolutionsOverview } from "@/components/sections/SolutionsOverview";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { UseCasesPreview } from "@/components/sections/UseCasesPreview";
import { ToolsShowcase } from "@/components/sections/ToolsShowcase";
import { ProductsTeaser } from "@/components/sections/ProductsTeaser";
import { ProblemOutcome } from "@/components/sections/ProblemOutcome";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — DBC-first */}
      <Hero />

      {/* 2. Trust strip — rating + signals */}
      <TrustStrip />

      {/* 3. Feature grid — "Everything in one tap" */}
      <SolutionsOverview />

      {/* 4. How it works — 3 steps */}
      <HowWeWork />

      {/* 5. Who uses it — founders / sales / agencies / freelancers */}
      <UseCasesPreview />

      {/* 6. Integrations ticker */}
      <ToolsShowcase />

      {/* 7. Pricing preview — DBC + Automation services */}
      <ProductsTeaser />

      {/* 8. Social proof / testimonials */}
      <ProblemOutcome />

      {/* 9. Why Germany-native matters */}
      <WhyUs />

      {/* 10. Final CTA */}
      <CTASection />
    </>
  );
}
