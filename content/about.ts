// Everything shown on the About page lives here.

export type SkillGroup = {
  category: string;
  items: string[];
};

export type Education = {
  degree: string;
  school: string;
  years?: string;
};

export type Job = {
  role: string;
  company: string;
  start: string; // e.g. "2024-05"
  end: string; // e.g. "2024-08" or "Present"
  description?: string;
};

export type About = {
  name: string;
  logo: string; // the name shown in the top bar
  title: string;
  statement: string[];
  photo: string;
  cvFile: string;
  email: string;
  linkedin: string;
  instagram: string;
  phone: string; // with country code, e.g. "+91 98765 43210"
  skills: SkillGroup[];
  education: Education[];
  history: Job[];
};

export const about: About = {
  name: "Prerna Nayak",
  logo: "PRERNAYAK",
  title: "Designer | Architect",
  statement: [
    "A motivated and adaptable Architect with a growing focus on healthcare design and proficiency in BIM technologies. I am driven by a strong desire to learn, explore new ideas, and contribute meaningfully to collaborative design environments.",
  ],
  photo: "/placeholder.svg",
  cvFile: "/cv.pdf", // put your CV at public/cv.pdf
  email: "prernayak2@gmail.com",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/", // PLACEHOLDER: put your profile link here
  phone: "+91 00000 00000", // PLACEHOLDER: put your real number here

  skills: [
    { category: "3D / CAD", items: ["Sketchup", "Revit", "AutoCAD"] },
    { category: "Visualization", items: ["Enscape", "Photoshop", "InDesign" , "Twinmotion"] },
    { category: "Soft skills", items: ["Team coordination", "Story telling"] },
  ],

  education: [
    { degree: "Master of Architecture", school: "Placeholder University" },
    { degree: "Bachelor of Architecture", school: "Placeholder College" },
  ],

  // Most recent job first.
  history: [
    {
      role: "Designer - Healthcare",
      company: "The Design Alphabet",
      start: "2024-08",
      end: "Present",
      description: "Engaged in hospital planning and design, pitch presentations, concept development, 3D modeling, and rendering. Actively involved in BIM workflows and developed an automation system to streamline repetitive tasks, improving team efficiency and design productivity.",
    },
    {
      role: "Architectural Intern",
      company: "Dutta Kannan Partners.",
      start: "2023-01",
      end: "2023-05",
      description: "Handled working drawings, modelling, rendering, BOQs, and client presentations for residential and commercial projects. Gained practical insight through site visits and vendor coordination, enhancing material knowledge and time management under deadlines.",
    },
    {
      role: "Architectural Intern",
      company: "Saldanha & Associates",
      start: "2022-01",
      end: "2022-03",
      description: "Worked on residential projects; prepared working and sanction drawings, developed detailing skills, and gained site experience observing construction processes.",
    },
    {
      role: "Design Intern",
      company: "Raj Consultants",
      start: "2021-07",
      end: "2021-08",
      description: "Assisted in workplace interior projects; created mood/material boards and gained exposure to client interactions, materials, and team workflows.",
    },
  ],
};
