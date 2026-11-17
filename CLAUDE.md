@AGENTS.md

# Project notes

Personal portfolio website. Fully separate from any other project (e.g. compliance-ai): don't reference or touch other repos.

## Working style
- The owner is learning web development. Teach step by step, like it's their first time: explain *what* each step does and *why*, one small step at a time, then check in.
- They run commands themselves in the VS Code terminal. Give commands in separate code blocks (PowerShell on Windows).
- Don't start or kill the dev server yourself. They run `npm run dev` and test it themselves.
- Reference sites are inspiration only: borrow layout/feel/ideas, never copy code or assets.

## Stack & decisions
- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + ESLint
- Styling: plain CSS + CSS Modules. **No Tailwind** (deliberately declined).
- Fonts: Rock Salt for big headings (h1, gallery titles, carousel project names), Josefin Sans for everything else. Set in app/layout.tsx via next/font.
- Planned structure:
  - `content/` holds all text/data (bio, projects, experience, links) so updates are data edits, not component edits
  - `theme.css` holds design tokens as CSS variables (colors, fonts, spacing), with light + dark mode
  - One component per section (Hero, About, Projects, Experience, Contact) so they can be reordered/restyled
- Hosting: Vercel (via GitHub). Deferred to a later session by choice.

## Site structure (decided 2026-09-27)
Owner works in architecture design. Reference site: https://al3xx.li (use as structural base, not to copy).
- Tried and **rejected** (2026-11-17): putting all pages on one sideways-scrolling strip with "Next/Previous room" doors between them. Owner disliked the scroll movement; site went back to separate pages. Don't reintroduce it.
- **Folder stack frames every page (2026-11-17):** components/layout/FolderStack.tsx in app/layout.tsx. One black-and-white file folder per Index page (content/navigation.ts), stacked top to bottom in Index order (01 Dashboard at the top), full screen width, tabs sticking up at staggered positions (TAB_OFFSETS), a note at each band's right end. The current page's folder is open and fills the screen, with the page inside it; folders before it are pushed up as thin bands, folders after it stay as bands at the bottom; it slides open (flex-grow transition) when navigating. Tall pages scroll inside the open folder. Hovering a closed folder lifts it. Photography opens inside the Creatives folder (`alsoOpenOn`). Sizes in globals.css (`--fold-edge`, `--fold-tab-h`); full-screen pages size themselves with `--folder-content-h`. Folders have no z-index on purpose (pop-ups must not be trapped). Replaced the floating INDEX button (removed).
- `/` Dashboard: self-portrait drawing video (plays once, then the finished image; hover or click replays) and intro text, as the first screen, filling the open Dashboard folder exactly; About Me follows below it. Owner decided (2026-10-29) not to show projects on the Dashboard; the `selected` flag in projects.ts is currently unused.
- `/projects` Board of all projects (2026-11-17; earlier tried a horizontal carousel, then drifting looping columns like al3xx.li/#archive): cards pinned up like the About Me Skills/Education sheets: dotted notebook paper, a pin at the top, fixed slight tilts (TILTS), landscape 3:2 photo in greyscale that turns colour on hover, type tag, id, title (Rock Salt), year (components/projects/ProjectBoard.tsx). Hover straightens and lifts a card. Clicking opens the project pop-up.
- About Me (2026-11-17): no page or folder of its own any more. It's on the Dashboard below the first screen (components/dashboard/AboutSection.tsx, `#about`), seen by scrolling down inside the Dashboard folder: name, statement, photo, Download CV button, skills, education, work history. `/about` redirects to `/#about` (next.config.ts).
- Projects open in a **pop-up window** over the current page, NOT as separate pages. Window has a title bar with a **maximize/restore** button and an **X** close button. No previous/next project links.
- Closing a project pop-up takes the viewer to the `/projects` carousel.
- Project pop-up sections, in order (all optional, rendered only if filled): ID · date · type (Academic/Work/Competition), title, hero image, query, objectives, mission brief, tech stack, team, coordinates, design sheets.
- `/creatives` Creatives gallery: horizontally scrolling wall in elevation (components/creatives/GalleryWall.tsx), framed pieces from content/creatives.ts. Look switch `LOOK` at top of GalleryWall.tsx, currently "sketch" (2026-11-17: grey hand-drawn pencil lines on paper grain via the #gallery-pencil SVG filter; only the artworks in the frames keep colour). Photography uses "sketch" too. Other looks: "musee", "drawing", "theatre". Looks are separate blocks in GalleryWall.module.css so they can be undone.
- `/photography` Photography gallery (added 2026-10-15): reached by the "Next room" link at the end of Creatives. Same wall, `look="sketch"` (hand-drawn grey, like Creatives; was "theatre" dark until 2026-11-17). Photos from content/photography.ts are laid edge to edge in a justified mosaic (PHOTO_ROWS rows), keeping each photo's aspect ratio; needs each photo's width/height in the data. Not in the menu (yet).
- `/side-quests` Side Quests (added 2026-10-29): placeholder page, content still to be decided.
- Index order: 01 Dashboard, 02 Projects (carousel), 03 Side Quests, 04 Creatives (`--fold-count` in globals.css must match) (the folder stack). The header is a slim deep-grey top bar (28px): name (top-left); email, LinkedIn and phone icons (top-right; phone number in content/about.ts). No footer on any page.
- Each open project updates the address bar (e.g. `/projects?open=crossroads`) so a project can be shared by link; visiting that link opens the pop-up directly.
- **Locked projects** (planned, after the shell): projects flagged `locked` need an access code to open. Codes must expire automatically after a few weeks with no manual rotation. Locked content must be checked on the server and never shipped to the browser before unlocking (a browser-only PIN check is not real protection). Decided: **per-person expiring codes** (Option B): owner generates a code on a private page, picks duration (e.g. 3 weeks) and optionally which projects; code is signed with a server secret and carries its own expiry (no database); can also be shared as a link. `locked` defaults to false. Shell shows the lock screen; real server-side unlocking is built after the shell.
- Build the shell first (plain/unstyled) to learn the flow; design concept comes after.

## Images & PDFs workflow
- C: drive is nearly full. Full-size originals live on D: in `D:\PortfolioWebsite_originals\<slug>\`; the site only gets web-sized copies (~2400px wide JPG, quality 82, via sharp) in `public/projects/<slug>/`. Never put big originals in the repo.
- PDF design sheets: `npm run sheets -- <slug> <file.pdf> [...]` (scripts/pdf-to-sheets.mjs) turns every page into `sheet-NN.jpg` and prints the `sheets:` lines for projects.ts.
- A project's `pdf` field adds a "Download PDF" button next to its design sheets. Keep downloadable PDFs small (GitHub rejects files over 100 MB).
- Use `--cache "D:/npm-cache"` for npm installs to keep C: free.
- Photography: originals in `D:\PortfolioWebsite_Creatives\photography` (mostly HEIC). `npm run photos -- "<folder>"` (scripts/photos-vintage.mjs) converts HEIC → JPG into a `jpg` subfolder, writes vintage black-and-white web copies to `public/photography/NN.jpg` (sorted by file name), and prints the `photos` list with width/height for content/photography.ts.
- HEIC elsewhere (e.g. Creatives): convert with the `heic-convert` package; sharp can't read HEIC.

## Locations
- Code: `C:\Users\prern\Documents\PortfolioWebsite_ai\portfolio` (git repo, branch `main`)
- Dev server usually runs on http://localhost:3001 (3000 is often taken by another project)

## Timeline (3 weeks, started 2026-09-23)
- Week 1: foundation (structure, theme, layout, nav, section skeletons, deploy)
- Week 2: build every section with real content, project case-study pages, responsive, dark mode
- Week 3: polish (animations, SEO/Open Graph, performance, accessibility, contact form), ship

## Progress
- 2026-09-23: Project created, runs locally, name added to homepage + tab title, first commit made. Not yet on GitHub/Vercel.
- Next session: owner will share reference websites they like. Analyze them, propose a design direction, then set up `content/`, `theme.css`, and section components.
