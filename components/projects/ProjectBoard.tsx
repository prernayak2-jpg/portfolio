import Link from "next/link";
import type { ProjectCard } from "@/content/projects";
import styles from "./ProjectBoard.module.css";

type Props = {
  cards: ProjectCard[];
};

// How much each card is tilted (degrees), repeating in this order. Fixed
// rather than random, so the board looks the same on every visit.
const TILTS = [-2, 1.5, -1, 2.2, -1.6, 0.8, 1.2, -2.4];

// All projects as cards pinned up on a board, like the Skills and
// Education sheets: each a print with a pin at the top, hung slightly
// crooked. Images are black and white until hovered. Clicking a card opens
// that project's pop-up.
export default function ProjectBoard({ cards }: Props) {
  return (
    <div className={styles.board}>
      {cards.map((card, index) => (
        <Link
          key={card.slug}
          href={`/projects?open=${card.slug}`}
          scroll={false}
          className={styles.card}
          style={{ "--tilt": `${TILTS[index % TILTS.length]}deg` } as React.CSSProperties}
        >
          <span className={styles.pin} aria-hidden="true" />

          <span className={styles.photo}>
            <img src={card.coverImage} alt="" className={styles.image} loading="lazy" />
            {/* The category, as a small label in the photo's top-left corner. */}
            <span className={styles.tag}>{card.type}</span>
          </span>

          {/* Number, title and year on the paper under the photo. */}
          <span className={styles.info}>
            <span className={styles.id}>
              {card.id} {card.locked && "🔒"}
            </span>
            <span className={styles.title}>{card.title}</span>
            <span className={styles.year}>{card.date}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
