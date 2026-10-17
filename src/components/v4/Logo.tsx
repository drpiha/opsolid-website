/**
 * Official OpSolid lockup as one vector: the copper rounded-square ring and the OPSOLID letterforms,
 * traced 1:1 from public/icons/logo with name dark.png (1672 px master; mark 300 units, cap height
 * 110 units, positions as in the master). Flat fill, no texture: `color` sets it (copper by default
 * via .v4-logo), and the footer draws the same outline as a hairline (drafting style).
 *
 * Decorative by default (aria-hidden); pass `label` where the logo is the only content of a heading.
 */
const MARK =
  "M75 0H225A75 75 0 0 1 300 75V225A75 75 0 0 1 225 300H75A75 75 0 0 1 0 225V75A75 75 0 0 1 75 0Z" +
  "M106 63H194A43 43 0 0 1 237 106V194A43 43 0 0 1 194 237H106A43 43 0 0 1 63 194V106A43 43 0 0 1 106 63Z";

const WORD =
  // O
  "M433 106H481.5A35 35 0 0 1 516.5 141V181A35 35 0 0 1 481.5 216H433A35 35 0 0 1 398 181V141A35 35 0 0 1 433 106Z" +
  "M438 123.5H476.5A21 21 0 0 1 497.5 144.5V177.5A21 21 0 0 1 476.5 198.5H438A21 21 0 0 1 417 177.5V144.5A21 21 0 0 1 438 123.5Z" +
  // P
  "M552 106H630A30 30 0 0 1 660 136V147A30 30 0 0 1 630 177H571V216H552Z" +
  "M571 123.5H627A14 14 0 0 1 641 137.5V146A14 14 0 0 1 627 160H571Z" +
  // S
  "M788.5 106H717A27 27 0 0 0 690 133V142.5A27 27 0 0 0 717 169.5H766A9 9 0 0 1 775 178.5V189.5A9 9 0 0 1 766 198.5H692V216H767" +
  "A27 27 0 0 0 794 189V179A27 27 0 0 0 767 152H718.5A9 9 0 0 1 709.5 143V132.5A9 9 0 0 1 718.5 123.5H788.5Z" +
  // O
  "M860 106H908.5A35 35 0 0 1 943.5 141V181A35 35 0 0 1 908.5 216H860A35 35 0 0 1 825 181V141A35 35 0 0 1 860 106Z" +
  "M865 123.5H903.5A21 21 0 0 1 924.5 144.5V177.5A21 21 0 0 1 903.5 198.5H865A21 21 0 0 1 844 177.5V144.5A21 21 0 0 1 865 123.5Z" +
  // L
  "M978 106H997.5V198.5H1063V216H978Z" +
  // I
  "M1094 106H1113V216H1094Z" +
  // D
  "M1151 106H1219A40 40 0 0 1 1259 146V176A40 40 0 0 1 1219 216H1151Z" +
  "M1170 123.5H1217.5A22 22 0 0 1 1239.5 145.5V176.5A22 22 0 0 1 1217.5 198.5H1170Z";

export function Logo({ className, label }: { className?: string; label?: string }) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const, focusable: "false" as const };
  return (
    <svg className={className ? `v4-logo ${className}` : "v4-logo"} viewBox="0 0 1259 300" width="126" height="30" {...a11y}>
      <path fillRule="evenodd" d={MARK + WORD} />
    </svg>
  );
}
