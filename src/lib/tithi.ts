// Ekadashi, Purnima and Amavasya dates, worked out from the positions of the Sun and Moon.
// Server-only: astronomy-engine is never sent to the browser.
import { Body, MakeTime, Observer, SearchMoonPhase, SearchRiseSet, SunPosition, type AstroTime } from "astronomy-engine";

export type VratKind = "ekadashi" | "purnima" | "amavasya";

export type VratDay = {
  kind: VratKind;
  name: string;
  /** Popular name, e.g. "Guru Purnima" or "Mauni Amavasya". */
  popularName?: string;
  /** Hindu lunar month (amanta), e.g. "Kartika" or "Adhik Jyeshtha". */
  month: string;
  paksha: "Shukla" | "Krishna";
  /** Observance day in India, YYYY-MM-DD: the day the tithi is running at sunrise in New Delhi. */
  date: string;
  /** Tithi start and end, in milliseconds. */
  start: number;
  end: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
// New Delhi, the usual reference city for Indian panchang dates.
const NEW_DELHI = new Observer(28.6139, 77.209, 216);

const LUNAR_MONTHS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashwin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna",
] as const;

// Ekadashi names by amanta month: [Shukla paksha, Krishna paksha].
const EKADASHI_NAMES: Record<(typeof LUNAR_MONTHS)[number], [string, string]> = {
  Chaitra: ["Kamada", "Varuthini"],
  Vaishakha: ["Mohini", "Apara"],
  Jyeshtha: ["Nirjala", "Yogini"],
  Ashadha: ["Devshayani", "Kamika"],
  Shravana: ["Shravana Putrada", "Aja"],
  Bhadrapada: ["Parivartini", "Indira"],
  Ashwin: ["Papankusha", "Rama"],
  Kartika: ["Dev Uthani", "Utpanna"],
  Margashirsha: ["Mokshada", "Saphala"],
  Pausha: ["Pausha Putrada", "Shattila"],
  Magha: ["Jaya", "Vijaya"],
  Phalguna: ["Amalaki", "Papmochani"],
};
const ADHIK_EKADASHI_NAMES: [string, string] = ["Padmini", "Parama"];

const PURNIMA_NAMES: Partial<Record<(typeof LUNAR_MONTHS)[number], string>> = {
  Vaishakha: "Buddha Purnima",
  Ashadha: "Guru Purnima",
  Ashwin: "Sharad Purnima",
  Kartika: "Kartik Purnima · Dev Deepawali",
};

// Amavasya is named in the North Indian (purnimanta) way, after the month that follows.
const AMAVASYA_NAMES: Partial<Record<(typeof LUNAR_MONTHS)[number], string>> = {
  Magha: "Mauni Amavasya",
  Shravana: "Hariyali Amavasya",
  Ashwin: "Mahalaya Amavasya",
};

// Each tithi is 12° of Moon-minus-Sun longitude. [kind, paksha, start angle].
const TITHIS: [VratKind, "Shukla" | "Krishna", number][] = [
  ["ekadashi", "Shukla", 120],
  ["purnima", "Shukla", 168],
  ["ekadashi", "Krishna", 300],
  ["amavasya", "Krishna", 348],
];

// Lahiri ayanamsa, accurate to well under a minute of arc over this century.
function lahiriAyanamsa(time: AstroTime) {
  const yearsSince2000 = time.tt / 365.25;
  return 23.853 + 0.0139694 * yearsSince2000;
}

// Sidereal zodiac sign of the Sun: 0 = Mesha, 11 = Meena.
function sunSign(time: AstroTime) {
  const longitude = (SunPosition(time).elon - lahiriAyanamsa(time) + 360) % 360;
  return Math.floor(longitude / 30);
}

function indiaDate(ms: number) {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
}

function sunriseOn(date: string) {
  const midnightIst = Date.parse(`${date}T00:00:00Z`) - IST_OFFSET_MS;
  return SearchRiseSet(Body.Sun, NEW_DELHI, +1, MakeTime(new Date(midnightIst)), 1)?.date.getTime() ?? null;
}

