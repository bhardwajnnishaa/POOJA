// Daily panchang worked out from the Sun and Moon. Server-only: astronomy-engine never reaches the browser.
import { Body, EclipticGeoMoon, MakeTime, Observer, SearchMoonPhase, SearchRiseSet, SunPosition, type AstroTime } from "astronomy-engine";

const DAY_MS = 24 * 60 * 60 * 1000;
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const NAKSHATRA_SPAN = 360 / 27;

export const PANCHANG_CITIES = [
  { id: "delhi", name: "New Delhi", nameHi: "नई दिल्ली", lat: 28.6139, lon: 77.209 },
  { id: "mumbai", name: "Mumbai", nameHi: "मुंबई", lat: 19.076, lon: 72.8777 },
  { id: "kolkata", name: "Kolkata", nameHi: "कोलकाता", lat: 22.5726, lon: 88.3639 },
  { id: "chennai", name: "Chennai", nameHi: "चेन्नई", lat: 13.0827, lon: 80.2707 },
  { id: "bengaluru", name: "Bengaluru", nameHi: "बेंगलुरु", lat: 12.9716, lon: 77.5946 },
  { id: "hyderabad", name: "Hyderabad", nameHi: "हैदराबाद", lat: 17.385, lon: 78.4867 },
  { id: "ahmedabad", name: "Ahmedabad", nameHi: "अहमदाबाद", lat: 23.0225, lon: 72.5714 },
  { id: "jaipur", name: "Jaipur", nameHi: "जयपुर", lat: 26.9124, lon: 75.7873 },
  { id: "lucknow", name: "Lucknow", nameHi: "लखनऊ", lat: 26.8467, lon: 80.9462 },
  { id: "patna", name: "Patna", nameHi: "पटना", lat: 25.5941, lon: 85.1376 },
] as const;

export type CityId = (typeof PANCHANG_CITIES)[number]["id"];

const TITHI_NAMES: [string, string][] = [
  ["Pratipada", "प्रतिपदा"], ["Dwitiya", "द्वितीया"], ["Tritiya", "तृतीया"], ["Chaturthi", "चतुर्थी"],
  ["Panchami", "पंचमी"], ["Shashthi", "षष्ठी"], ["Saptami", "सप्तमी"], ["Ashtami", "अष्टमी"],
  ["Navami", "नवमी"], ["Dashami", "दशमी"], ["Ekadashi", "एकादशी"], ["Dwadashi", "द्वादशी"],
  ["Trayodashi", "त्रयोदशी"], ["Chaturdashi", "चतुर्दशी"],
];

const NAKSHATRAS: [string, string][] = [
  ["Ashwini", "अश्विनी"], ["Bharani", "भरणी"], ["Krittika", "कृत्तिका"], ["Rohini", "रोहिणी"],
  ["Mrigashira", "मृगशिरा"], ["Ardra", "आर्द्रा"], ["Punarvasu", "पुनर्वसु"], ["Pushya", "पुष्य"],
  ["Ashlesha", "आश्लेषा"], ["Magha", "मघा"], ["Purva Phalguni", "पूर्वा फाल्गुनी"], ["Uttara Phalguni", "उत्तरा फाल्गुनी"],
  ["Hasta", "हस्त"], ["Chitra", "चित्रा"], ["Swati", "स्वाती"], ["Vishakha", "विशाखा"],
  ["Anuradha", "अनुराधा"], ["Jyeshtha", "ज्येष्ठा"], ["Mula", "मूल"], ["Purva Ashadha", "पूर्वाषाढ़ा"],
  ["Uttara Ashadha", "उत्तराषाढ़ा"], ["Shravana", "श्रवण"], ["Dhanishta", "धनिष्ठा"], ["Shatabhisha", "शतभिषा"],
  ["Purva Bhadrapada", "पूर्वा भाद्रपद"], ["Uttara Bhadrapada", "उत्तरा भाद्रपद"], ["Revati", "रेवती"],
];

const YOGAS: [string, string][] = [
  ["Vishkambha", "विष्कम्भ"], ["Priti", "प्रीति"], ["Ayushman", "आयुष्मान"], ["Saubhagya", "सौभाग्य"],
  ["Shobhana", "शोभन"], ["Atiganda", "अतिगण्ड"], ["Sukarma", "सुकर्मा"], ["Dhriti", "धृति"],
  ["Shula", "शूल"], ["Ganda", "गण्ड"], ["Vriddhi", "वृद्धि"], ["Dhruva", "ध्रुव"],
  ["Vyaghata", "व्याघात"], ["Harshana", "हर्षण"], ["Vajra", "वज्र"], ["Siddhi", "सिद्धि"],
  ["Vyatipata", "व्यतीपात"], ["Variyana", "वरीयान"], ["Parigha", "परिघ"], ["Shiva", "शिव"],
  ["Siddha", "सिद्ध"], ["Sadhya", "साध्य"], ["Shubha", "शुभ"], ["Shukla", "शुक्ल"],
  ["Brahma", "ब्रह्म"], ["Indra", "इन्द्र"], ["Vaidhriti", "वैधृति"],
];

