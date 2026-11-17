// All project content lives here. To add a project, copy one of the
// objects in the `projects` list below and change its values.

export type DesignSheet = {
  src: string; // image path inside /public, e.g. "/projects/crossroads/sheet-1.jpg"
  caption?: string;
};

export type Project = {
  // --- Required ---
  slug: string; // short name used in the link: /projects?open=crossroads
  id: string; // display number, e.g. "01"
  title: string;

  // --- Switches (true / false) ---
  selected?: boolean; // true = show on the Dashboard. Default: false
  locked?: boolean; // true = needs an access code to open. Default: false

  // --- Card info (shown on Dashboard + carousel, even when locked) ---
  summary?: string; // one-line description
  coverImage?: string;

  // --- Pop-up sections (every one is optional; empty ones are hidden) ---
  date?: string;
  type?: string; // any label, e.g. "Academic", "Work", "Competition", "Academic | BIM Tools"
  heroImage?: string;
  query?: string; // the central question the project answers
  objectives?: string[];
  brief?: string; // the mission brief paragraph
  techStack?: string[];
  team?: string;
  coordinates?: string;
  sheets?: DesignSheet[];
  pdf?: string; // full PDF for the "Download PDF" button, e.g. "/projects/crossroads/crossroads.pdf"
  pdfLabel?: string; // the button's text. Default: "Download PDF"
};

// The small set of fields shown on a project's card (Dashboard + carousel).
// Cards only ever get these fields, so the details of a locked project
// are never sent to the visitor's browser just by showing its card.
export type ProjectCard = Pick<
  Project,
  "slug" | "id" | "title" | "summary" | "coverImage" | "date" | "type" | "locked"
>;

export function toCard(project: Project): ProjectCard {
  return {
    slug: project.slug,
    id: project.id,
    title: project.title,
    summary: project.summary,
    coverImage: project.coverImage,
    date: project.date,
    type: project.type,
    locked: project.locked ?? false,
  };
}

// Finds a project by its slug (the name in the link). Returns undefined if none matches.
export function findProject(slug: string | string[] | undefined): Project | undefined {
  if (typeof slug !== "string") return undefined;
  return projects.find((project) => project.slug === slug);
}

export const projects: Project[] = [
  {
    slug: "arbour-path",
    id: "04",
    title: "Arbour Path",
    selected: true,
    summary: "Placeholder one-line description of Arbour Path",
    coverImage: "/projects/arbour-path/cover.jpg",
    date: "2025",
    type: "Academic | BIM Tools", // Academic | Work | Competition | Personal
    heroImage: "/projects/arbour-path/hero.jpg",
    query: "Placeholder: what central question does Arbour Path answer?",
    objectives: [
      "Creating an informed model of the project using BIM tools",
    ],
    brief:
      "The Arbour path Residences is a premium high-rise residential development comprising two elegant towers rising above a shared podium structure. The vertical configuration is organized into stacked parking basements, amenity levels, and residential floors, creating a seamless transition from communal to private spaces. The podium serves as an active social hub, accommodating landscaped gardens, outdoor recreation zones, and shared amenities that promote interaction and well-being. Designed for modern urban living, the project combines functionality, comfort, and sustainability within a cohesive architectural framework.The project adopts Building Information Modeling (BIM) methodologies to integrate all stages of design and planning within a unified digital environment. By implementing ISO 19650 standards, a structured framework for information management is established enabling consistent data exchange, collaborative coordination, and traceable documentation throughout the project lifecycle.", 
    techStack: ["Revit", "SketchUp", "Enscape", "Photoshop"],
    team: "Placeholder: individual project, or team size and your role",
    coordinates: "Placeholder: coordinates and city, e.g. 12°58'N 77°35'E, Bengaluru, India",
    sheets: [
      { src: "/projects/arbour-path/sheet-01.jpg" },
      { src: "/projects/arbour-path/sheet-02.jpg" },
      { src: "/projects/arbour-path/sheet-03.jpg" },
      { src: "/projects/arbour-path/sheet-04.jpg" },
      { src: "/projects/arbour-path/sheet-05.jpg" },
      { src: "/projects/arbour-path/sheet-06.jpg" },
      { src: "/projects/arbour-path/sheet-07.jpg" },
    ],
  },
  {
    slug: "nexus-square",
    id: "05",
    title: "Nexus Square",
    selected: true,
    summary: "Placeholder one-line description of Nexus Square",
    coverImage: "/projects/nexus-square/cover.jpg",
    date: "2025",
    type: "Academic | BIM Tools",
    heroImage: "/projects/nexus-square/hero.jpg",
    query: "Placeholder: what central question does Nexus Square answer?",
    objectives: [
      "Placeholder objective one",
      "Placeholder objective two",
      "Placeholder objective three",
    ],
    brief:
      "Placeholder mission brief. Describe the site, the idea behind Nexus Square, and how the design responds to it.",
    techStack: ["Revit", "SketchUp", "Enscape", "Photoshop"],
    team: "Placeholder: individual project, or team size and your role",
    coordinates: "Placeholder: coordinates and city, e.g. 12°58'N 77°35'E, Bengaluru, India",
    sheets: [
      { src: "/projects/nexus-square/sheet-02.jpg" },
      { src: "/projects/nexus-square/sheet-03.jpg" },
      { src: "/projects/nexus-square/sheet-04.jpg" },
      { src: "/projects/nexus-square/sheet-05.jpg" },
      { src: "/projects/nexus-square/sheet-06.jpg" },
      { src: "/projects/nexus-square/sheet-07.jpg" },
      { src: "/projects/nexus-square/sheet-08.jpg" },
    ],
  },
  {
    slug: "metamorphosis",
    id: "06",
    title: "Metamorphosis",
    selected: true,
    summary: "A rehabilitation centre for amputees on Wellington Island, Kochi",
    coverImage: "/projects/metamorphosis/cover.jpg",
    date: "2024",
    type: "Academic | Thesis",
    heroImage: "/projects/metamorphosis/hero.jpg",
    query: "Placeholder: what central question does Metamorphosis answer?",
    // Brief taken from the text on sheet 1. Edit freely.
    brief:
      "Located on Wellington Island, Kochi, Metamorphosis is dedicated to providing comprehensive care for patients following amputation and during wound healing. Healing for an amputee is multifaceted, involving physical recovery, mental well-being, and relearning daily activities. The centre's concept of evolution, akin to a caterpillar transforming into a butterfly, follows the journey of the patients: from a clinical block for initial healing and prosthetic fitting, through the 'pupa' phase of physiotherapy, hydrotherapy, psychotherapy, music and art therapy, to a community centre where they emerge as confident individuals ready to reintegrate into society.",
    team: "Individual thesis project",
    coordinates: "Wellington Island, Kochi, India",
    sheets: [
      { src: "/projects/metamorphosis/sheet-01.jpg" },
      { src: "/projects/metamorphosis/sheet-02.jpg" },
      { src: "/projects/metamorphosis/sheet-03.jpg" },
      { src: "/projects/metamorphosis/sheet-04.jpg" },
      { src: "/projects/metamorphosis/sheet-05.jpg" },
      { src: "/projects/metamorphosis/sheet-06.jpg" },
      { src: "/projects/metamorphosis/sheet-07.jpg" },
      { src: "/projects/metamorphosis/sheet-08.jpg" },
      { src: "/projects/metamorphosis/sheet-09.jpg" },
      { src: "/projects/metamorphosis/sheet-10.jpg" },
    ],
    pdf: "/projects/metamorphosis/metamorphosis.pdf",
    pdfLabel: "Download detailed project",
  },
];
