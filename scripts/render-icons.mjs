// Renders the app icons from scripts/logo.svg. Run after changing the logo: node scripts/render-icons.mjs
import { readFileSync } from "node:fs";
import sharp from "sharp";

const logo = readFileSync(new URL("./logo.svg", import.meta.url), "utf8");
// Square corners for icons the phone rounds or crops itself.
const square = logo.replace('rx="116"', 'rx="0"');
// Maskable: the drawing shrunk into the middle 80%, so a circle or squircle crop never cuts it.
const maskable = square.replace("<g>", '<g transform="translate(51.2 51.2) scale(.8)">');

const outputs = [
  ["public/icon-192.png", logo, 192],
  ["public/icon-512.png", logo, 512],
  ["public/icon-maskable-512.png", maskable, 512],
  ["src/app/apple-icon.png", square, 180],
  ["src/app/icon.png", logo, 48],
];
for (const [file, svg, size] of outputs) {
  let image = sharp(Buffer.from(svg), { density: 72 * (size / 512) * 4 }).resize(size, size);
  // Square icons have no see-through corners (iPhone would fill them with black).
  if (svg !== logo) image = image.flatten({ background: "#26093f" });
  await image.png().toFile(new URL(`../${file}`, import.meta.url).pathname);
  console.log("wrote", file);
}
