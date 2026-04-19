import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ToolsShowcase } from "@/components/sections/ToolsShowcase";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { SolutionsOverview } from "@/components/sections/SolutionsOverview";
import { IntegrationGrid } from "@/components/sections/IntegrationGrid";
import { ProblemOutcome } from "@/components/sections/ProblemOutcome";
import { UseCasesPreview } from "@/components/sections/UseCasesPreview";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProductsTeaser } from "@/components/sections/ProductsTeaser";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ToolsShowcase />
      <WhatWeDo />
      <SolutionsOverview />
      <IntegrationGrid />
      <ProblemOutcome />
      <UseCasesPreview />
      <HowWeWork />
      <WhyUs />
      <ProductsTeaser />
      <CTASection />
    </>
  );
}