// The day whose sunrise falls inside the tithi. A tithi that touches no sunrise (kshaya)
// is kept on the day it begins.
function observanceDay(start: number, end: number) {
  for (let day = Date.parse(`${indiaDate(start)}T00:00:00Z`); day <= Date.parse(`${indiaDate(end)}T00:00:00Z`); day += DAY_MS) {
    const date = new Date(day).toISOString().slice(0, 10);
    const sunrise = sunriseOn(date);
    if (sunrise !== null && sunrise >= start && sunrise < end) return date;
  }
  return indiaDate(start);
}

// The amanta month that begins at this new moon. It takes the name of the solar sign the Sun
// enters during the month; with no such entry it is an Adhik (extra) month.
function lunarMonth(newMoon: AstroTime, nextNewMoon: AstroTime) {
  const startSign = sunSign(newMoon);
  const endSign = sunSign(nextNewMoon);
  const name = LUNAR_MONTHS[(startSign + 1) % 12];
  return { name, adhik: startSign === endSign };
}

/** Ekadashi, Purnima and Amavasya with an observance day from `fromDate` up to (not including) `toDate`. */
export function vratDays(fromDate: string, toDate: string): VratDay[] {
  const from = Date.parse(`${fromDate}T00:00:00Z`) - IST_OFFSET_MS;
  const to = Date.parse(`${toDate}T00:00:00Z`) - IST_OFFSET_MS;
  const days: VratDay[] = [];

  let newMoon = SearchMoonPhase(0, MakeTime(new Date(from - 35 * DAY_MS)), 40);
  while (newMoon && newMoon.date.getTime() < to + 2 * DAY_MS) {
    const nextNewMoon = SearchMoonPhase(0, newMoon.AddDays(1), 40);
    if (!nextNewMoon) break;
    const month = lunarMonth(newMoon, nextNewMoon);
    const monthLabel = month.adhik ? `Adhik ${month.name}` : month.name;
    const followingMonth = SearchMoonPhase(0, nextNewMoon.AddDays(1), 40);
    const amavasyaMonth = month.adhik || !followingMonth ? null : lunarMonth(nextNewMoon, followingMonth).name;

    for (const [kind, paksha, angle] of TITHIS) {
      const startTime = SearchMoonPhase(angle, newMoon, 32);
      const endTime = SearchMoonPhase((angle + 12) % 360, newMoon.AddDays(1), 32);
      if (!startTime || !endTime) continue;
      const start = startTime.date.getTime();
      const end = endTime.date.getTime();
      const date = observanceDay(start, end);
      if (date < fromDate || date >= toDate) continue;

      const ekadashiNames = month.adhik ? ADHIK_EKADASHI_NAMES : EKADASHI_NAMES[month.name];
      let name: string;
      let popularName: string | undefined;
      if (kind === "ekadashi") {
        name = `${ekadashiNames[paksha === "Shukla" ? 0 : 1]} Ekadashi`;
      } else if (kind === "purnima") {
        name = `${monthLabel} Purnima`;
        popularName = month.adhik ? undefined : PURNIMA_NAMES[month.name];
      } else {
        name = amavasyaMonth ? `${amavasyaMonth} Amavasya` : `${monthLabel} Amavasya`;
        popularName = amavasyaMonth ? AMAVASYA_NAMES[amavasyaMonth] : undefined;
      }
      days.push({ kind, name, popularName, month: monthLabel, paksha, date, start, end });
    }
    newMoon = nextNewMoon;
  }

  return days.sort((first, second) => first.start - second.start);
}

export type ShraddhDay = {
  /** e.g. "Pratipada Shraddh". */
  name: string;
  /** Hindi name, e.g. "प्रतिपदा श्राद्ध". */
  nameHi: string;
  /** Day the Shraddh is done in India, YYYY-MM-DD. */
  date: string;
  start: number;
  end: number;
};

