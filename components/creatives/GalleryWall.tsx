"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Creative } from "@/content/creatives";
import type { Photo } from "@/content/photography";
import ArtworkWindow from "./ArtworkWindow";
import styles from "./GalleryWall.module.css";

// Which look a gallery room uses (the layout is the same in all of them):
//   "drawing" = black-and-white architectural line drawing (the original)
//   "musee"   = warm museum: concrete walls, oak floor, wooden frames
//   "theatre" = dark room, like a theatre (used by the Photography room)
//   "sketch"  = grey hand-drawn pencil lines on paper; only the artworks are in colour
type Look = "drawing" | "musee" | "theatre" | "sketch";

// The look of the Creatives room. Change to "musee" for the warm museum
// look, or "drawing" for the plain line drawing.
const LOOK: Look = "sketch";

// How many rows the Photography mosaic has.
const PHOTO_ROWS = 2;

// Frame height as a share of the wall's height.
const frameHeights = { small: 0.22, medium: 0.3, large: 0.4 };
// Frame width ÷ height, used only until the photo or video has loaded
// and its real shape is known.
const DEFAULT_RATIO = 1;

// A link to another gallery room.
type Room = { href: string; label: string };

type Props = {
  title: string; // e.g. "Creatives Gallery"
  items?: Creative[]; // framed pieces, each hung on its own
  photos?: Photo[]; // photos laid edge to edge in a mosaic
  look?: Look; // defaults to LOOK above
  previousRoom?: Room; // shown at the start of the wall
  nextRoom?: Room; // shown at the end of the wall
};

export default function GalleryWall({
  title,
  items = [],
  photos = [],
  look = LOOK,
  previousRoom,
  nextRoom,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // The piece currently opened larger, if any.
  const [openItem, setOpenItem] = useState<Creative | null>(null);

  // Scroll sideways with a normal mouse wheel, and with the left/right arrow keys.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function handleWheel(event: WheelEvent) {
      // Only take over up/down scrolling; sideways trackpad swipes already work.
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault(); // stop the page itself from scrolling
        scroller!.scrollLeft += event.deltaY;
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") scroller!.scrollBy({ left: 400, behavior: "smooth" });
      if (event.key === "ArrowLeft") scroller!.scrollBy({ left: -400, behavior: "smooth" });
    }

    // `passive: false` is required so preventDefault() is allowed.
    scroller.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    return () => {
      scroller.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <>
      {/* The hand-drawn wobble used by the sketch look: random noise pushes
          each line slightly off true, like a pencil line. */}
      <svg className={styles.defs} aria-hidden="true">
        <filter id="gallery-pencil">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </svg>

      <div ref={scrollerRef} className={styles.scroller} data-look={look}>
        <div className={styles.wall}>
          {/* Ceiling and floor run the full length of the wall. */}
          <ExposedCeiling />
          <div className={styles.rail} aria-hidden="true" />
          <div className={styles.skirting} aria-hidden="true" />
          <TiledFloor />

          {previousRoom && <RoomLink room={previousRoom} direction="previous" />}

          {/* Drawing title at the start of the wall, like on a drawing sheet. */}
          <div className={styles.titleBlock}>
            <p className={styles.drawingTitle}>{title}</p>
            <p className={styles.drawingSub}>Scroll to stroll →</p>
          </div>

          {items.map((item) => (
            <Bay key={item.id} item={item} onOpen={() => setOpenItem(item)} />
          ))}

          {photos.length > 0 && (
            <PhotoMosaic photos={photos} onOpen={(photo) => setOpenItem(photoAsItem(photo))} />
          )}

          <div className={styles.wallEnd} aria-hidden="true" />

          {nextRoom && <RoomLink room={nextRoom} direction="next" />}
        </div>
      </div>

      {openItem && <ArtworkWindow item={openItem} onClose={() => setOpenItem(null)} />}
    </>
  );
}

// The larger view (ArtworkWindow) expects a Creative, so describe the photo as one.
function photoAsItem(photo: Photo): Creative {
  return {
    id: photo.id,
    kind: "image",
    src: photo.src,
    size: "medium",
    title: photo.title,
    year: photo.year,
    medium: photo.place,
  };
}

