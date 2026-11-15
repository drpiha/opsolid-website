/**
 * PhoneFrame: a phone around a real app screenshot, in the C look (.wk-ph in src/styles/werkstatt/base.css:
 * radius 28 px, a 1 px ink ring, the unedited screen cut to the device).
 *
 * First adapted from the vendored Magic UI `Iphone` component (MIT licence, (c) 2025 Magic UI,
 * https://github.com/magicuidesign/magicui); since the Werkstatt port only the plain CSS frame is left.
 * Same-origin screenshots via next/image.
 */
import Image from "next/image";
import type { Img } from "@/content/v7/types";

export function PhoneFrame({ img, className = "", sizes = "(min-width: 1024px) 240px, 60vw" }: { img: Img; className?: string; sizes?: string }) {
  return (
    <div className={`wk-ph relative w-full ${className}`}>
      <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover object-top" />
    </div>
  );
}
