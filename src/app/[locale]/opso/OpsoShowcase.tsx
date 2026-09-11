"use client";

import Image from "next/image";
import { useState } from "react";
import type { OpsoShowcaseContent } from "@/content/opso";
import styles from "./page.module.css";

const layouts = [
  { key: "consultant-site", desktopHeight: 956, mobileHeight: 1004 },
  { key: "portfolio", desktopHeight: 956, mobileHeight: 1004 },
  { key: "service-landing", desktopHeight: 1025, mobileHeight: 1139 },
] as const;

export default function OpsoShowcase({ content }: { content: OpsoShowcaseContent }) {
  const [selected, setSelected] = useState(0);
  const layout = layouts[selected];
  const item = content.items[selected];

  return (
    <div>
      <div className={styles.layoutChoices} role="group" aria-label={content.label}>
        {content.items.map((choice, index) => (
          <button
            className={styles.layoutChoice}
            key={layouts[index].key}
            type="button"
            aria-pressed={selected === index}
            aria-controls="layout-preview"
            onClick={() => setSelected(index)}
          >
            <span className={styles.number}>0{index + 1}</span>
            <span className={styles.choiceTitle}>{choice.title}</span>
            <span className={styles.choiceDescription}>{choice.text}</span>
          </button>
        ))}
      </div>
      <p className={styles.previewCaption} id="layout-disclosure">{content.caption}</p>
      <div id="layout-preview" className={styles.preview} role="region" aria-label={item.title} aria-describedby="layout-disclosure">
        <p className={styles.previewSelection} aria-live="polite" aria-atomic="true">{item.title}</p>
        <div className={styles.previewScreens}>
          {(["desktop", "mobile"] as const).map((format) => {
            const width = format === "desktop" ? 1440 : 375;
            const src = `/images/opso/layouts/${layout.key}-home-${width}.png`;
            return (
              <figure className={format === "desktop" ? styles.desktopPreview : styles.mobilePreview} key={format}>
                <figcaption className={styles.screenLabel}>{content[format]}<span aria-hidden="true">{width} px</span></figcaption>
                <a href={src} className={styles.imageLink} aria-label={`${content.fullSize}: ${item.title}, ${content[format]}`}>
                  <Image src={src} alt={`${item.title}: ${content.imageAlt} (${content[format]})`} width={width} height={format === "desktop" ? layout.desktopHeight : layout.mobileHeight} sizes={format === "desktop" ? "(max-width: 700px) 100vw, 75vw" : "280px"} />
                </a>
                <a className={styles.fullSizeLink} href={src}>{content.fullSize}<span aria-hidden="true">↗</span></a>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
