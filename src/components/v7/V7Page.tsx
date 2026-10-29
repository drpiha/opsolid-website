import type { ComponentType } from "react";
import type { BlockProps, BlockType, PageDef } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { Breadcrumbs, crumbsFor } from "./Breadcrumbs";
import { CtaBand } from "./CtaBand";
import { FaqSection } from "./FaqSection";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { MotionRoot } from "./MotionRoot";
import { AboutBlock } from "./blocks/about";
import { CompareBlock } from "./blocks/compare";
import { CoursesBlock } from "./blocks/courses";
import { DemoBlock } from "./blocks/demo";
import { ExamplesBlock } from "./blocks/examples";
import { FormBlock } from "./blocks/form";
import { GalleryBlock } from "./blocks/gallery";
import { MediaBlock } from "./blocks/media";
import { OffersBlock } from "./blocks/offers";
import { PrinciplesBlock } from "./blocks/principles";
import { ProcessBlock } from "./blocks/process";
import { ProductBlock } from "./blocks/product";
import { ProjectsBlock } from "./blocks/projects";
import { RowsBlock } from "./blocks/rows";
import { SampleBlock } from "./blocks/sample";
import { SectorsBlock } from "./blocks/sectors";
import { SituationsBlock } from "./blocks/situations";
import { SpecBlock } from "./blocks/spec";
import { StepsBlock } from "./blocks/steps";
import { TableBlock } from "./blocks/table";
import { TextBlock } from "./blocks/text";

type Registry = { [T in BlockType]: ComponentType<BlockProps<T>> };

const REGISTRY: Registry = {
  situations: SituationsBlock,
  process: ProcessBlock,
  examples: ExamplesBlock,
  principles: PrinciplesBlock,
  offers: OffersBlock,
  rows: RowsBlock,
  steps: StepsBlock,
  compare: CompareBlock,
  table: TableBlock,
  spec: SpecBlock,
  text: TextBlock,
  sample: SampleBlock,
  sectors: SectorsBlock,
  courses: CoursesBlock,
  projects: ProjectsBlock,
  product: ProductBlock,
  gallery: GalleryBlock,
  media: MediaBlock,
  about: AboutBlock,
  demo: DemoBlock,
  form: FormBlock,
};

/** Renders one PageDef: hero, breadcrumbs (inner pages), numbered blocks, FAQ, CTA band and the JSON-LD graph. */
export function V7Page({ page, locale }: { page: PageDef; locale: L3 }) {
  const home = page.key === "home";
  const crumbs = crumbsFor(page, locale);
  return (
    <MotionRoot>
      <div className="v7">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {!home && <Breadcrumbs crumbs={crumbs} locale={locale} />}
        <Hero hero={page.hero} locale={locale} home={home} />
        {page.blocks.map((block, i) => {
          const Component = REGISTRY[block.t] as ComponentType<BlockProps<BlockType>>;
          return <Component key={block.id} block={block} locale={locale} num={String(i + 1).padStart(2, "0")} />;
        })}
        {page.faq && <FaqSection faq={page.faq} locale={locale} />}
        <CtaBand cta={page.cta} locale={locale} />
        <JsonLd page={page} locale={locale} crumbs={crumbs} />
      </div>
    </MotionRoot>
  );
}
