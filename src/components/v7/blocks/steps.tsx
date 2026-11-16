import { Img as Image } from "@/components/v7/Img";
import type { BlockProps } from "@/content/v7/types";
import { SITE_STR } from "@/content/v7/site";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { Etikett } from "../werkstatt/Etikett";

const EURO = /€/;

/**
 * Crops drawn in SVG at the size of the raster crops (288 x 224, shown at 96 x 75): decoration, the Etikett line under
 * the steps names them (design review R3). "katalog": the catalog cut on one course row, as the crop-katalog picture
 * is cut on the first two; "angebot": a sample offer sheet with its title, text lines and a stamp; "termin": the corner
 * of a live session window (bar, shared screen, neutral participant tiles; R4, so the KI-Agenten page shows no German
 * picture text on EN and TR); "bescheinigung": the head of a participation record in the page language.
 */
function DrawnCrop({ kind, lines = [] }: { kind: "katalog" | "angebot" | "termin" | "bescheinigung"; lines?: string[] }) {
  const mono = { fontFamily: "var(--wk-mono)" };
  const sans = { fontFamily: "var(--wk-sans)", fontStretch: "112%" };
  return (
    <svg className="wk-run-crop wk-run-draw" viewBox="0 0 288 224" aria-hidden="true">
      <rect width="288" height="224" fill="var(--wk-sheet)" />
      {kind === "katalog" ? (
        <>
          <text x="16" y="28" fontSize="17" fill="var(--wk-muted)" style={mono}>
            {lines[0]}
          </text>
          <path d="M16 44H288" stroke="var(--wk-ink)" strokeWidth="3" />
          {lines.slice(1, 3).map((l, i) => (
            <text key={l} x="16" y={96 + i * 32} fontSize="24" fontWeight="700" fill="var(--wk-ink)" style={sans}>
              {l}
            </text>
          ))}
          <path d="M16 156H288" stroke="var(--wk-line-2)" strokeWidth="1.5" />
          <rect x="16" y="182" width="150" height="12" rx="3" fill="var(--wk-line)" />
        </>
      ) : kind === "termin" ? (
        <>
          <rect x="0" y="0" width="288" height="34" fill="var(--wk-ink)" />
          <circle cx="20" cy="17" r="5" fill="var(--wk-copper)" />
          <text x="34" y="23" fontSize="15" fill="var(--wk-text-d)" style={mono}>
            {lines[0]}
          </text>
          <rect x="16" y="50" width="164" height="158" rx="4" fill="#fff" stroke="var(--wk-line-2)" strokeWidth="1.5" />
          <text x="30" y="84" fontSize="19" fontWeight="700" fill="var(--wk-ink)" style={sans}>
            {lines[1]}
          </text>
          {[104, 124, 144].map((y, i) => (
            <rect key={y} x="30" y={y} width={130 - i * 22} height="8" rx="3" fill="var(--wk-line-2)" />
          ))}
          <rect x="30" y="170" width="120" height="22" rx="4" fill="none" stroke="var(--wk-copper-deep)" strokeWidth="2" />
          {[0, 1, 2].map((r) =>
            [0, 1].map((c) => <rect key={`${r}${c}`} x={194 + c * 42} y={50 + r * 54} width="36" height="46" rx="4" fill="var(--wk-paper-2)" stroke="var(--wk-line-2)" strokeWidth="1.5" />),
          )}
        </>
      ) : kind === "bescheinigung" ? (
        <>
          <rect x="34" y="20" width="220" height="230" rx="4" fill="#fff" stroke="var(--wk-line-2)" strokeWidth="1.5" />
          {lines.slice(0, 2).map((l, i) => (
            <text key={l} x="54" y={62 + i * 28} fontSize="22" fontWeight="700" fill="var(--wk-ink)" style={sans}>
              {l}
            </text>
          ))}
          <path d="M54 110H234" stroke="var(--wk-copper)" strokeWidth="3" />
          {[132, 154, 176].map((y, i) => (
            <rect key={y} x="54" y={y} width={150 - i * 24} height="9" rx="3" fill="var(--wk-line-2)" />
          ))}
          <rect x="196" y="164" width="38" height="38" rx="19" fill="none" stroke="var(--wk-copper-deep)" strokeWidth="2.5" />
        </>
      ) : (
        <>
          <rect x="34" y="20" width="220" height="230" rx="4" fill="#fff" stroke="var(--wk-line-2)" strokeWidth="1.5" />
          <text x="54" y="66" fontSize="26" fontWeight="700" fill="var(--wk-ink)" style={sans}>
            {lines[0]}
          </text>
          <rect x="196" y="40" width="40" height="40" rx="5" fill="none" stroke="var(--wk-copper-deep)" strokeWidth="2.5" />
          {[96, 120, 144, 168].map((y, i) => (
            <rect key={y} x="54" y={y} width={i === 3 ? 96 : 176 - i * 18} height="9" rx="3" fill="var(--wk-line-2)" />
          ))}
          <path d="M54 202H234" stroke="var(--wk-ink)" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

/**
 * Plain numbered steps as a ledger (.wk-run): 40 px copper-deep squares on a 2 px top rule. `variant: "run"` (hub and
 * course page) adds an art card per step: a decorative crop of a labelled sample (alt ""), the "Sie erhalten" Etikett,
 * a short heading and the result; one Etikett line under the list names all crops. The default variant is unchanged.
 * Rule 1: when a step names a euro amount, the price note follows the steps (as in the process and rows blocks).
 */
export function StepsBlock({ block: b, locale, num }: BlockProps<"steps">) {
  const run = b.variant === "run";
  const priced = b.items.some((it) => [it.h, it.p, it.art?.h, it.art?.p].some((x) => x && EURO.test(x)));
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} airy={b.airy}>
      <ol className="wk-run">
        {b.items.map((it, i) => (
          <Reveal as="li" key={it.h} delay={i * 0.05} className={`wk-run-step${run && it.art ? " has-art" : ""}`}>
            <span className="wk-step-no" aria-hidden="true" />
            <div className="wk-run-text">
              <h3>{it.h}</h3>
              <p>{it.p}</p>
            </div>
            {run && it.art && (
              <div className="wk-run-art">
                {it.art.crop ? (
                  <Image
                    className="wk-run-crop"
                    src={it.art.crop.src}
                    alt={it.art.crop.alt}
                    width={it.art.crop.w}
                    height={it.art.crop.h}
                    sizes="96px"
                    decoding="async"
                  />
                ) : (
                  it.art.draw && <DrawnCrop kind={it.art.draw} lines={it.art.lines} />
                )}
                <div>
                  <Etikett className="wk-run-art-k">{it.art.label}</Etikett>
                  <b>{it.art.h}</b>
                  <span>{it.art.p}</span>
                </div>
              </div>
            )}
          </Reveal>
        ))}
      </ol>
      {run && b.etikett && (
        <Etikett as="p" className="wk-steps-note">
          {b.etikett}
        </Etikett>
      )}
      {priced && <p className="wk-foot-note wk-steps-price">{SITE_STR[locale].priceNote}</p>}
    </Section>
  );
}
