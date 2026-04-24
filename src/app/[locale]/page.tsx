import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { Specimen } from "@/components/sections/Specimen";
import { Process } from "@/components/sections/Process";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Homepage composition — industrial-luxury v2 port.
 * Hero → Capabilities → Specimen (industry-baseline) → Process → FinalCTA.
 * Proof section from the design mock retired: OpSolid is pre-market, so
 * fabricated testimonials and logos don't ship. Specimen carries the
 * honest-numbers story instead.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Specimen />
      <Process />
      <FinalCTA />
    </>
  );
}
