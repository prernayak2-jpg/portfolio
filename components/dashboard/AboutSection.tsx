import { about } from "@/content/about";
import styles from "./AboutSection.module.css";

// About Me, shown on the Dashboard below the first screen: the statement and
// CV button, then skills, education and work history. (Name and title are
// already on the first screen, so they aren't repeated here.)
// (It used to be its own page; /about now leads here.)
export default function AboutSection() {
  return (
    <section id="about" className={styles.page}>
      {/* ---------- Intro ---------- */}
      <div className={styles.intro}>
        {about.statement.map((paragraph, index) => (
          <p key={index} className={styles.statement}>
            {paragraph}
          </p>
        ))}

        {/* `download` tells the browser to save the file instead of opening it. */}
        <a href={about.cvFile} download className={styles.button}>
          Download CV ↓
        </a>
      </div>

      {/* ---------- Details: Skills + Education on the left, History on the right ---------- */}
      <div className={styles.details}>
        <div className={styles.leftColumn}>
          {/* Skills and Education: sheets of dotted notebook paper, pinned up. */}
          <section className={`${styles.paper} ${styles.tiltLeft}`}>
            <span className={styles.pin} aria-hidden="true" />
            <h3 className={styles.heading}>Skills</h3>
            {about.skills.map((group) => (
              <div key={group.category} className={styles.skillGroup}>
                <h4 className={styles.label}>{group.category}</h4>
                <ul className={styles.tags}>
                  {group.items.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className={`${styles.paper} ${styles.tiltRight}`}>
            <span className={styles.pin} aria-hidden="true" />
            <h3 className={styles.heading}>Education</h3>
            <ul className={styles.list}>
              {about.education.map((item) => (
                <li key={item.degree}>
                  <strong>{item.degree}</strong>
                  <span className={styles.label}>{item.school}</span>
                  {item.years && <span className={styles.label}>{item.years}</span>}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* History: a timeline. Dates on the left, a line joining a dot for
            each job, and the job itself on the right. */}
        <section className={styles.history}>
          <h3 className={styles.heading}>History</h3>
          <ol className={styles.timeline}>
            {about.history.map((job) => (
              <li key={`${job.company}-${job.start}`} className={styles.job}>
                <span className={styles.date}>
                  {job.start} – {job.end}
                </span>
                <div className={styles.jobText}>
                  <strong>{job.role}</strong>
                  <span className={styles.label}>{job.company}</span>
                  {job.description && <p className={styles.description}>{job.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
