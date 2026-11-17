import type { ComponentType } from "react";
import type { BlockProps } from "@/content/v7/types";
import type { ProdukteBlock } from "@/content/v7/types-produkte";
import { AppBlock } from "./app";
import { WhyBlock } from "./why";

/** Produkte page block components (package P3). Every ProdukteBlock type needs an entry, or tsc fails here. */
export const PRODUKTE_REGISTRY = {
  app: AppBlock,
  why: WhyBlock,
} satisfies { [T in ProdukteBlock["t"]]: ComponentType<BlockProps<T>> };
