import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { Specimen } from "@/components/sections/Specimen";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Homepage composition mirrors the Claude Design v2 mock
 * (opsolid-design-system/project/ui_kits/website/index.html):
 * Hero -> Capabilities -> Specimen -> Process -> Proof -> FinalCTA.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Specimen />
      <Process />
      <Proof />
      <FinalCTA />
    </>
  );
}
