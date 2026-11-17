// Prepares photos for the Photography gallery.
//
// Usage (from the portfolio folder):
//   npm run photos -- "<folder with your photos>"
//
// Example:
//   npm run photos -- "D:/PortfolioWebsite_Creatives/photography"
//
// For each photo in the folder (sorted by file name):
//   1. HEIC/HEIF files are converted to full-quality JPGs, saved in a "jpg"
//      folder next to them. Your original files are never changed.
//   2. A web-sized, vintage black-and-white copy is saved to
//      public/photography/01.jpg, 02.jpg, ...
// At the end it prints the lines to paste into content/photography.ts.

import convertHeic from "heic-convert";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const LONG_EDGE = 1600; // pixels on the longest side
const JPG_QUALITY = 84;

const folder = process.argv[2];
if (!folder || !fs.existsSync(folder)) {
  console.error('Usage: npm run photos -- "<folder with your photos>"');
  process.exit(1);
}

const isHeic = (f) => /\.(heic|heif)$/i.test(f);
const isPhoto = (f) => isHeic(f) || /\.(jpe?g|png)$/i.test(f);
const files = fs
  .readdirSync(folder)
  .filter(isPhoto)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const jpgFolder = path.join(folder, "jpg");
const outFolder = path.join("public", "photography");
fs.mkdirSync(jpgFolder, { recursive: true });
fs.mkdirSync(outFolder, { recursive: true });

const entries = [];

for (const [index, file] of files.entries()) {
  const id = String(index + 1).padStart(2, "0");
  const source = path.join(folder, file);

  // 1. Get a JPG to work from (convert HEIC once; reuse it next time).
  let jpgPath = source;
  if (isHeic(file)) {
    jpgPath = path.join(jpgFolder, file.replace(/\.(heic|heif)$/i, ".jpg"));
    if (!fs.existsSync(jpgPath)) {
      const output = await convertHeic({
        buffer: fs.readFileSync(source),
        format: "JPEG",
        quality: 0.95,
      });
      fs.writeFileSync(jpgPath, Buffer.from(output));
    }
  }

  // 2. Resize, then make it black and white with a vintage feel.
  const base = await sharp(jpgPath)
    .rotate() // stand photos upright if the camera saved them sideways
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: "inside", withoutEnlargement: true })
    .grayscale()
    .linear(0.86, 18) // fade: lift the blacks and soften the whites, like old prints
    .toBuffer({ resolveWithObject: true });
  const { width, height } = base.info;

  // Film grain: random grey speckle, blended in softly.
  const grain = await sharp({
    create: { width, height, channels: 3, background: "#808080", noise: { type: "gaussian", mean: 128, sigma: 28 } },
  })
    .grayscale()
    .png()
    .toBuffer();

  // Vignette: the corners fade gently darker.
  const vignette = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs><radialGradient id="v" cx="50%" cy="50%" r="75%">
        <stop offset="55%" stop-color="#fff"/><stop offset="100%" stop-color="#9a9a9a"/>
      </radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`
  );

  const info = await sharp(base.data)
    .composite([
      { input: grain, blend: "soft-light" },
      { input: vignette, blend: "multiply" },
    ])
    .tint({ r: 238, g: 232, b: 224 }) // the faintest warm paper tone, so it still reads as black and white
    .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
    .toFile(path.join(outFolder, `${id}.jpg`));

  entries.push({ id, file, width: info.width, height: info.height });
  console.log(`  ${id}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB  (from ${file})`);
}

console.log(`\nDone: ${entries.length} photos. Paste this into content/photography.ts:\n`);
console.log("export const photos: Photo[] = [");
for (const e of entries) {
  console.log(`  { id: "${e.id}", src: "/photography/${e.id}.jpg", width: ${e.width}, height: ${e.height} }, // ${e.file}`);
}
console.log("];");
