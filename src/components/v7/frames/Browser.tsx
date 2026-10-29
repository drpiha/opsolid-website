/**
 * BrowserFrame: a browser window around a real screenshot.
 *
 * Adapted from the vendored Magic UI `Safari` component (MIT licence, (c) 2025 Magic UI,
 * https://github.com/magicuidesign/magicui). Geometry is kept (1203 x 753 frame, 1200 x 700 screen,
 * 52 px toolbar); the 12 KB SVG artwork is replaced by plain CSS so the frame stays light, themeable
 * and free of duplicate SVG ids. Screenshots are same-origin files rendered with next/image.
 */
import Image from "next/image";
import type { Img } from "@/content/v7/types";

const W = 1203;
const H = 753;
const TOOLBAR = 52;

export function BrowserFrame({ img, url, className = "", sizes = "(min-width: 1024px) 720px, 100vw" }: { img: Img; url?: string; className?: string; sizes?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[12px] border border-[#D9D1C5] bg-white shadow-[0_24px_30px_-18px_rgba(22,25,29,0.22)] [container-type:inline-size] ${className}`}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex items-center gap-[1.4cqw] border-b border-[#E3DCD1] bg-[#EFE9E0] px-[2cqw]"
        style={{ height: `${(TOOLBAR / H) * 100}%` }}
      >
        <span className="flex gap-[0.9cqw]">
          <i className="block h-[1.5cqw] w-[1.5cqw] rounded-full bg-[#D9D1C5]" />
          <i className="block h-[1.5cqw] w-[1.5cqw] rounded-full bg-[#D9D1C5]" />
          <i className="block h-[1.5cqw] w-[1.5cqw] rounded-full bg-[#D9D1C5]" />
        </span>
        <span
          className="mx-auto flex h-[62%] w-[46%] items-center justify-center rounded-full bg-white font-mono text-[max(8px,1.5cqw)] leading-none text-[#6B665F]"
          style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
        >
          {url ?? ""}
        </span>
        <span className="w-[6.5cqw]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 overflow-hidden bg-white" style={{ top: `${(TOOLBAR / H) * 100}%` }}>
        <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover object-top" />
      </div>
    </div>
  );
}
