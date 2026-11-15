import type { ComponentType } from "react";
import type { BlockProps } from "@/content/v7/types";
import type { HomeBlock } from "@/content/v7/types-home";
import { CheckBlock } from "./check";
import { DoorsBlock } from "./doors";
import { ProductsBlock } from "./products";

/** Home block components (package P1). Every HomeBlock type needs an entry, or tsc fails here. */
export const HOME_REGISTRY = {
  doors: DoorsBlock,
  check: CheckBlock,
  products: ProductsBlock,
} satisfies { [T in HomeBlock["t"]]: ComponentType<BlockProps<T>> };
