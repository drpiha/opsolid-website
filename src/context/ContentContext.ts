"use client";

import { createContext } from "react";
import type { Content } from "@/content/en";

/** Full localized content for app surfaces. Null on v4 marketing routes, which carry their own copy. */
export const ContentContext = createContext<Content | null>(null);
