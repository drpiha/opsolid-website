import type { BlockProps } from "@/content/v7/types";
import type { Door } from "@/content/v7/types-home";
import { soft } from "@/lib/soft-hyphen";
import { LinkTo } from "../LinkTo";
import { h2, wrap } from "../ui";
import { ChipTag } from "../werkstatt/Chip";
import { Etikett } from "../werkstatt/Etikett";
import { PhoneShot } from "../werkstatt/PhoneShot";
import { WkPicture } from "../werkstatt/WkPicture";
import { Fragebogen } from "../werkstatt/home/Fragebogen";
import { HomeSection } from "../werkstatt/home/HomeSection";

/** Door marks (decision 77): Schulungen on ink with copper, Beratung on slate, Produkte on charcoal. */
const GROUND = { schulungen: "ink", beratung: "slate", produkte: "char" } as const;

/** The fork in the section head: one square splits into two (analyse, then train or implement). */
const fork = (
  <svg viewBox="0 0 132 56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="19" width="18" height="18" rx="5" />
    <path d="M19 28h30c10 0 12-14 24-14h28M49 28c10 0 12 14 24 14h28" />
    <rect x="103" y="5" width="18" height="18" rx="5" fill="currentColor" />
    <rect x="103" y="33" width="18" height="18" rx="5" fill="currentColor" />
  </svg>
);

function DoorArt({ door }: { door: Door }) {
  const a = door.art;
  if (a.kind === "picture")
    return (
      <figure className="wk-door-pic">
        <WkPicture pic={a.pic} sizes="(max-width: 960px) 100vw, 30vw" />
        <Etikett as="figcaption">{a.pic.etikett}</Etikett>
      </figure>
    );
  if (a.kind === "fragebogen")
    return (
      <div className="wk-door-pic">
        <Fragebogen title={a.title} sub={a.sub} q={a.q} options={a.options} ariaLabel={a.ariaLabel} />
        <Etikett>{a.etikett}</Etikett>
      </div>
    );
  return (
    <div className="wk-door-pic">
      <PhoneShot img={a.img} sizes="(max-width: 960px) 136px, 168px" />
      <Etikett>{a.etikett}</Etikett>
    </div>
  );
}

/**
 * "Drei Wege" (home, PLAN 6.1): the head with the fork and the method line, then three doors on a 12-column grid.
 * Door A Schulungen (ink, the agenda render on its right half) spans two rows; door B Beratung (slate, the drawn
 * questionnaire) and door C Produkte (charcoal, an unedited app screen) stack beside it. Each door is one link; the
 * price note closes the group. Phones: the doors stack, door A with its picture under the copy.
 */
export function DoorsBlock({ block: b, locale }: BlockProps<"doors">) {
  return (
    <HomeSection id={b.id} ground={b.ground} mat={b.mat} className="wk-wege">
      <div className={wrap}>
        <div className="wk-sec-head wk-wege-head">
          <div className="wk-sec-head-main">
            <Etikett solid>{b.label}</Etikett>
            <h2 id={`${b.id}-h`} className={h2}>
              {soft(b.h)}
            </h2>
          </div>
          {b.lede && (
            <div className="wk-fork">
              {fork}
              <p>{b.lede}</p>
            </div>
          )}
        </div>
        <ul className="wk-doors">
          {b.doors.map((d) => (
            <li key={d.tone} className={`wk-door-li is-${d.tone}`}>
              <LinkTo link={d.link} locale={locale} className={`wk-door is-${d.tone} wk-on-${GROUND[d.tone]}`}>
                <div className="wk-door-body">
                  <Etikett solid={d.tone === "schulungen"}>{d.etikett}</Etikett>
                  <h3>{soft(d.h)}</h3>
                  {d.p && <p>{d.p}</p>}
                  <ChipTag chip={d.chip} wrap />
                  {d.credit && <span className="wk-door-credit">{d.credit}</span>}
                  <span className="wk-tlink">{d.link.label}</span>
                </div>
                <DoorArt door={d} />
              </LinkTo>
            </li>
          ))}
        </ul>
        <p className="wk-doors-note">{b.footnote}</p>
      </div>
    </HomeSection>
  );
}
