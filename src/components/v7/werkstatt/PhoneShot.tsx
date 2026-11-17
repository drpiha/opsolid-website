import { Img as Image } from "@/components/v7/Img";
import type { Img } from "@/content/v7/types";

/** An unedited app screen cut to a phone (.wk-ph: radius 28 px, 1 px ink ring). The caller adds the Etikett ("App-Screen"). */
export function PhoneShot({ img, sizes, priority, className }: { img: Img; sizes: string; priority?: boolean; className?: string }) {
  return (
    <span className={`wk-ph${className ? ` ${className}` : ""}`}>
      <Image src={img.src} width={img.w} height={img.h} alt={img.alt} sizes={sizes} priority={priority} decoding="async" />
    </span>
  );
}