const MONTHS: [string, string][] = [
  ["Chaitra", "चैत्र"], ["Vaishakha", "वैशाख"], ["Jyeshtha", "ज्येष्ठ"], ["Ashadha", "आषाढ़"],
  ["Shravana", "श्रावण"], ["Bhadrapada", "भाद्रपद"], ["Ashwin", "आश्विन"], ["Kartika", "कार्तिक"],
  ["Margashirsha", "मार्गशीर्ष"], ["Pausha", "पौष"], ["Magha", "माघ"], ["Phalguna", "फाल्गुन"],
];

const WEEKDAYS: [string, string][] = [
  ["Sunday", "रविवार"], ["Monday", "सोमवार"], ["Tuesday", "मंगलवार"], ["Wednesday", "बुधवार"],
  ["Thursday", "गुरुवार"], ["Friday", "शुक्रवार"], ["Saturday", "शनिवार"],
];

// Which eighth of the daytime each period takes, Sunday first (1 = first eighth after sunrise).
const RAHU_PART = [8, 2, 7, 5, 6, 4, 3];
const YAMAGANDA_PART = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_PART = [7, 6, 5, 4, 3, 2, 1];

export type Named = { en: string; hi: string };
export type Span = { start: number; end: number };

export type PanchangDay = {
  date: string;
  weekday: Named;
  sunrise: number;
  sunset: number;
  moonrise: number | null;
  moonset: number | null;
  tithi: Named & { paksha: Named; end: number; next: Named };
  nakshatra: Named & { end: number; next: Named };
  yoga: Named & { end: number; next: Named };
  /** Month name in the amanta (South and West India) and purnimanta (North India) systems. */
  amantaMonth: Named;
  purnimantaMonth: Named;
  rahuKaal: Span;
  yamaganda: Span;
  gulika: Span;
  /** Not observed on Wednesdays. */
  abhijit: Span | null;
  brahmaMuhurat: Span;
};

const named = ([en, hi]: [string, string]): Named => ({ en, hi });

// Lahiri ayanamsa (about 24.2° in 2026), accurate to well under a minute of arc this century.
const ayanamsa = (time: AstroTime) => 23.853 + 0.0139694 * (time.tt / 365.25);
const siderealSun = (time: AstroTime) => (SunPosition(time).elon - ayanamsa(time) + 360) % 360;
const siderealMoon = (time: AstroTime) => (EclipticGeoMoon(time).lon - ayanamsa(time) + 360) % 360;
const at = (ms: number) => MakeTime(new Date(ms));

function midnightIst(date: string) {
  return Date.parse(`${date}T00:00:00Z`) - IST_OFFSET_MS;
}

function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

function riseSet(body: Body, observer: Observer, direction: 1 | -1, date: string) {
  const start = midnightIst(date);
  const found = SearchRiseSet(body, observer, direction, at(start), 1)?.date.getTime() ?? null;
  return found !== null && found < start + DAY_MS ? found : null;
}

// When a steadily growing angle (in degrees) next reaches a boundary, found by bisection.
function nextCrossing(angleAt: (ms: number) => number, from: number, boundary: number, maxDays: number) {
  const ahead = (ms: number) => ((angleAt(ms) - boundary + 540) % 360) - 180; // negative until crossed
  let low = from;
  let high = from + maxDays * DAY_MS;
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    if (ahead(mid) < 0) low = mid; else high = mid;
  }
  return Math.round(high);
}

function span(sunrise: number, sunset: number, part: number): Span {
  const eighth = (sunset - sunrise) / 8;
  return { start: sunrise + (part - 1) * eighth, end: sunrise + part * eighth };
}

// The amanta month in progress at this moment, named by the sign the Sun enters during it.
function lunarMonthAt(ms: number) {
  let newMoon = SearchMoonPhase(0, at(ms - 31 * DAY_MS), 32)!;
  for (;;) {
    const next = SearchMoonPhase(0, newMoon.AddDays(1), 32)!;
    if (next.date.getTime() > ms) {
      const startSign = Math.floor(siderealSun(newMoon) / 30);
      const endSign = Math.floor(siderealSun(next) / 30);
      return { index: (startSign + 1) % 12, adhik: startSign === endSign };
    }
    newMoon = next;
  }
}

