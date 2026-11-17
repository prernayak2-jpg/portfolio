// Turns PDF pages into web-sized JPG design sheets for a project.
//
// Usage (from the portfolio folder):
//   npm run sheets -- <project-slug> <file1.pdf> [file2.pdf ...]
//
// Example:
//   npm run sheets -- arbour-path "D:/PortfolioWebsite_originals/arbour-path/sheets.pdf"
//
// Every page of every PDF becomes one sheet, in order: sheet-01.jpg, sheet-02.jpg, ...
// saved to public/projects/<project-slug>/. Your PDFs are only read, never changed.

import { pdf } from "pdf-to-img";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const TARGET_WIDTH = 2400; // pixels, same as the other project images
const JPG_QUALITY = 82;

// Fonts to use when a PDF doesn't include its own (the folder path must end with "/").
const pdfOptions = {
  docInitParams: {
    standardFontDataUrl: path.resolve("node_modules/pdfjs-dist/standard_fonts") + "/",
  },
};

const [slug, ...pdfFiles] = process.argv.slice(2);
if (!slug || pdfFiles.length === 0) {
  console.error('Usage: npm run sheets -- <project-slug> <file1.pdf> [file2.pdf ...]');
  process.exit(1);
}

const outDir = path.join("public", "projects", slug);
fs.mkdirSync(outDir, { recursive: true });

let sheetNumber = 0;
const written = [];

for (const file of pdfFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Can't find: ${file}`);
    process.exit(1);
  }
  console.log(`Reading ${file}`);

  // Render page 1 at normal size first, to work out how much to enlarge
  // the pages so they come out about TARGET_WIDTH pixels wide.
  const probe = await pdf(file, { ...pdfOptions, scale: 1 });
  const firstPage = await probe.getPage(1);
  const { width } = await sharp(firstPage).metadata();
  await probe.destroy();
  const scale = Math.min(Math.max(TARGET_WIDTH / width, 1), 8);

  const document = await pdf(file, { ...pdfOptions, scale });
  for await (const page of document) {
    sheetNumber += 1;
    const name = `sheet-${String(sheetNumber).padStart(2, "0")}.jpg`;
    const info = await sharp(page)
      .flatten({ background: "#ffffff" }) // PDFs can have see-through backgrounds
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
      .toFile(path.join(outDir, name));
    written.push(name);
    console.log(`  ${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
  await document.destroy();
}

// Old sheets with higher numbers than we just made would be left over, so point them out.
const leftovers = fs
  .readdirSync(outDir)
  .filter((f) => /^sheet-\d+\.jpg$/.test(f) && !written.includes(f));
if (leftovers.length > 0) {
  console.log(`\nNote: these older sheets are still in the folder: ${leftovers.join(", ")}`);
}

// Print the lines to paste into content/projects.ts
console.log(`\nDone: ${written.length} sheets. Paste this into the project in content/projects.ts:\n`);
console.log("    sheets: [");
for (const name of written) console.log(`      { src: "/projects/${slug}/${name}" },`);
console.log("    ],");
