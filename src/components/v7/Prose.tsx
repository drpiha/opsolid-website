import type { ReactNode } from "react";

/**
 * Long-form typography for blog posts and legal pages: Fraunces headings, Inter body, ~68ch measure,
 * lists, tables, blockquote, links in copper-deep, code. Server component; style comes from the
 * arbitrary-variant classes below so it needs no extra CSS file.
 */
const prose = [
  "max-w-[68ch] text-[17px] leading-[1.7] text-[#16191D] md:text-[18px]",
  "[&_h2]:font-[family-name:var(--font-fraunces),Georgia,serif] [&_h2]:font-light [&_h2]:[font-variation-settings:'SOFT'_50] [&_h2]:mt-14 [&_h2]:scroll-mt-24 [&_h2]:text-balance [&_h2]:text-[1.75rem] [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.01em] md:[&_h2]:text-[2.25rem]",
  "[&_h3]:font-[family-name:var(--font-fraunces),Georgia,serif] [&_h3]:font-light [&_h3]:[font-variation-settings:'SOFT'_50] [&_h3]:mt-10 [&_h3]:text-balance [&_h3]:text-[1.375rem] [&_h3]:leading-[1.2] md:[&_h3]:text-[1.625rem]",
  "[&_h4]:font-[family-name:var(--font-geist-mono),ui-monospace,monospace] [&_h4]:tracking-[0.02em] [&_h4]:mt-8 [&_h4]:text-[12px] [&_h4]:uppercase [&_h4]:text-[#6B665F]",
  "[&_p]:mt-5 [&_p]:text-pretty [&>*:first-child]:mt-0",
  "[&_a]:text-[#8A4524] [&_a]:underline [&_a]:decoration-[#B5623A]/40 [&_a]:underline-offset-[4px] [&_a]:transition-colors hover:[&_a]:decoration-[#8A4524]",
  "[&_strong]:font-semibold",
  "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul>li]:marker:text-[#B5623A]",
  "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol>li]:marker:font-mono [&_ol>li]:marker:text-[#8A4524]",
  "[&_li>ul]:mt-2 [&_li>ol]:mt-2",
  "[&_blockquote]:mt-8 [&_blockquote]:border-l-2 [&_blockquote]:border-[#B5623A] [&_blockquote]:pl-5 [&_blockquote]:font-[family-name:var(--font-fraunces),Georgia,serif] [&_blockquote]:font-light [&_blockquote]:[font-variation-settings:'SOFT'_50] [&_blockquote]:text-[1.25rem] [&_blockquote]:leading-[1.4] [&_blockquote]:italic md:[&_blockquote]:text-[1.375rem]",
  "[&_hr]:my-12 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#E3DCD1]",
  "[&_code]:rounded-[6px] [&_code]:bg-white [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_code]:border [&_code]:border-[#E3DCD1]",
  "[&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-[16px] [&_pre]:border [&_pre]:border-[#E3DCD1] [&_pre]:bg-white [&_pre]:p-4 [&_pre]:text-[14px] [&_pre]:leading-[1.6]",
  "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_table]:mt-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[15px]",
  "[&_caption]:mb-3 [&_caption]:text-left [&_caption]:font-[family-name:var(--font-geist-mono),ui-monospace,monospace] [&_caption]:tracking-[0.02em] [&_caption]:text-[12px] [&_caption]:uppercase [&_caption]:text-[#6B665F]",
  "[&_th]:border-b [&_th]:border-[#16191D] [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-[family-name:var(--font-geist-mono),ui-monospace,monospace] [&_th]:tracking-[0.02em] [&_th]:text-[12px] [&_th]:font-normal [&_th]:uppercase [&_th]:text-[#6B665F]",
  "[&_td]:border-b [&_td]:border-[#E3DCD1] [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top",
  "[&_figure]:mt-8 [&_figcaption]:mt-2 [&_figcaption]:font-[family-name:var(--font-geist-mono),ui-monospace,monospace] [&_figcaption]:tracking-[0.02em] [&_figcaption]:text-[11px] [&_figcaption]:uppercase [&_figcaption]:text-[#6B665F]",
  "[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[16px]",
].join(" ");

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${prose} ${className}`}>{children}</div>;
}
