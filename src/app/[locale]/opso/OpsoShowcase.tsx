"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import type { OpsoShowcaseContent } from "@/content/opso";
import styles from "./page.module.css";

export type OpsoProfileAssets = {
  key: "clara" | "james" | "maya" | "felix";
  url: string;
  desktop: StaticImageData;
  mobile: StaticImageData;
};
export type OpsoDemoAssets = readonly [OpsoProfileAssets, OpsoProfileAssets, OpsoProfileAssets, OpsoProfileAssets];

export default function OpsoShowcase({ content, profiles, locale }: { content: OpsoShowcaseContent; profiles: OpsoDemoAssets; locale: "de" | "en" }) {
  const [selected, setSelected] = useState(0);
  const profile = profiles[selected];
  const item = content.items[selected];

  return (
    <div>
      <div className={styles.layoutChoices} role="group" aria-label={content.label}>
        {content.items.map((choice, index) => (
          <button
            className={`${styles.layoutChoice} ${styles[profiles[index].key]}`}
            key={profiles[index].key}
            type="button"
            aria-pressed={selected === index}
            aria-controls="layout-preview"
            onClick={() => setSelected(index)}
          >
            <span className={styles.choiceIdentity}>
              <span className={styles.choiceTitle}>{choice.title}</span>
              <span className={styles.choiceProfession}>{choice.profession}</span>
              <span className={styles.choiceStyle}>{choice.style}</span>
            </span>
          </button>
        ))}
      </div>
      <p className={styles.previewCaption} id="layout-disclosure">{content.caption}</p>
      <div id="layout-preview" className={`${styles.preview} ${styles[profile.key]}`} role="region" aria-label={item.title} aria-describedby="layout-disclosure">
        <div className={styles.previewHeading}>
          <p className={styles.previewSelection} aria-live="polite" aria-atomic="true">{item.title}<span>{item.profession}</span></p>
          <p className={styles.previewDescription}>{item.text}</p>
        </div>
        <a className={styles.liveExample} href={`${profile.url}?lang=${locale}`} target="_blank" rel="noopener noreferrer">{content.openExample}<span aria-hidden="true">↗</span></a>
        <div className={styles.previewScreens}>
          {(["desktop", "mobile"] as const).map((format) => {
            const asset = profile[format];
            return (
              <figure className={format === "desktop" ? styles.desktopPreview : styles.mobilePreview} key={format}>
                <figcaption className={styles.screenLabel}>{content[format]}</figcaption>
                <a href={asset.src} className={styles.imageLink} aria-label={`${content.fullSize}: ${item.title}, ${content[format]}`}>
                  <Image src={asset} alt={`${item.title}: ${content.imageAlt} (${content[format]})`} sizes={format === "desktop" ? "(max-width: 700px) 100vw, 75vw" : "280px"} />
                </a>
                <a className={styles.fullSizeLink} href={asset.src} aria-label={`${content.fullSize}: ${item.title}, ${content[format]}`}>{content.fullSize}<span aria-hidden="true">↗</span></a>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