// ---------- "Next room" / "Previous room" link ----------
// It fades in when it scrolls into view, so it "shows up" as you reach it.
function RoomLink({ room, direction }: { room: Room; direction: "previous" | "next" }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.6, // counts as "in view" once 60% of it is on screen
    });
    observer.observe(link);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={linkRef}
      href={room.href}
      className={`${styles.roomLink} ${visible ? styles.roomLinkVisible : ""}`}
    >
      {direction === "previous" && <span className={styles.roomArrow}>←</span>}
      <span>{room.label}</span>
      {direction === "next" && <span className={styles.roomArrow}>→</span>}
    </Link>
  );
}

// ---------- Photos laid edge to edge, in rows ----------
// Each photo goes into whichever row is shortest so far, so the rows end up
// about the same length. Then every row is scaled to the same width: rows
// with wider photos get a little shorter, so the block is a neat rectangle
// and no photo is stretched or cropped.
function PhotoMosaic({ photos, onOpen }: { photos: Photo[]; onOpen: (photo: Photo) => void }) {
  const rowCount = Math.min(PHOTO_ROWS, photos.length);
  // Each row's photos, and its "length": the sum of width ÷ height of its photos.
  const rows = Array.from({ length: rowCount }, () => ({ photos: [] as Photo[], length: 0 }));
  for (const photo of photos) {
    const shortest = rows.reduce((a, b) => (b.length < a.length ? b : a));
    shortest.photos.push(photo);
    shortest.length += photo.width / photo.height;
  }

  // How wide the block must be (as a multiple of its height) so that all
  // rows, stacked up, fill its height exactly.
  const widthFactor = 1 / rows.reduce((sum, row) => sum + 1 / row.length, 0);

  return (
    <div className={styles.mosaic} style={{ "--width-factor": widthFactor } as React.CSSProperties}>
      {rows.map((row, index) => (
        <div key={index} className={styles.mosaicRow}>
          {row.photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              className={styles.photo}
              style={{ "--r": photo.width / photo.height } as React.CSSProperties}
              onClick={() => onOpen(photo)}
              aria-label={`View ${photo.title ?? "photo"} larger`}
            >
              <img src={photo.src} alt={photo.title ?? ""} loading="lazy" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------- One hanging piece: light, frame, label and optional bench ----------
// The frame takes the exact shape of its photo or video: once the file has
// loaded, we read its real width and height and size the frame to match.
function Bay({ item, onOpen }: { item: Creative; onOpen: () => void }) {
  const [ratio, setRatio] = useState(DEFAULT_RATIO);

  // useCallback keeps this the same function between renders,
  // so the photo/video don't re-run their setup every time.
  const measure = useCallback((width: number, height: number) => {
    if (width > 0 && height > 0) setRatio(width / height);
  }, []);

  return (
    <div
      className={styles.bay}
      style={
        {
          "--h": frameHeights[item.size], // frame height (share of wall height)
          "--ratio": ratio, // frame width ÷ height
        } as React.CSSProperties
      }
    >
      <SpotLight />

      <button
        type="button"
        className={styles.frame}
        onClick={onOpen}
        aria-label={`View ${item.title ?? "artwork"} larger`}
      >
        <span className={styles.mat}>
          {item.kind === "video" ? (
            <WallVideo src={item.src} poster={item.poster} onSize={measure} />
          ) : (
            <WallImage src={item.src} alt={item.title ?? ""} onSize={measure} />
          )}
        </span>
      </button>

      {(item.title || item.year || item.medium) && (
        <div className={styles.label}>
          {item.title && <strong>{item.title}</strong>}
          <span>{[item.year, item.medium].filter(Boolean).join(" — ")}</span>
        </div>
      )}

      {item.bench && <Bench />}
    </div>
  );
}

type OnSize = (width: number, height: number) => void;

// ---------- A photo that reports its real size once loaded ----------
function WallImage({ src, alt, onSize }: { src: string; alt: string; onSize: OnSize }) {
  const imgRef = useRef<HTMLImageElement>(null);

  // If the photo was already loaded (e.g. from the browser cache) before
  // React was ready, onLoad won't fire, so check once here as well.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) onSize(img.naturalWidth, img.naturalHeight);
  }, [onSize]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={styles.media}
      onLoad={(event) => onSize(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)}
    />
  );
}

// ---------- Exposed ceiling: slab, beams, a duct on hangers and a cable tray ----------
// One 640px-wide module is drawn, then repeated along the whole wall.
// In each drawing, x runs 0–640 (pixels) and y runs 0–100 (% of the band's height).
const MODULES = Array.from({ length: 40 }); // enough repeats to cover a long wall

function ExposedCeiling() {
  return (
    <div className={styles.ceiling} aria-hidden="true">
      {MODULES.map((_, i) => (
        <svg key={i} className={styles.module} viewBox="0 0 640 100" preserveAspectRatio="none">
          {/* Things further back are drawn first, so things in front cover them. */}

          {/* Concrete slab: shaded, with a heavy underside line */}
          <rect x="0" y="0" width="640" height="22" className={styles.slab} />
          <line x1="0" y1="22" x2="640" y2="22" className={styles.heavy} />

          {/* Downstand beams: concrete, same tone as the slab */}
          {[150, 470].map((x) => (
            <rect key={x} x={x} y="22" width="56" height="42" className={styles.concrete} />
          ))}

          {/* Cable tray at the bottom, on long rods that pass behind the duct */}
          {[60, 380].map((x) => (
            <line key={x} x1={x} y1="22" x2={x} y2="84" />
          ))}
          <rect x="-1" y="80" width="642" height="5" className={styles.solid} />

          {/* Duct in front: a long box with a flange joint every 320px */}
          <rect x="-1" y="38" width="642" height="26" className={styles.solid} />
          {[0, 320].map((x) => (
            <rect key={x} x={x} y="36" width="6" height="30" className={styles.solid} />
          ))}

          {/* Short hanger rods holding the duct */}
          {[100, 260, 420, 580].map((x) => (
            <line key={x} x1={x} y1="22" x2={x} y2="38" />
          ))}
        </svg>
      ))}
    </div>
  );
}

// ---------- Tiled floor: tile joints, rows getting taller toward the viewer ----------
function TiledFloor() {
  return (
    <div className={styles.floor} aria-hidden="true">
      {MODULES.map((_, i) => (
        <svg key={i} className={styles.module} viewBox="0 0 640 100" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="640" y2="0" className={styles.heavy} />
          {/* Rows: each one a little taller, as the floor comes toward you */}
          {[12, 30, 56, 92].map((y) => (
            <line key={y} x1="0" y1={y} x2="640" y2={y} />
          ))}
          {/* Tile joints every 80px */}
          {[0, 80, 160, 240, 320, 400, 480, 560].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="100" />
          ))}
        </svg>
      ))}
    </div>
  );
}

// ---------- A ceiling spotlight with its cone of light, drawn as lines ----------
function SpotLight() {
  return (
    <div className={styles.light} aria-hidden="true">
      {/* The light fixture hanging from the rail */}
      <svg className={styles.fixture} viewBox="0 0 40 40">
        <line x1="20" y1="0" x2="20" y2="10" />
        <rect x="10" y="10" width="20" height="8" />
        <path d="M12 18 L8 30 L32 30 L28 18" />
      </svg>
      {/* The cone: two dashed edges with a faint wash in between */}
      <svg className={styles.cone} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="42,0 58,0 100,100 0,100" className={styles.coneFill} />
        <line x1="42" y1="0" x2="0" y2="100" />
        <line x1="58" y1="0" x2="100" y2="100" />
      </svg>
    </div>
  );
}

// ---------- A gallery bench, drawn in elevation ----------
function Bench() {
  return (
    <svg className={styles.bench} viewBox="0 0 200 50" aria-hidden="true">
      <rect x="0" y="8" width="200" height="10" />
      <line x1="16" y1="18" x2="16" y2="50" />
      <line x1="184" y1="18" x2="184" y2="50" />
      <line x1="16" y1="40" x2="184" y2="40" />
    </svg>
  );
}

// ---------- A silent looping video that only plays while it's on screen ----------
function WallVideo({ src, poster, onSize }: { src: string; poster?: string; onSize: OnSize }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Already know the video's size? (readyState 1+ means its details have loaded.)
    if (video.readyState >= 1) onSize(video.videoWidth, video.videoHeight);
    // IntersectionObserver tells us when the video scrolls into or out of view.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [onSize]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={styles.media}
      muted
      loop
      playsInline
      preload="metadata"
      onLoadedMetadata={(event) =>
        onSize(event.currentTarget.videoWidth, event.currentTarget.videoHeight)
      }
    />
  );
}
