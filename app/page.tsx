import { about } from "@/content/about";
import SelfPortrait from "@/components/dashboard/SelfPortrait";
import AboutSection from "@/components/dashboard/AboutSection";
import styles from "./page.module.css";

// Dashboard: the first screen is the self portrait and the intro, filling
// the open Dashboard folder exactly. Scrolling down inside the folder shows
// About Me. Projects are not shown here; they live on the Projects page (/projects).
export default function Home() {
  return (
    <main>
      {/* ---------- First screen ---------- */}
      <div className={styles.dashboard}>
        <div className={styles.content}>
          <div className={styles.intro}>
            <h1>Hi, I&apos;m {about.name}</h1>
            <p>{about.title}</p>
          </div>

          <div className={styles.portrait}>
            <SelfPortrait
              video="/me/self-portrait.mp4"
              image="/me/self-portrait.jpg"
              alt={`Self portrait drawing of ${about.name}`}
            />
          </div>
        </div>

        {/* A hand-drawn "scroll" hint: About Me is further down. */}
        <a href="#about" className={styles.scrollHint}>
          <span>scroll</span>
          <svg viewBox="0 0 24 48" aria-hidden="true">
            {/* A slightly wobbly line and arrowhead, as if drawn by hand. */}
            <path d="M12.5 2 C11 10 13.5 17 12 25 C10.8 31 12.6 37 12 44" />
            <path d="M5 36 C8 39 10 41.5 12 44.5 C13.8 41 16 38.5 19.5 35.5" />
          </svg>
        </a>
      </div>

      {/* ---------- Below it, seen when scrolling down ---------- */}
      <AboutSection />
    </main>
  );
}
