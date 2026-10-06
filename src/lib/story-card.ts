// Draws a 1080×1920 Instagram Story / WhatsApp Status image for a countdown, entirely in the browser.
export type StoryData = {
  title: string;
  emoji: string;
  target: number;
  dateLabel: string;
};

const WIDTH = 1080;
const HEIGHT = 1920;
const DAY_MS = 24 * 60 * 60 * 1000;

function cssFont(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

// Largest font size, up to max, at which the text fits the width.
function fitText(context: CanvasRenderingContext2D, text: string, weightAndFamily: [string, string], max: number, width: number) {
  let size = max;
  while (size > 40) {
    context.font = `${weightAndFamily[0]} ${size}px ${weightAndFamily[1]}`;
    if (context.measureText(text).width <= width) break;
    size -= 6;
  }
  return size;
}

export async function drawStoryCard(story: StoryData, now: number): Promise<Blob> {
  const serif = cssFont("--font-serif", "Georgia, serif");
  const sans = cssFont("--font-sans", "Arial, sans-serif");
  await Promise.allSettled([document.fonts.load(`600 120px ${serif}`), document.fonts.load(`700 60px ${sans}`)]);

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d")!;

  const background = context.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, "#ff3d7f");
  background.addColorStop(0.55, "#ff7a3d");
  background.addColorStop(1, "#ffc23d");
  context.fillStyle = background;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  // Confetti in fixed spots, so every card looks the same.
  const confetti: [number, number, number, string][] = [
    [110, 420, 14, "#ffffff"], [960, 360, 10, "#ffd23d"], [180, 1180, 9, "#3dffd0"], [930, 1060, 16, "#ffffff"],
    [90, 1560, 12, "#ffd23d"], [990, 1520, 9, "#3dffd0"], [540, 300, 8, "#ffffff"], [820, 1700, 11, "#ffffff"],
  ];
  for (const [x, y, radius, colour] of confetti) {
    context.fillStyle = colour;
    context.globalAlpha = 0.8;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;

  try {
    const logo = await loadImage("/icon-512.png");
    context.save();
    roundedRect(context, 90, 110, 120, 120, 30);
    context.clip();
    context.drawImage(logo, 90, 110, 120, 120);
    context.restore();
  } catch {
    // The card still works without the logo.
  }
  context.fillStyle = "#ffffff";
  context.textBaseline = "middle";
  context.textAlign = "left";
  context.font = `700 56px ${sans}`;
  context.fillText("Festive Clock", 236, 172);

  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.font = `200px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  context.fillText(story.emoji, WIDTH / 2, 640);

  context.fillStyle = "#ffffff";
  fitText(context, story.title, ["600", serif], 140, WIDTH - 140);
  context.fillText(story.title, WIDTH / 2, 850);

  const remaining = story.target - now;
  const days = Math.floor(remaining / DAY_MS);
  if (remaining <= 0) {
    fitText(context, "It's today! 🎉", ["600", serif], 150, WIDTH - 140);
    context.fillText("It's today! 🎉", WIDTH / 2, 1200);
  } else if (days === 0) {
    fitText(context, "Tomorrow! ⏰", ["600", serif], 150, WIDTH - 140);
    context.fillText("Tomorrow! ⏰", WIDTH / 2, 1200);
  } else {
    // Sans digits stay on the line; the serif's old-style 3, 4, 5, 7 and 9 dip into the label below.
    context.font = `700 340px ${sans}`;
    context.fillText(String(days), WIDTH / 2, 1270);
    context.font = `700 72px ${sans}`;
    context.fillText(days === 1 ? "day to go" : "days to go", WIDTH / 2, 1390);
  }

  context.globalAlpha = 0.95;
  context.font = `600 52px ${sans}`;
  context.fillText(story.dateLabel, WIDTH / 2, 1480);
  context.globalAlpha = 1;

  context.fillStyle = "#ffffff";
  roundedRect(context, 90, 1630, WIDTH - 180, 170, 85);
  context.fill();
  context.fillStyle = "#3b261c";
  context.font = `700 46px ${sans}`;
  context.fillText("Count down with me on Festive Clock", WIDTH / 2, 1705);
  context.fillStyle = "#ff3d7f";
  context.font = `700 38px ${sans}`;
  context.fillText(window.location.host, WIDTH / 2, 1762);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create the image"))), "image/png");
  });
}

export type WishCardData = { text: string; eventName: string; emoji: string; footer: string };

// Splits text into lines that fit the width, keeping words whole (works for Hindi too).
function wrapLines(context: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\n+/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (line && context.measureText(next).width > width) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

/** A 1080×1920 greeting card (WhatsApp Status / Instagram Story) with the wish written on it. */
export async function drawWishCard(card: WishCardData): Promise<Blob> {
  const serif = cssFont("--font-serif", "Georgia, serif");
  const sans = cssFont("--font-sans", "Arial, sans-serif");
  await Promise.allSettled([document.fonts.load(`500 64px ${serif}`), document.fonts.load(`700 40px ${sans}`)]);

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d")!;

  // Warm, calm background with a soft glow behind the text.
  const background = context.createLinearGradient(0, 0, 0, HEIGHT);
  background.addColorStop(0, "#fff4e4");
  background.addColorStop(1, "#ffd9b8");
  context.fillStyle = background;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  const glow = context.createRadialGradient(WIDTH / 2, 900, 80, WIDTH / 2, 900, 760);
  glow.addColorStop(0, "rgba(255, 255, 255, .85)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  // Thin double frame.
  context.strokeStyle = "#d9893f";
  context.lineWidth = 4;
  roundedRect(context, 50, 50, WIDTH - 100, HEIGHT - 100, 40);
  context.stroke();
  context.globalAlpha = 0.45;
  context.lineWidth = 2;
  roundedRect(context, 72, 72, WIDTH - 144, HEIGHT - 144, 30);
  context.stroke();
  context.globalAlpha = 1;

  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.font = `170px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  context.fillText(card.emoji, WIDTH / 2, 380);

  context.fillStyle = "#b4561c";
  fitText(context, card.eventName, ["600", serif], 104, WIDTH - 240);
  context.fillText(card.eventName, WIDTH / 2, 530);

  context.fillStyle = "#d9893f";
  context.fillRect(WIDTH / 2 - 70, 580, 140, 5);

  // The wish: the largest size (64 down to 34px) at which it fits the space.
  context.fillStyle = "#2c1f17";
  const top = 660;
  const bottom = 1560;
  let size = 64;
  let lines: string[] = [];
  for (; size >= 34; size -= 4) {
    context.font = `500 ${size}px ${serif}`;
    lines = wrapLines(context, card.text, WIDTH - 260);
    if (lines.length * size * 1.42 <= bottom - top) break;
  }
  const lineHeight = size * 1.42;
  let y = top + (bottom - top - lines.length * lineHeight) / 2 + size;
  for (const line of lines) {
    context.fillText(line, WIDTH / 2, y);
    y += lineHeight;
  }

  // Footer: the watermark that brings people back to make their own.
  context.fillStyle = "#ffffff";
  roundedRect(context, 130, 1650, WIDTH - 260, 150, 75);
  context.fill();
  try {
    const logo = await loadImage("/icon-192.png");
    context.save();
    roundedRect(context, 160, 1675, 100, 100, 24);
    context.clip();
    context.drawImage(logo, 160, 1675, 100, 100);
    context.restore();
  } catch {
    // The card still works without the logo.
  }
  context.textAlign = "left";
  context.fillStyle = "#3b261c";
  context.font = `700 40px ${sans}`;
  context.fillText(card.footer, 285, 1718);
  context.fillStyle = "#c4581a";
  context.font = `700 32px ${sans}`;
  context.fillText(window.location.host, 285, 1765);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create the image"))), "image/png");
  });
}
