"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { indexLinks } from "@/content/navigation";
import styles from "./FolderStack.module.css";

// How far from the left each folder's tab sits (px), in Index order.
// Picked to look random, but fixed so the folders don't jump around on
// every visit. Change these to restagger the tabs. (On wide screens they're
// spread out further by --tab-scale in the CSS.)
const TAB_OFFSETS = [24, 60, 24, 110]; // Side Quests lines up with Dashboard

// Which folder belongs to this page (the Dashboard if none matches).
function openFolderFor(pathname: string) {
  const index = indexLinks.findIndex(
    (link) =>
      link.href === pathname ||
      (link.href !== "/" && pathname.startsWith(link.href)) ||
      link.alsoOpenOn?.some((page) => pathname.startsWith(page)),
  );
  return index === -1 ? 0 : index;
}

// The frame of the whole site: a stack of file folders, one per page in the
// Index, in order from the top. The current page's folder is open, filling
// the screen, and the page sits inside it. The folders before it are pushed
// up into thin bands at the top, the ones after it stay as bands at the
// bottom. Clicking a folder goes to its page, and its folder slides open.
export default function FolderStack({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const openIndex = openFolderFor(pathname);

  return (
    <div className={styles.stack}>
      {indexLinks.map((link, index) => {
        const isOpen = index === openIndex;
        return (
          <section
            key={link.href}
            className={isOpen ? `${styles.folder} ${styles.open}` : styles.folder}
            aria-label={link.label}
            // Each folder is drawn in front of the one above it simply because it
            // comes later in the page. (No z-index on purpose: it would trap
            // pop-ups like the project window underneath the folders in front.)
            style={{ "--tab-x": `${TAB_OFFSETS[index % TAB_OFFSETS.length]}px` } as React.CSSProperties}
          >
            {/* The folder itself. Open: the page sits inside it.
                Closed: the whole band is a link to its page too. */}
            <div className={styles.body}>
              <span className={styles.note}>
                {link.note} {isOpen ? "v" : "<"}
              </span>

              {isOpen ? (
                <div className={styles.content}>{children}</div>
              ) : (
                // A bigger click area for the same link as the tab (hidden
                // from screen readers and the Tab key, so it isn't listed twice).
                <Link href={link.href} className={styles.bandLink} tabIndex={-1} aria-hidden="true" />
              )}
            </div>

            {/* The tab: a sloped end, a straight middle with the name, and
                the same slope flipped at the other end. It comes after the
                folder's paper so it's drawn on top of the paper's top line,
                joining the two into one piece. */}
            <Link href={link.href} className={styles.tab} aria-current={isOpen ? "page" : undefined}>
              <TabEnd />
              <span className={styles.tabMiddle}>{link.label}</span>
              <TabEnd flipped />
            </Link>
          </section>
        );
      })}
    </div>
  );
}

// One end of a tab: a small soft corner where it leaves the folder (bottom
// left), a straight slope up, and a rounded corner into the tab's top edge.
function TabEnd({ flipped = false }: { flipped?: boolean }) {
  const slope = "M0 50 Q0 42 5 37 L30 10 C34.5 5 34 0.75 44 0.75";
  return (
    <svg
      className={flipped ? `${styles.tabEnd} ${styles.flipped}` : styles.tabEnd}
      viewBox="0 0 44 50"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* The paper under the slope (also hides the folder's top line there)… */}
      <path className={styles.paper} d={`${slope} L44 52 L0 52 Z`} />
      {/* …and the outline along it. */}
      <path className={styles.outline} d={slope} />
    </svg>
  );
}
