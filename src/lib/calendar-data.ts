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

function festivalId(name: string): FestivalId | null {
  const normalized = name.toLowerCase();
  if (/diwali|deepavali/.test(normalized)) return "diwali";
  if (/eid.*fitr|fitr.*eid/.test(normalized)) return "eid";
  if (/raksha bandhan|\brakhi\b/.test(normalized)) return "rakhi";
  if (/\bholi\b/.test(normalized) && !/holika/.test(normalized)) return "holi";
  return null;
}

function parseCalendar(ics: string, source: string): ParsedCalendar {
  const lines = ics.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const dates: CalendarDates = {};
  const events: CalendarEntry[] = [];
  let summary = "";
  let date = "";
  let description = "";

  function saveEvent() {
    const id = festivalId(summary);
    if (!/^\d{8}$/.test(date) || !summary) return;

    const year = Number(date.slice(0, 4));
    const isoDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    if (id) {
      dates[id] ??= {};
      dates[id][year] ??= isoDate;
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
      Object.assign(combined.dates[id], years);
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
  const currentYear = indiaToday.slice(0, 4);
  data.events = data.events
    .filter((event) => event.date >= indiaToday && event.date.startsWith(currentYear))
    .sort((first, second) => first.date.localeCompare(second.date));

  if (Object.keys(data.dates).length === 0) throw new Error("Festival calendars are unavailable");
  return data;
}