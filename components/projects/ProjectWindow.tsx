"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, ProjectCard } from "@/content/projects";
import SheetViewer from "./SheetViewer";
import styles from "./ProjectWindow.module.css";

type Props = {
  project: Project | ProjectCard; // locked projects only get their card info
  locked: boolean;
};


export default function ProjectWindow({ project, locked }: Props) {
  const router = useRouter();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Escape closes the window.
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeWindow(router);
    }
    window.addEventListener("keydown", handleKey);

    // Stop the page behind the window from scrolling while it's open.
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [router]);

  return (
    // Clicking the dark backdrop (outside the window) also closes it.
    <div className={styles.backdrop} onClick={() => closeWindow(router)}>
      <div
        className={isMaximized ? `${styles.window} ${styles.maximized}` : styles.window}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        onClick={(event) => event.stopPropagation()} // clicks inside don't close it
      >
        {/* ---------- Title bar ---------- */}
        <div className={styles.titleBar}>
          <span>{project.title}</span>
          <div className={styles.windowButtons}>
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              aria-label={isMaximized ? "Restore window size" : "Maximize window"}
            >
              {isMaximized ? "❐" : "□"}
            </button>
            <button type="button" onClick={() => closeWindow(router)} aria-label="Close project">
              ✕
            </button>
          </div>
        </div>

        {/* ---------- Content ---------- */}
        <div className={styles.content}>
          <p className={styles.meta}>
            ID: {project.id}
            {project.date && ` // DATE: ${project.date}`}
            {project.type && ` // ${project.type.toUpperCase()}`}
          </p>
          <h1 id="project-title" className={styles.title}>
            {project.title}
          </h1>

          {locked ? <LockScreen /> : <ProjectDetails project={project as Project} />}
        </div>
      </div>
    </div>
  );
}

// ---------- The project's sections. Each one only shows if it has content. ----------
function ProjectDetails({ project }: { project: Project }) {
  const hasSidebar = project.techStack || project.team || project.coordinates;
  // Which design sheet is open in the viewer (null = viewer closed).
  const [viewingSheet, setViewingSheet] = useState<number | null>(null);

  return (
    <>
      {project.heroImage && <img src={project.heroImage} alt="" className={styles.hero} />}

      <div className={hasSidebar ? styles.columns : undefined}>
        <div className={styles.main}>
          {project.query && (
            <section className={styles.section}>
              <h2 className={styles.label}>Query</h2>
              <blockquote className={styles.query}>“{project.query}”</blockquote>
            </section>
          )}

          {project.objectives && project.objectives.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.label}>Objectives</h2>
              <ol className={styles.objectives}>
                {project.objectives.map((objective, index) => (
                  <li key={objective}>
                    <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                    {objective}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {project.brief && (
            <section className={styles.section}>
              <h2 className={styles.label}>Mission Brief</h2>
              <p className={styles.brief}>{project.brief}</p>
            </section>
          )}
        </div>

        {hasSidebar && (
          <aside className={styles.sidebar}>
            {project.techStack && project.techStack.length > 0 && (
              <section className={styles.box}>
                <h2 className={styles.label}>Tech Stack</h2>
                <ul className={styles.tags}>
                  {project.techStack.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </section>
            )}
            {project.team && (
              <section className={styles.box}>
                <h2 className={styles.label}>Team</h2>
                <p>{project.team}</p>
              </section>
            )}
            {project.coordinates && (
              <section className={styles.box}>
                <h2 className={styles.label}>Coordinates</h2>
                <p>{project.coordinates}</p>
              </section>
            )}
          </aside>
        )}
      </div>

      {project.sheets && project.sheets.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sheetsHeader}>
            <h2 className={styles.label}>Design Sheets ({project.sheets.length})</h2>
            {/* `download` saves the file instead of opening it */}
            {project.pdf && (
              <a href={project.pdf} download className={styles.download}>
                {project.pdfLabel ?? "Download PDF"} ↓
              </a>
            )}
          </div>
          <div className={styles.sheets}>
            {project.sheets.map((sheet, index) => (
              <button
                key={index}
                type="button"
                className={styles.sheetButton}
                onClick={() => setViewingSheet(index)}
                aria-label={`View sheet ${index + 1}`}
              >
                <img src={sheet.src} alt={sheet.caption ?? ""} />
                {sheet.caption && <span className={styles.caption}>{sheet.caption}</span>}
              </button>
            ))}
          </div>

          {viewingSheet !== null && (
            <SheetViewer
              sheets={project.sheets}
              index={viewingSheet}
              onChange={setViewingSheet}
              onClose={() => setViewingSheet(null)}
            />
          )}
        </section>
      )}
    </>
  );
}

// ---------- Shown instead of the details when a project is locked ----------
// The code box is a placeholder: real unlocking is built in Step 8.
function LockScreen() {
  const [message, setMessage] = useState("");

  return (
    <form
      className={styles.lock}
      onSubmit={(event) => {
        event.preventDefault(); // stop the page from reloading
        setMessage("Unlocking isn't built yet. It comes in Step 8.");
      }}
    >
      <p>🔒 This project is private. Enter your access code to view it.</p>
      <input type="text" placeholder="Access code" aria-label="Access code" />
      <button type="submit">Unlock</button>
      {message && <p className={styles.label}>{message}</p>}
    </form>
  );
}

// Closing takes the viewer to the Projects carousel ("?open=…" leaves the address).
function closeWindow(router: ReturnType<typeof useRouter>) {
  router.push("/projects", { scroll: false });
}
