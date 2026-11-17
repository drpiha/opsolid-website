import type { ComponentType } from "react";
import type { Block, BlockProps, BlockType, Ground, PageDef } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { PILLAR } from "@/content/v7/menu";
import { crumbsFor } from "./Breadcrumbs";
import { CtaBand } from "./CtaBand";
import { FaqSection } from "./FaqSection";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { RevealObserver } from "./RevealObserver";
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
import { StatementBlock } from "./blocks/statement";
import { HOME_REGISTRY } from "./blocks/registry-home";
import { HUB_REGISTRY } from "./blocks/registry-hub";
import { PRODUKTE_REGISTRY } from "./blocks/registry-produkte";

/** The shared block types (package F). Page packages register their own types in blocks/registry-*.ts. */
const CORE_REGISTRY = {
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
  statement: StatementBlock,
};

/** A package that adds a block type in its own types file must register it in its own registry, or tsc fails here. */
const REGISTRY = { ...CORE_REGISTRY, ...HOME_REGISTRY, ...HUB_REGISTRY, ...PRODUKTE_REGISTRY } satisfies {
  [T in BlockType]: ComponentType<BlockProps<T>>;
};

/**
 * Grounds: a block's explicit `ground` wins; otherwise section blocks alternate paper and sheet, starting with paper
 * on the first block. Statement bands are not sections: they take no ground and do not advance the alternation.
 * `start` continues the count (the `after` blocks follow the page blocks).
 */
function withGrounds(blocks: Block[], start = 0): Block[] {
  let n = start;
  return blocks.map((block) => {
    if (block.t === "statement") return block;
    const ground: Ground = block.ground ?? (n % 2 === 0 ? "paper" : "sheet");
    n += 1;
    return { ...block, ground };
  });
}

/** Section number of the block at index i: statement bands are not numbered. */
function sectionNum(blocks: Block[], i: number): string {
  return String(blocks.slice(0, i + 1).filter((b) => b.t !== "statement").length).padStart(2, "0");
}

function renderBlock(block: Block, locale: L3, num: string) {
  const Component = REGISTRY[block.t] as ComponentType<BlockProps<BlockType>>;
  return <Component key={block.id} block={block} locale={locale} num={num} />;
}

/** The ground the FAQ takes: the next step of the paper/sheet alternation after the page blocks. */
function faqGround(blocks: Block[]): Ground {
  let g: Ground | undefined;
  for (const b of blocks) if (b.t !== "statement") g = b.ground;
  return g === "paper" ? "sheet" : "paper";
}

/**
 * Renders one PageDef: hero (with the breadcrumbs inside on inner pages), the blocks with their grounds, FAQ, the
 * `after` blocks, the CTA band (only when the page sets `cta`) and the JSON-LD graph.
 */
export function V7Page({ page, locale }: { page: PageDef; locale: L3 }) {
  const home = page.key === "home";
  const crumbs = crumbsFor(page, locale);
  const blocks = withGrounds(page.blocks);
  const sections = blocks.filter((b) => b.t !== "statement").length;
  const after = withGrounds(page.after ?? [], sections + (page.faq ? 1 : 0));
  return (
    // data-door: the door mark of the page's group (decision 77); Beratung pages swap copper for slate in CSS.
    <div className="v7" data-door={PILLAR[page.key]}>
      <RevealObserver />
      <Hero hero={page.hero} locale={locale} home={home} crumbs={crumbs} />
      {blocks.map((block, i) => {
        const el = renderBlock(block, locale, sectionNum(blocks, i));
        // The first block under the hero never reveals (the page opens complete).
        return i === 0 ? (
          <div key={block.id} className="v7-still contents">
            {el}
          </div>
        ) : (
          el
        );
      })}
      {page.faq && <FaqSection faq={page.faq} locale={locale} ground={faqGround(blocks)} />}
      {after.map((block, i) => renderBlock(block, locale, String(sections + Number(sectionNum(after, i))).padStart(2, "0")))}
      {page.cta && <CtaBand cta={page.cta} locale={locale} />}
      <JsonLd page={page} locale={locale} crumbs={crumbs} />
    </div>
  );
}
