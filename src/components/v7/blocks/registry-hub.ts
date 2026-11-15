import type { ComponentType } from "react";
import type { BlockProps } from "@/content/v7/types";
import type { HubBlock } from "@/content/v7/types-hub";
import { CatalogBlock } from "./catalog";
import { FormatBlock } from "./format";

/** Schulungen hub block components (package P2). Every HubBlock type needs an entry, or tsc fails here. */
export const HUB_REGISTRY = {
  catalog: CatalogBlock,
  format: FormatBlock,
} satisfies { [T in HubBlock["t"]]: ComponentType<BlockProps<T>> };
