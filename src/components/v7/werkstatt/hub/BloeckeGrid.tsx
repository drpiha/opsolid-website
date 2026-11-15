import type { CourseArt } from "@/content/v7/types-hub";

type Art = Extract<CourseArt, { kind: "bloecke" }>;

/** The day in six blocks (Copilot-Praxistag on the hub catalog card): a 3 x 2 grid of small sheets, "Block n" in mono. */
export function BloeckeGrid({ art }: { art: Art }) {
  return (
    <ol className="wk-blocks">
      {art.blocks.map((b, i) => (
        <li key={b.b}>
          <span className="wk-blocks-no">
            {art.blockLabel} {i + 1}
          </span>
          <b>{b.b}</b>
          <span>{b.small}</span>
        </li>
      ))}
    </ol>
  );
}
