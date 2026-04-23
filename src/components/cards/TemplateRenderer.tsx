"use client";

import type { CardRenderProps } from "./shared/CardPrimitives";
import { Template01 } from "./templates/Template01";
import { Template02 } from "./templates/Template02";
import { Template03 } from "./templates/Template03";
import { Template04 } from "./templates/Template04";
import { Template05 } from "./templates/Template05";

const registry: Record<string, React.FC<CardRenderProps>> = {
  Template01,
  Template02,
  Template03,
  Template04,
  Template05,
};

export function TemplateRenderer({
  componentKey,
  ...rest
}: CardRenderProps & { componentKey: string }) {
  const Comp = registry[componentKey] ?? Template01;
  return <Comp {...rest} />;
}

export { registry as templateRegistry };
