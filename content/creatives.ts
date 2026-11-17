// Everything hung on the Creatives gallery wall, from left to right.
// To add a piece, copy one of the objects below and change its values.

export type Creative = {
  id: string; // unique short name, e.g. "sketch-01"
  kind: "image" | "video";
  src: string; // file inside /public, e.g. "/creatives/sketch-01.jpg" or "/creatives/model.mp4"
  poster?: string; // videos only: still image shown before the video loads

  // How the frame is hung
  size: "small" | "medium" | "large";
  // The frame automatically takes the exact shape of the photo or video.
  bench?: boolean; // true = a bench sits on the floor in front of this piece

  // Museum label under the frame (all optional)
  title?: string;
  year?: string;
  medium?: string; // e.g. "Watercolour on paper", "Film photograph"
};

export const creatives: Creative[] = [
  // Labels come from the file names in D:\PortfolioWebsite_originals\creatives,
  // which follow "number-TITLE-Medium, year". ids match the file numbers.
  {
    id: "01",
    kind: "image",
    src: "/creatives/01.jpg",
    size: "medium",
    title: "Portrait of Bruno",
    year: "2022",
    medium: "Watercolour on canvas",
  },
  {
    id: "02",
    kind: "image",
    src: "/creatives/02.jpg",
    size: "medium",
    title: "Portrait of Bruno",
    year: "2023",
    medium: "Watercolour on canvas",
  },
  {
    id: "03",
    kind: "video",
    src: "/creatives/03.mp4",
    poster: "/creatives/03-poster.jpg",
    size: "large",
    bench: true,
    title: "Flowers on the Table",
    year: "2025",
    medium: "Acrylic on cloth",
  },
  {
    id: "04",
    kind: "image",
    src: "/creatives/04.jpg",
    size: "large",
    bench: true,
    title: "Luxor Temple",
    year: "2020",
    medium: "Pencil sketch",
  },
  {
    id: "06",
    kind: "image",
    src: "/creatives/06.jpg",
    size: "medium",
    title: "Skull Series",
    year: "2020",
    medium: "Pencil sketch",
  },
  {
    id: "07",
    kind: "image",
    src: "/creatives/07.jpg",
    size: "medium",
    title: "Skull Series",
    year: "2020",
    medium: "Pencil sketch",
  },
  {
    id: "08",
    kind: "image",
    src: "/creatives/08.jpg",
    size: "medium",
    title: "Portrait of a Doctor",
    year: "2026",
    medium: "Clay & acrylic on canvas",
  },
  {
    id: "09",
    kind: "video",
    src: "/creatives/09.mp4",
    poster: "/creatives/09-poster.jpg",
    size: "large",
    bench: true,
    title: "Wall Mural",
    year: "2025",
    medium: "Acrylic emulsion on wall",
  },
];
