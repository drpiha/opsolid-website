"use client";

import type { CardRenderProps } from "./shared/CardPrimitives";
import { Template01 } from "./templates/Template01";
import { Template02 } from "./templates/Template02";
import { Template03 } from "./templates/Template03";
import { Template04 } from "./templates/Template04";
import { Template05 } from "./templates/Template05";
import { SmartCard } from "./smart/SmartCard";

/**
 * Adapter so SmartCard (which expects `slug` + `siteUrl`) can be invoked
 * from the same call sites that render Template01..05. The preview screens
 * pass only CardRenderProps; we fill in safe placeholders. Real /c/[slug]
 * server-rendering still calls SmartCard directly with the live values.
 */
function SmartCardPreview(props: CardRenderProps) {
  return (
    <SmartCard
      slug="preview"
      cardData={props.cardData}
      photoPath={props.photoPath}
      logoPath={props.logoPath}
      brandPrimaryHex={props.brandPrimaryHex}
      brandAccentHex={props.brandAccentHex}
      siteUrl={
        typeof window !== "undefined"
          ? window.location.origin
          : "https://opsolid.de"
      }
    />
  );
}

const registry: Record<string, React.FC<CardRenderProps>> = {
  Template01,
  Template02,
  Template03,
  Template04,
  Template05,
  SmartCard: SmartCardPreview,
};

export function TemplateRenderer({
  componentKey,
  ...rest
}: CardRenderProps & { componentKey: string }) {
  const Comp = registry[componentKey] ?? Template01;
  return <Comp {...rest} />;
}

export { registry as templateRegistry };
