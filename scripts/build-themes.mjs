// Builds src/app/themes.generated.css from src/app/globals.css.
// Runs before every `npm run dev` and `npm run build`, so new styles are themed automatically.
// For each theme, light backgrounds, dark text and light borders are remapped by brightness,
// while saturated accent colours (saffron, pink, greens on buttons) are kept as they are.
import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = new URL("../src/app/globals.css", import.meta.url);
const OUTPUT = new URL("../src/app/themes.generated.css", import.meta.url);

function hexToRgb(hex) {
  let value = hex.slice(1);
  if (value.length === 3) value = [...value].map((char) => char + char).join("");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}

function rgbToHex(rgb) {
  return `#${rgb.map((channel) => Math.round(Math.max(0, Math.min(255, channel))).toString(16).padStart(2, "0")).join("")}`;
}

function luminance([red, green, blue]) {
  const linear = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function saturation([red, green, blue]) {
  const max = Math.max(red, green, blue) / 255;
  const min = Math.min(red, green, blue) / 255;
  const lightness = (max + min) / 2;
  if (max === min) return 0;
  return (max - min) / (1 - Math.abs(2 * lightness - 1));
}

function mix(from, to, amount) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  return rgbToHex(start.map((channel, index) => channel + (end[index] - channel) * amount));
}

const clamp = (value) => Math.max(0, Math.min(1, value));

const THEMES = {
  neon: {
    surface: (light) => mix("#1b1435", "#2d2357", clamp((1 - light) / 0.3)),
    text: (light) => mix("#f5f0ff", "#a99fd0", clamp(light / 0.4)),
    border: () => "#3b3166",
    accent: (hex) => mix(hex, "#ffffff", 0.45),
  },
  pastel: {
    surface: (light) => mix("#fff8fc", "#f1e6ff", clamp((1 - light) / 0.3)),
    text: (light) => mix("#2b1055", "#6e5b90", clamp(light / 0.4)),
    border: () => "#f1d3e6",
    accent: () => null,
  },
};

// A colour counts as an accent when it is clearly coloured and not near-black, e.g. saffron #d27833.
function isAccent(rgb) {
  return saturation(rgb) > 0.45 && luminance(rgb) > 0.08;
}

function mapColour(theme, hex, role) {
  const rgb = hexToRgb(hex);
  const light = luminance(rgb);
  if (role === "background") {
    return light > 0.6 ? theme.surface(light) : null;
  }
  if (role === "text") {
    if (light >= 0.45) return null;
    // Deep accent text (e.g. #8a4b17 or #285b9f) would vanish on a dark background, so it is brightened there.
    if (isAccent(rgb)) return light < 0.16 ? theme.accent(hex) : null;
    return theme.text(light);
  }
  if (role === "border") {
    return light > 0.55 ? theme.border() : null;
  }
  if (role === "accent") {
    return theme.accent(hex);
  }
  return null;
}

// Drop comments and one-line at-rules such as @import, which have no block.
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@(import|charset)[^;{]*;/g, "");
}

// Returns rules as { media, selector, body }; skips @keyframes and other at-rules.
function parseRules(css, media = null) {
  const rules = [];
  let index = 0;
  while (index < css.length) {
    const open = css.indexOf("{", index);
    if (open === -1) break;
    const prelude = css.slice(index, open).trim();
    if (prelude.startsWith("@")) {
      let depth = 1;
      let cursor = open + 1;
      while (cursor < css.length && depth > 0) {
        if (css[cursor] === "{") depth += 1;
        if (css[cursor] === "}") depth -= 1;
        cursor += 1;
      }
      if (prelude.startsWith("@media")) rules.push(...parseRules(css.slice(open + 1, cursor - 1), prelude));
      index = cursor;
      continue;
    }
    const close = css.indexOf("}", open);
    rules.push({ media, selector: prelude.replace(/^[;\s]+/, ""), body: css.slice(open + 1, close) });
    index = close + 1;
  }
  return rules;
}

