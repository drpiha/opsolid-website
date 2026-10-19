import claraDesktop from "@/assets/opso/clara-weber-desktop.webp";
import claraMobile from "@/assets/opso/clara-weber-mobile.webp";
import jamesDesktop from "@/assets/opso/james-bennett-desktop.webp";
import jamesMobile from "@/assets/opso/james-bennett-mobile.webp";
import mayaDesktop from "@/assets/opso/maya-collins-desktop.webp";
import mayaMobile from "@/assets/opso/maya-collins-mobile.webp";
import felixDesktop from "@/assets/opso/felix-berger-desktop.webp";
import felixMobile from "@/assets/opso/felix-berger-mobile.webp";
import type { OpsoDemoAssets } from "@/app/[locale]/opso/OpsoShowcase";

// Actual public-renderer captures of fictional profiles. Static imports keep
// intrinsic dimensions and content-hashed URLs tied to the reviewed files.
export const OPSO_DEMO_PROFILES = [
  { key: "clara", url: "https://opso.cc/opso-demo-clara-weber", desktop: claraDesktop, mobile: claraMobile },
  { key: "james", url: "https://opso.cc/opso-demo-james-bennett", desktop: jamesDesktop, mobile: jamesMobile },
  { key: "maya", url: "https://opso.cc/opso-demo-maya-collins", desktop: mayaDesktop, mobile: mayaMobile },
  { key: "felix", url: "https://opso.cc/opso-demo-felix-berger", desktop: felixDesktop, mobile: felixMobile },
] as const satisfies OpsoDemoAssets;
