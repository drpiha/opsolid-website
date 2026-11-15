import type { ReactNode } from "react";

/**
 * Long-form typography for blog posts and legal pages: Archivo headings and body, ~68ch measure,
 * lists, tables, blockquote, links in copper-deep, code. Server component; style comes from the
 * arbitrary-variant classes below so it needs no extra CSS file.
 */
const prose = [
  "max-w-[68ch] text-[17px] leading-[1.7] text-wk-ink md:text-[18px]",
  "[&_h2]:font-[family-name:var(--font-archivo),system-ui,sans-serif] [&_h2]:font-[640] [&_h2]:[font-stretch:116%] [&_h2]:mt-14 [&_h2]:scroll-mt-24 [&_h2]:text-balance [&_h2]:text-[1.75rem] [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.01em] md:[&_h2]:text-[2.25rem]",
  "[&_h3]:font-[family-name:var(--font-archivo),system-ui,sans-serif] [&_h3]:font-[640] [&_h3]:[font-stretch:116%] [&_h3]:mt-10 [&_h3]:text-balance [&_h3]:text-[1.375rem] [&_h3]:leading-[1.2] md:[&_h3]:text-[1.625rem]",
  "[&_h4]:font-[family-name:var(--font-plex-mono),ui-monospace,monospace] [&_h4]:mt-8 [&_h4]:text-[12px] [&_h4]:text-wk-muted",
  "[&_p]:mt-5 [&_p]:text-pretty [&>*:first-child]:mt-0",
  "[&_a]:text-wk-copper-deep [&_a]:underline [&_a]:decoration-wk-copper/40 [&_a]:underline-offset-[4px] [&_a]:transition-colors hover:[&_a]:decoration-wk-copper-deep",
  "[&_strong]:font-semibold",
  "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul>li]:marker:text-wk-copper",
  "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol>li]:marker:font-[family-name:var(--font-plex-mono),ui-monospace,monospace] [&_ol>li]:marker:text-wk-copper-deep",
  "[&_li>ul]:mt-2 [&_li>ol]:mt-2",
  "[&_blockquote]:mt-8 [&_blockquote]:border-l-2 [&_blockquote]:border-wk-copper [&_blockquote]:pl-5 [&_blockquote]:font-[family-name:var(--font-archivo),system-ui,sans-serif] [&_blockquote]:font-[560] [&_blockquote]:[font-stretch:106%] [&_blockquote]:text-[1.25rem] [&_blockquote]:leading-[1.4] [&_blockquote]:not-italic md:[&_blockquote]:text-[1.375rem]",
  "[&_hr]:my-12 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-wk-line",
  "[&_code]:rounded-[6px] [&_code]:bg-wk-sheet [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-[family-name:var(--font-plex-mono),ui-monospace,monospace] [&_code]:text-[0.88em] [&_code]:border [&_code]:border-wk-line",
  "[&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-[16px] [&_pre]:border [&_pre]:border-wk-line [&_pre]:bg-wk-sheet [&_pre]:p-4 [&_pre]:text-[14px] [&_pre]:leading-[1.6]",
  "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_table]:mt-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[15px]",
  "[&_caption]:mb-3 [&_caption]:text-left [&_caption]:font-[family-name:var(--font-plex-mono),ui-monospace,monospace] [&_caption]:text-[12px] [&_caption]:text-wk-muted",
  "[&_th]:border-b [&_th]:border-wk-ink [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-[family-name:var(--font-plex-mono),ui-monospace,monospace] [&_th]:text-[12px] [&_th]:font-normal [&_th]:text-wk-muted",
  "[&_td]:border-b [&_td]:border-wk-line [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top",
  "[&_figure]:mt-8 [&_figcaption]:mt-2 [&_figcaption]:font-[family-name:var(--font-plex-mono),ui-monospace,monospace] [&_figcaption]:text-[12px] [&_figcaption]:text-wk-muted",
  "[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[16px]",
].join(" ");

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${prose} ${className}`}>{children}</div>;
}
