// The pages in the Index, in order: one folder each in the folder stack
// that frames every page (components/layout/FolderStack.tsx).
// `note` is the small text at the right end of each folder: placeholders
// for now, change them to whatever you like.
// `alsoOpenOn` lists other pages that open inside this folder.
// (About Me has no folder of its own: it's on the Dashboard, below the
// first screen.) If you add or remove a page, also change --fold-count in
// app/globals.css.

export const indexLinks: { label: string; href: string; note: string; alsoOpenOn?: string[] }[] = [
  { label: "About Me", href: "/", note: "Where it all begins" }, // the Dashboard
  { label: "Projects", href: "/projects", note: "Selected work" },
  { label: "Side Quests", href: "/side-quests", note: "Detours & experiments" },
  { label: "Creatives", href: "/creatives", note: "Art & photography", alsoOpenOn: ["/photography"] },
];