const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const RGBA = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/g;

// Light rgba() backgrounds, e.g. rgba(251, 248, 241, .92), become the theme surface with the same transparency.
function mapRgba(theme, value, role) {
  return value.replace(RGBA, (match, red, green, blue, alpha) => {
    const hex = rgbToHex([Number(red), Number(green), Number(blue)]);
    const mapped = mapColour(theme, hex, role);
    if (!mapped) return match;
    const [r, g, b] = hexToRgb(mapped);
    return alpha === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
  });
}

function themedDeclarations(theme, body) {
  const output = [];
  for (const declaration of body.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon === -1) continue;
    const property = declaration.slice(0, colon).trim();
    const value = declaration.slice(colon + 1).trim();
    const hasHex = HEX.test(value);
    HEX.lastIndex = 0;
    const hasRgba = RGBA.test(value);
    RGBA.lastIndex = 0;
    if (!hasHex && !hasRgba) continue;

    let role = null;
    if (property === "background" || property === "background-color") {
      if (/gradient|url\(/.test(value)) continue;
      role = "background";
    } else if (property === "color") {
      role = "text";
    } else if (property.startsWith("border") || property === "outline") {
      role = "border";
    } else if (property.startsWith("--") && hasHex) {
      // Custom properties: page text colours, light surfaces, borders, and accent colours such as --event-color.
      const rgb = hexToRgb(value.match(HEX)[0]);
      HEX.lastIndex = 0;
      if (/line|border/.test(property)) role = "border";
      else if (property === "--ink" || property === "--muted") role = "text";
      else role = luminance(rgb) > 0.5 ? "background" : "accent";
    }
    if (!role) continue;

    let mapped = value.replace(HEX, (hex) => mapColour(theme, hex, role) ?? hex);
    if (role === "background" || role === "text" || role === "border") mapped = mapRgba(theme, mapped, role);
    // Unchanged colours are repeated too, so a later rule such as .nav-link-active keeps its accent
    // over an earlier themed rule such as .nav-link.
    output.push({ text: `${property}: ${mapped}` });
  }
  return output.map((entry) => entry.text);
}

function scopeSelector(themeName, selector) {
  return selector.split(",").map((part) => {
    const trimmed = part.trim();
    if (trimmed === ":root" || trimmed === "html") return `:root[data-theme="${themeName}"]`;
    return `[data-theme="${themeName}"] ${trimmed}`;
  }).join(", ");
}

const rules = parseRules(stripComments(readFileSync(SOURCE, "utf8")));
const blocks = [];
for (const [themeName, theme] of Object.entries(THEMES)) {
  const byMedia = new Map();
  for (const rule of rules) {
    const declarations = themedDeclarations(theme, rule.body);
    if (declarations.length === 0) continue;
    const line = `${scopeSelector(themeName, rule.selector)} { ${declarations.join("; ")}; }`;
    byMedia.set(rule.media, [...(byMedia.get(rule.media) ?? []), line]);
  }
  for (const [media, lines] of byMedia) {
    blocks.push(media ? `${media} {\n  ${lines.join("\n  ")}\n}` : lines.join("\n"));
  }
}

// Hand-tuned touches the automatic mapping cannot infer.
blocks.push(`:root[data-theme="neon"] { --muted: #b3aad3; color-scheme: dark; }
:root[data-theme="pastel"] { --muted: #6e5b90; }
[data-theme="neon"] ::selection { background: #7b2ff7; color: #fff; }
[data-theme="neon"] input::placeholder, [data-theme="neon"] textarea::placeholder { color: #8f86b5; }`);

writeFileSync(OUTPUT, `/* Generated by scripts/build-themes.mjs from globals.css. Do not edit by hand. */\n${blocks.join("\n")}\n`);
console.log(`Themes written: ${Object.keys(THEMES).join(", ")} (${blocks.join("\n").split("\n").length} lines)`);
