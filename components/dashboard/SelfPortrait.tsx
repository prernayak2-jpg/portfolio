"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SelfPortrait.module.css";

type Props = {
  video: string;
  image: string; // the finished drawing: same frame as the video's last moment
  alt: string;
};

// Plays the drawing video once when the page opens, then shows the finished
// image in the same frame. Hovering over (or clicking) the image plays the
// video again.
export default function SelfPortrait({ video, image, alt }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [finished, setFinished] = useState(false);

  function play() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // browsers only allow videos to start by themselves when muted
    v.currentTime = 0;
    setFinished(false);
    // If the browser still refuses (e.g. phone battery saver), just show the image.
    v.play().catch(() => setFinished(true));
  }

  // Start once, as soon as the page opens.
  useEffect(() => {
    play();
  }, []);

  return (
    <div className={styles.frame}>
      <video
        ref={videoRef}
        src={video}
        muted
        playsInline // iPhones: play in the page, not full screen
        preload="auto"
        onEnded={() => setFinished(true)}
        className={styles.media}
        aria-hidden="true"
      />

      {/* Laid exactly on top of the video; only visible once it has finished. */}
      <button
        type="button"
        onClick={play} // phones have no hover, so a tap still works
        onMouseEnter={play}
        className={finished ? `${styles.replay} ${styles.visible}` : styles.replay}
        aria-label="Play the drawing video again"
        tabIndex={finished ? 0 : -1}
      >
        <img src={image} alt={alt} className={styles.media} />
      </button>
    </div>
  );
}
