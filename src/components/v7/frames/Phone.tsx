/**
 * PhoneFrame: a phone around a real app screenshot.
 *
 * Adapted from the vendored Magic UI `Iphone` component (MIT licence, (c) 2025 Magic UI,
 * https://github.com/magicuidesign/magicui). Geometry is kept (433 x 882 body, 389.5 x 843.5 screen,
 * 55.75 corner radius); the SVG artwork is replaced by plain CSS. Same-origin screenshots via next/image.
 */
import Image from "next/image";
import type { Img } from "@/content/v7/types";

const W = 433;
const H = 882;
const SX = 21.25;
const SY = 19.25;
const SW = 389.5;
const SH = 843.5;
const R = 55.75;

export function PhoneFrame({ img, className = "", sizes = "(min-width: 1024px) 240px, 60vw" }: { img: Img; className?: string; sizes?: string }) {
  return (
    <div
      className={`relative w-full rounded-[13%/6.4%] bg-[#16191D] shadow-[0_24px_30px_-14px_rgba(22,25,29,0.35)] ${className}`}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <div
        className="absolute overflow-hidden bg-white"
        style={{
          left: `${(SX / W) * 100}%`,
          top: `${(SY / H) * 100}%`,
          width: `${(SW / W) * 100}%`,
          height: `${(SH / H) * 100}%`,
          borderRadius: `${(R / SW) * 100}% / ${(R / SH) * 100}%`,
        }}
      >
        <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover object-top" />
      </div>
      <span aria-hidden="true" className="absolute left-1/2 top-[2.9%] h-[2.6%] w-[26%] -translate-x-1/2 rounded-full bg-[#16191D]" />
    </div>
  );
}
