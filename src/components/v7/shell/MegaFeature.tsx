import type { MenuFeature } from "@/content/v7/menu";
import { LinkTo } from "@/components/v7/LinkTo";
import { Etikett } from "@/components/v7/werkstatt/Etikett";
import { MiniBlatt } from "@/components/v7/werkstatt/MiniBlatt";
import { PhoneShot } from "@/components/v7/werkstatt/PhoneShot";
import { WaySchema } from "@/components/v7/werkstatt/WaySchema";
import type { L3 } from "@/lib/v7-routes";

/**
 * The ink card on the right of a mega panel: a drawn picture (sample agenda, sample report, two unedited app
 * screens, the "way" schema), its Etikett, a title, one paragraph and a light button. Plain div, no landmark.
 */
export function MegaFeature({ feature, locale }: { feature: MenuFeature; locale: L3 }) {
  const { art } = feature;
  return (
    <div className="wk-mega-feature wk-on-ink">
      <div className={`wk-mega-pic is-${art.kind}`}>
        {(art.kind === "agenda" || art.kind === "report") && (
          <MiniBlatt title={art.title} sub={art.sub} stamp={art.stamp} items={art.items} rotate={art.kind === "agenda" ? 1.4 : -1.6} ariaLabel={art.ariaLabel} />
        )}
        {art.kind === "phones" &&
          art.phones.map((img) => <PhoneShot key={img.src} img={img} sizes="116px" className="wk-mega-ph" />)}
        {art.kind === "way" && <WaySchema labels={art.labels} base={art.base} ariaLabel={art.ariaLabel} variant="card" />}
      </div>
      <div className="wk-mega-body">
        <Etikett as="p">{feature.etikett}</Etikett>
        <p className="wk-mega-ft">{feature.title}</p>
        <p className="wk-mega-p">{feature.p}</p>
        <LinkTo link={feature.cta} locale={locale} className="wk-btn wk-btn-light wk-btn-sm" />
      </div>
    </div>
  );
}