function monthName(index: number, adhik: boolean): Named {
  const [en, hi] = MONTHS[index];
  return adhik ? { en: `Adhik ${en}`, hi: `अधिक ${hi}` } : { en, hi };
}

/** Panchang for one city and day (YYYY-MM-DD, India). Elements are those running at local sunrise. */
export function panchangFor(cityId: CityId, date: string): PanchangDay {
  const city = PANCHANG_CITIES.find((entry) => entry.id === cityId)!;
  const observer = new Observer(city.lat, city.lon, 0);
  const sunrise = riseSet(Body.Sun, observer, 1, date)!;
  const sunset = riseSet(Body.Sun, observer, -1, date)!;
  const previousSunset = riseSet(Body.Sun, observer, -1, addDays(date, -1))!;
  const weekdayIndex = new Date(Date.parse(`${date}T00:00:00Z`)).getUTCDay();

  // Tithi: every 12° of Moon minus Sun.
  const elongation = (ms: number) => (EclipticGeoMoon(at(ms)).lon - SunPosition(at(ms)).elon + 360) % 360;
  const tithiIndex = Math.floor(elongation(sunrise) / 12); // 0..29
  const tithiEnd = SearchMoonPhase(((tithiIndex + 1) * 12) % 360, at(sunrise), 2)!.date.getTime();
  const tithiName = (index: number): Named => {
    const inFortnight = index % 15;
    if (inFortnight === 14) return index < 15 ? { en: "Purnima", hi: "पूर्णिमा" } : { en: "Amavasya", hi: "अमावस्या" };
    return named(TITHI_NAMES[inFortnight]);
  };
  const paksha: Named = tithiIndex < 15 ? { en: "Shukla Paksha", hi: "शुक्ल पक्ष" } : { en: "Krishna Paksha", hi: "कृष्ण पक्ष" };

  // Nakshatra: the Moon's sidereal position in 27 equal parts.
  const moonAt = (ms: number) => siderealMoon(at(ms));
  const nakshatraIndex = Math.floor(moonAt(sunrise) / NAKSHATRA_SPAN);
  const nakshatraEnd = nextCrossing(moonAt, sunrise, ((nakshatraIndex + 1) * NAKSHATRA_SPAN) % 360, 1.6);

  // Yoga: Sun plus Moon (sidereal) in 27 equal parts.
  const yogaAngle = (ms: number) => (siderealSun(at(ms)) + siderealMoon(at(ms))) % 360;
  const yogaIndex = Math.floor(yogaAngle(sunrise) / NAKSHATRA_SPAN);
  const yogaEnd = nextCrossing(yogaAngle, sunrise, ((yogaIndex + 1) * NAKSHATRA_SPAN) % 360, 1.6);

  const month = lunarMonthAt(sunrise);
  const amantaMonth = monthName(month.index, month.adhik);
  // In the waning half, North India already counts the next month.
  const purnimantaMonth = tithiIndex >= 15 && !month.adhik ? monthName((month.index + 1) % 12, false) : amantaMonth;

  const daytime = sunset - sunrise;
  const noon = sunrise + daytime / 2;
  const nightMuhurta = (sunrise - previousSunset) / 15;

  return {
    date,
    weekday: named(WEEKDAYS[weekdayIndex]),
    sunrise,
    sunset,
    moonrise: riseSet(Body.Moon, observer, 1, date),
    moonset: riseSet(Body.Moon, observer, -1, date),
    tithi: { ...tithiName(tithiIndex), paksha, end: tithiEnd, next: tithiName((tithiIndex + 1) % 30) },
    nakshatra: { ...named(NAKSHATRAS[nakshatraIndex]), end: nakshatraEnd, next: named(NAKSHATRAS[(nakshatraIndex + 1) % 27]) },
    yoga: { ...named(YOGAS[yogaIndex]), end: yogaEnd, next: named(YOGAS[(yogaIndex + 1) % 27]) },
    amantaMonth,
    purnimantaMonth,
    rahuKaal: span(sunrise, sunset, RAHU_PART[weekdayIndex]),
    yamaganda: span(sunrise, sunset, YAMAGANDA_PART[weekdayIndex]),
    gulika: span(sunrise, sunset, GULIKA_PART[weekdayIndex]),
    abhijit: weekdayIndex === 3 ? null : { start: noon - daytime / 30, end: noon + daytime / 30 },
    brahmaMuhurat: { start: sunrise - 2 * nightMuhurta, end: sunrise - nightMuhurta },
  };
}
