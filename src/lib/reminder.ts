// Calendar reminder at a chosen time in India, shared by the Remind me button and the .ics route.
export type ReminderInput = {
  title: string;
  /** Event day in India, YYYY-MM-DD. */
  date: string;
  /** Alert time in India, HH:MM (24-hour). */
  time: string;
  /** Alert on the day (0) or the day before (1). */
  daysBefore: 0 | 1;
  details?: string;
  yearly?: boolean;
};

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const EVENT_MINUTES = 15;

/** UTC start and end of the reminder event. India has no daylight saving, so this is exact. */
export function reminderTimes({ date, time, daysBefore }: Pick<ReminderInput, "date" | "time" | "daysBefore">) {
  const start = Date.parse(`${date}T${time}:00Z`) - IST_OFFSET_MS - daysBefore * 24 * 60 * 60 * 1000;
  return { start, end: start + EVENT_MINUTES * 60 * 1000 };
}

const utcStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function reminderTitle({ title, daysBefore }: Pick<ReminderInput, "title" | "daysBefore">) {
  return daysBefore ? `${title} is tomorrow!` : `${title} is today!`;
}

export function googleCalendarLink(input: ReminderInput) {
  const { start, end } = reminderTimes(input);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: reminderTitle(input),
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    details: input.details ?? "",
    ctz: "Asia/Kolkata",
  });
  if (input.yearly) params.set("recur", "RRULE:FREQ=YEARLY");
  return `https://calendar.google.com/calendar/render?${params}`;
}

const escapeIcs = (text: string) => text.replace(/[\\,;]/g, (match) => `\\${match}`).replace(/\r?\n/g, "\\n");

/** An event at the chosen time with a sound alert when it starts. */
export function icsFile(input: ReminderInput) {
  const { start, end } = reminderTimes(input);
  const title = reminderTitle(input);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Festive Clock//Remind me//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${utcStamp(start)}-${input.title.replace(/[^a-z0-9]/gi, "").toLowerCase() || "reminder"}@festive-clock`,
    `DTSTAMP:${utcStamp(Date.now())}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    ...(input.yearly ? ["RRULE:FREQ=YEARLY"] : []),
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(input.details ?? "")}`,
    "BEGIN:VALARM",
    "ACTION:AUDIO",
    "TRIGGER:PT0M",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(title)}`,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Reads and checks the query of /api/remind. Returns null for anything malformed. */
export function parseReminderQuery(params: URLSearchParams): ReminderInput | null {
  const title = (params.get("title") ?? "").slice(0, 120);
  const date = params.get("date") ?? "";
  const time = params.get("time") ?? "";
  const daysBefore = params.get("before") === "1" ? 1 : 0;
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  return { title, date, time, daysBefore, details: (params.get("details") ?? "").slice(0, 400), yearly: params.get("yearly") === "1" };
}
