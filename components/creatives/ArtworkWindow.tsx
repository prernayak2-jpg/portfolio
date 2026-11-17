"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Creative } from "@/content/creatives";
import styles from "./ArtworkWindow.module.css";

type Props = {
  item: Creative;
  onClose: () => void;
};

// Opens one piece in a window over a blurred page.
// Only two controls: ✕ close and ⛶ full screen.
export default function ArtworkWindow({ item, onClose }: Props) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      // While open, stop the arrow keys from scrolling the wall behind.
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.stopImmediatePropagation();
      }
    }
    // Keep the button icon in sync if full screen is left with the Esc key.
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === windowRef.current);
    }

    window.addEventListener("keydown", handleKey, true);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      window.removeEventListener("keydown", handleKey, true);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [onClose]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      // Ask the browser to show this window across the whole screen.
      windowRef.current?.requestFullscreen();
    }
  }

  function close() {
    if (document.fullscreenElement) document.exitFullscreen();
    onClose();
  }

  return createPortal(
    <div className={styles.backdrop} onClick={close}>
      <div
        ref={windowRef}
        className={styles.window}
        role="dialog"
        aria-modal="true"
        aria-label={item.title ?? "Artwork"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "View full screen"}
          >
            {isFullscreen ? "⤡" : "⛶"}
          </button>
          <button type="button" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>

        {item.kind === "video" ? (
          // Opening counts as a click, so the video may play with sound here.
          <video
            src={item.src}
            poster={item.poster}
            className={styles.media}
            controls
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img src={item.src} alt={item.title ?? ""} className={styles.media} />
        )}
      </div>
    </div>,
    document.body
  );
}
