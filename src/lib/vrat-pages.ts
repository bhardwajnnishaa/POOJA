// One page per named vrat, e.g. /vrat/mokshada-ekadashi, built from the computed tithi dates.
import { vratDays, type VratDay, type VratKind } from "@/lib/tithi";

const INDIA_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });
// Dates up to three years ahead, so each page can list the next few years.
const YEARS_AHEAD = 3;

export function vratSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type VratPage = {
  slug: string;
  name: string;
  kind: VratKind;
  popularName?: string;
  /** Upcoming dates, soonest first. The first one is the next observance. */
  dates: VratDay[];
};

let cache: { today: string; pages: Map<string, VratPage> } | null = null;

function windowEnd(today: string) {
  const year = Number(today.slice(0, 4));
  return `${year + YEARS_AHEAD}${today.slice(4, 10)}`;
}

/** Every named vrat with dates from yesterday (a tithi may still be running) to three years ahead. */
export function vratPages(): Map<string, VratPage> {
  const today = INDIA_DATE.format(Date.now());
  if (cache?.today === today) return cache.pages;

  const yesterday = INDIA_DATE.format(Date.now() - 24 * 60 * 60 * 1000);
  const pages = new Map<string, VratPage>();
  for (const day of vratDays(yesterday, windowEnd(today))) {
    const slug = vratSlug(day.name);
    const page = pages.get(slug) ?? { slug, name: day.name, kind: day.kind, popularName: day.popularName, dates: [] };
    page.dates.push(day);
    pages.set(slug, page);
  }
  cache = { today, pages };
  return pages;
}