// Purnima, then the 15 tithis of the waning fortnight that follows (Pratipada ... Amavasya).
const SHRADDH_TITHIS: [string, string][] = [
  ["Purnima Shraddh", "पूर्णिमा श्राद्ध"],
  ["Pratipada Shraddh", "प्रतिपदा श्राद्ध"],
  ["Dwitiya Shraddh", "द्वितीया श्राद्ध"],
  ["Tritiya Shraddh", "तृतीया श्राद्ध"],
  ["Chaturthi Shraddh", "चतुर्थी श्राद्ध"],
  ["Panchami Shraddh", "पंचमी श्राद्ध"],
  ["Shashthi Shraddh", "षष्ठी श्राद्ध"],
  ["Saptami Shraddh", "सप्तमी श्राद्ध"],
  ["Ashtami Shraddh", "अष्टमी श्राद्ध"],
  ["Navami Shraddh (Matru Navami)", "नवमी श्राद्ध (मातृ नवमी)"],
  ["Dashami Shraddh", "दशमी श्राद्ध"],
  ["Ekadashi Shraddh", "एकादशी श्राद्ध"],
  ["Dwadashi Shraddh", "द्वादशी श्राद्ध"],
  ["Trayodashi Shraddh", "त्रयोदशी श्राद्ध"],
  ["Chaturdashi Shraddh", "चतुर्दशी श्राद्ध"],
  ["Sarva Pitru Amavasya", "सर्व पितृ अमावस्या"],
];

function sunsetOn(date: string) {
  const midnightIst = Date.parse(`${date}T00:00:00Z`) - IST_OFFSET_MS;
  return SearchRiseSet(Body.Sun, NEW_DELHI, -1, MakeTime(new Date(midnightIst)), 1)?.date.getTime() ?? null;
}

// Shraddh is done in Aparahna, the 4th of the five parts of the day. The day whose Aparahna
// overlaps the tithi the most is chosen; a tithi that touches no Aparahna stays on the day it begins.
function aparahnaDay(start: number, end: number) {
  let best = { date: indiaDate(start), overlap: 0 };
  for (let day = Date.parse(`${indiaDate(start)}T00:00:00Z`); day <= Date.parse(`${indiaDate(end)}T00:00:00Z`); day += DAY_MS) {
    const date = new Date(day).toISOString().slice(0, 10);
    const sunrise = sunriseOn(date);
    const sunset = sunsetOn(date);
    if (sunrise === null || sunset === null) continue;
    const part = (sunset - sunrise) / 5;
    const overlap = Math.min(end, sunrise + 4 * part) - Math.max(start, sunrise + 3 * part);
    if (overlap > best.overlap) best = { date, overlap };
  }
  return best.date;
}

/** Pitru Paksha (Shraddh) of a year: Bhadrapada Purnima and the waning fortnight up to Sarva Pitru Amavasya. */
export function pitruPaksha(year: number): ShraddhDay[] {
  // The fortnight always falls between late August and mid-October.
  let newMoon = SearchMoonPhase(0, MakeTime(new Date(Date.UTC(year, 6, 15))), 40);
  while (newMoon) {
    const nextNewMoon = SearchMoonPhase(0, newMoon.AddDays(1), 40);
    if (!nextNewMoon) return [];
    const month = lunarMonth(newMoon, nextNewMoon);
    if (month.name === "Bhadrapada" && !month.adhik) {
      return SHRADDH_TITHIS.map(([name, nameHi], index) => {
        const angle = (168 + index * 12) % 360;
        const start = SearchMoonPhase(angle, newMoon!, 32)!.date.getTime();
        const end = SearchMoonPhase((angle + 12) % 360, MakeTime(new Date(start + 3600e3)), 32)!.date.getTime();
        return { name, nameHi, date: aparahnaDay(start, end), start, end };
      });
    }
    if (newMoon.date.getUTCFullYear() > year) return [];
    newMoon = nextNewMoon;
  }
  return [];
}
