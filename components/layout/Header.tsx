import Link from "next/link";
import { about } from "@/content/about";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.name} aria-label={`${about.name}: home`}>
        {about.logo}
      </Link>

      {/* Right side: email, LinkedIn, Instagram and phone as small icons. */}
      <div className={styles.links}>
        <a href={`mailto:${about.email}`} className={styles.icon} aria-label="Email" title="Email">
          {/* An envelope, drawn as lines. */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
            <path d="M3.5 6.5 L12 13 L20.5 6.5" />
          </svg>
        </a>

        <a
          href={about.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          {/* "in" in a rounded square, drawn as lines like the envelope. */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M8 10.5 V16.5" />
            <circle cx="8" cy="7.6" r="0.6" className={styles.dot} />
            <path d="M11.5 16.5 V10.5 M11.5 13 C11.5 11.3 12.6 10.4 14 10.4 C15.4 10.4 16.2 11.3 16.2 13 V16.5" />
          </svg>
        </a>

        <a
          href={about.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
          aria-label="Instagram"
          title="Instagram"
        >
          {/* A camera: rounded square, lens circle and a small dot, drawn as lines. */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.6" className={styles.dot} />
          </svg>
        </a>

        {/* "tel:" links start a call on phones (spaces removed from the number). */}
        <a
          href={`tel:${about.phone.replace(/\s/g, "")}`}
          className={styles.icon}
          aria-label={`Phone: ${about.phone}`}
          title={about.phone}
        >
          {/* A phone handset, drawn as a line. */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.6 3.5 L9.4 3.5 L10.8 7.8 L8.9 9.4 C9.9 11.6 12.4 14.1 14.6 15.1 L16.2 13.2 L20.5 14.6 L20.5 17.4 C20.5 18.8 19.3 20 17.9 20 C10.3 19.6 4.4 13.7 4 6.1 C4 4.7 5.2 3.5 6.6 3.5 Z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
