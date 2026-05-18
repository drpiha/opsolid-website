"use client";

/**
 * V2Shell — client wrapper applied to every v2 page render. Hosts the
 * desktop smooth-scroll provider and the custom cursor.
 *
 * Both wrapped components self-bypass on touch / reduced-motion / coarse
 * pointer so this shell paints nothing on mobile and degrades cleanly for
 * accessibility settings. Server pages use it via a single import:
 *
 *   {isPreviewV2(sp) && (
 *     <V2Shell>
 *       <SomePageV2 />
 *     </V2Shell>
 *   )}
 */

import { LenisProvider } from "@/components/motion/LenisProvider";
import { CustomCursor } from "@/components/motion/CustomCursor";

export function V2Shell({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <CustomCursor />
      {children}
    </LenisProvider>
  );
}
