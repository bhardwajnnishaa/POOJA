import type { CalendarEntry, FestivalId } from "@/types/calendar";

type CalendarDates = Partial<Record<FestivalId, Record<number, string>>>;
type ParsedCalendar = { dates: CalendarDates; events: CalendarEntry[] };
export type CalendarData = ParsedCalendar;

const CALENDAR_SOURCES = [
  {
    name: "India public holiday calendar",
    url: "https://calendar.google.com/calendar/ical/en.indian%23holiday%40group.v.calendar.google.com/public/basic.ics",
  },
  {
    name: "Islamic holiday calendar",
    url: "https://calendar.google.com/calendar/ical/en.islamic%23holiday%40group.v.calendar.google.com/public/basic.ics",
  },
];
const REFRESH_SECONDS = 6 * 60 * 60;

// How each festival is named in the public holiday calendars, and the months it can fall in.
// The month check stops a similarly named event (e.g. Chaitra Navratri in spring) being taken by mistake.
const FESTIVAL_PATTERNS: { id: FestivalId; match: RegExp; exclude?: RegExp; months?: number[] }[] = [
  { id: "diwali", match: /diwali|deepavali/, exclude: /chhoti|naraka|narak/, months: [10, 11] },
  { id: "eid", match: /eid.*fitr|fitr.*eid|ramzan id|ramadan id/ },
  { id: "rakhi", match: /raksha bandhan|\brakhi\b/, months: [7, 8, 9] },
  { id: "holi", match: /\bholi\b/, exclude: /holika/, months: [2, 3, 4] },
  { id: "navratri", match: /navratri|navaratri/, months: [9, 10] },
  { id: "dussehra", match: /dussehra|dasara|vijaya ?dashami/, months: [9, 10] },
  { id: "karwaChauth", match: /karwa chauth|karva chauth|karaka chaturthi/, months: [10, 11] },
  { id: "dhanteras", match: /dhanteras|dhantrayodashi/, months: [10, 11] },
  { id: "bhaiDooj", match: /bhai du[jo]|bhai dooj|bhau ?beej|bhai phota/, months: [10, 11] },
  { id: "chhath", match: /chhat|chhath/, months: [10, 11] },
  { id: "guruNanak", match: /guru nanak/, months: [10, 11, 12] },
  { id: "christmas", match: /^christmas( day)?$/, months: [12] },
  { id: "newYear", match: /^new year'?s day$/, months: [1] },
  { id: "independenceDay", match: /^independence day$/, months: [8] },
];

function festivalId(name: string, month: number): FestivalId | null {
  const normalized = name.toLowerCase().trim();
  const found = FESTIVAL_PATTERNS.find((pattern) => pattern.match.test(normalized)
    && !pattern.exclude?.test(normalized)
    && (!pattern.months || pattern.months.includes(month)));
  return found?.id ?? null;
}

export function parseCalendar(ics: string, source: string): ParsedCalendar {
  const lines = ics.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const dates: CalendarDates = {};
  const events: CalendarEntry[] = [];
  let summary = "";
  let date = "";
  let description = "";

  function saveEvent() {
    if (!/^\d{8}$/.test(date) || !summary) return;
    const id = festivalId(summary, Number(date.slice(4, 6)));

    const year = Number(date.slice(0, 4));
    const isoDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    if (id) {
      // Keep the earliest match in a year, e.g. the first day of Navratri.
      dates[id] ??= {};
      const saved = dates[id][year];
      if (!saved || isoDate < saved) dates[id][year] = isoDate;
    }

    const normalizedDescription = description.toLowerCase();
    const isPublicHoliday = normalizedDescription.includes("public holiday");
    const isFestival = Boolean(id) || /diwali|holi|raksha|rakhi|eid|dussehra|durga|navratri|chhat|karaka|guru nanak/.test(summary.toLowerCase());

    events.push({
      date: isoDate,
      name: summary.replace(/\\([,;\\])/g, "$1"),
      category: isPublicHoliday ? "public-holiday" : isFestival ? "festival" : "observance",
      source,
      tentative: /tentative/i.test(summary) || normalizedDescription.includes("tentative"),
      ...(id ? { festivalId: id } : {}),
    });
  }

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      summary = "";
      date = "";
      description = "";
    } else if (line.startsWith("SUMMARY:")) {
      summary = line.slice(8).replace(/\\([,;\\])/g, "$1");
    } else if (line.startsWith("DESCRIPTION:")) {
      description = line.slice(12).replace(/\\([,;\\])/g, "$1");
    } else if (line.startsWith("DTSTART")) {
      date = line.match(/^DTSTART(?:;[^:]*)?:(\d{8})/)?.[1] ?? "";
    } else if (line === "END:VEVENT") {
      saveEvent();
    }
  }

  return { dates, events };
}

// First day after the rolling 12-month window, as YYYY-MM-DD.
export function rollingWindowEnd(indiaToday: string) {
  const year = Number(indiaToday.slice(0, 4));
  const month = Number(indiaToday.slice(5, 7));
  const end = new Date(Date.UTC(year, month - 1 + 12, 1));
  return end.toISOString().slice(0, 10);
}

export async function getCalendarData(): Promise<CalendarData> {
  const feeds = await Promise.allSettled(CALENDAR_SOURCES.map(async (source) => {
    const response = await fetch(source.url, {
      headers: { Accept: "text/calendar" },
      next: { revalidate: REFRESH_SECONDS },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) throw new Error(`Calendar returned ${response.status}`);
    return parseCalendar(await response.text(), source.name);
  }));

  const data = feeds.reduce<ParsedCalendar>((combined, feed) => {
    if (feed.status !== "fulfilled") return combined;

    for (const [id, years] of Object.entries(feed.value.dates) as [FestivalId, Record<number, string>][]) {
      combined.dates[id] ??= {};
      for (const [year, isoDate] of Object.entries(years)) {
        const saved = combined.dates[id][Number(year)];
        if (!saved || isoDate < saved) combined.dates[id][Number(year)] = isoDate;
      }
    }

    combined.events.push(...feed.value.events);
    return combined;
  }, { dates: {}, events: [] });

  const indiaToday = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
  // Keep a rolling 12 months: from today up to the end of the 11th month after this one.
  const windowEnd = rollingWindowEnd(indiaToday);
  data.events = data.events
    .filter((event) => event.date >= indiaToday && event.date < windowEnd)
    .sort((first, second) => first.date.localeCompare(second.date));

  if (Object.keys(data.dates).length === 0) throw new Error("Festival calendars are unavailable");
  return data;
}