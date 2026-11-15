import Link from "next/link";
import { resolveHref } from "@/components/v7/LinkTo";
import { SITE_STR } from "@/content/v7/site";
import type { L3 } from "@/lib/v7-routes";

/** The phone call bar (<= 960 px): the one CTA, fixed at the bottom. HeaderBehavior decides when it shows. */
export function Callbar({ locale }: { locale: L3 }) {
  const t = SITE_STR[locale];
  return (
    <div className="v7 wk-callbar" data-callbar>
      <Link className="wk-btn wk-btn-light" href={resolveHref({ label: t.cta, to: "kontakt", query: { anliegen: "schulung" } }, locale)}>
        {t.cta}
      </Link>
    </div>
  );
}
