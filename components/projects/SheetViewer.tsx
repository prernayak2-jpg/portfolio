"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { DesignSheet } from "@/content/projects";
import styles from "./SheetViewer.module.css";

type Props = {
  sheets: DesignSheet[];
  index: number; // which sheet is showing
  onChange: (index: number) => void; // move to another sheet
  onClose: () => void;
};

// Full-screen viewer for design sheets, with previous / next arrows and a close button.
export default function SheetViewer({ sheets, index, onChange, onClose }: Props) {
  const sheet = sheets[index];
  const isFirst = index === 0;
  const isLast = index === sheets.length - 1;

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft" && index > 0) onChange(index - 1);
      else if (event.key === "ArrowRight" && index < sheets.length - 1) onChange(index + 1);
      else return;

      // While the viewer is open, these keys belong to it: stop the project
      // window (Escape) and the carousel behind it (arrows) from reacting too.
      event.stopImmediatePropagation();
    }
    // `true` = listen before the other key listeners, so stopPropagation works.
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [index, sheets.length, onChange, onClose]);

  // createPortal places the viewer directly in <body>, outside the project window,
  // so it can cover everything on the page (including the MENU button).
  return createPortal(
    <div
      className={styles.viewer}
      role="dialog"
      aria-modal="true"
      aria-label="Design sheet viewer"
      onClick={(event) => {
        event.stopPropagation(); // don't let the click reach the project window's backdrop
        onClose(); // clicking the dark area closes the viewer
      }}
    >
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close viewer">
        ✕
      </button>

      <button
        type="button"
        className={`${styles.arrow} ${styles.previous}`}
        onClick={(event) => {
          event.stopPropagation();
          onChange(index - 1);
        }}
        disabled={isFirst}
        aria-label="Previous sheet"
      >
        ←
      </button>

      <figure className={styles.figure} onClick={(event) => event.stopPropagation()}>
        <img src={sheet.src} alt={sheet.caption ?? `Sheet ${index + 1}`} className={styles.image} />
        <figcaption className={styles.caption}>
          {String(index + 1).padStart(2, "0")} / {String(sheets.length).padStart(2, "0")}
          {sheet.caption && ` · ${sheet.caption}`}
        </figcaption>
      </figure>

      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={(event) => {
          event.stopPropagation();
          onChange(index + 1);
        }}
        disabled={isLast}
        aria-label="Next sheet"
      >
        →
      </button>
    </div>,
    document.body
  );
}
